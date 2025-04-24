import { Button } from '@material-tailwind/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdZoomOutMap } from 'react-icons/md';
import { RiHeart3Fill, RiHeart3Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import AppLoader from '../../../Loader';
import { AppContext } from '../../../StoreContext/StoreContext';
import { ImageZoomModal } from '../ImageZoomModal/ImageZoomModal';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';

const LatestProducts = () => {
  const { BASE_URL, setFav, fetchWishlistProducts, setWishlist } = useContext(AppContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heartIcons, setHeartIcons] = useState({}); // Store heart icon state for each product
  const [showAllLatest, setShowAllLatest] = useState(false);
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [openUserNotLogin, setOpenUserNotLogin] = useState(false);

  const userId = localStorage.getItem('userId');

  // handle non logged users modal
  const handleOpenUserNotLogin = () => {
    setOpenUserNotLogin(!openUserNotLogin);
  };

  //handle image zoom
  const handleOpenImageZoom = (productImages, index) => {
    setOpenImageModal(!openImageModal);
    setZoomImage({ images: productImages, currentIndex: index });
  }

  // fetch latest products
  const fetchLatestProducts = async () => {
    try {
      const params = userId ? { userId } : {}; // Only include userId if it exists
      const response = await axios.get(`${BASE_URL}/user/products/view-products`, { params });
      const filteredProducts = response.data.filter(product => product.isLatestProduct);
      setLatestProducts(filteredProducts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching offer products:", error);
    }
  };
  useEffect(() => {
    fetchLatestProducts();
  }, []);

  // add to wishlist
  const handleWishlist = async (productId, productTitle) => {
    try {
      if (!userId) {
        handleOpenUserNotLogin();
        return;
      }
      const payload = { userId, productId };

      const response = await axios.post(`${BASE_URL}/user/wishlist/add`, payload);
      console.log(response.data);

      if (response.data.isInWishlist) {
        toast.success(`${productTitle} added to wishlist`);
        setHeartIcons(prev => ({ ...prev, [productId]: true }));
        fetchWishlistProducts();
        // setWishlist(prevFav => [...prevFav, { productId }]); 
      } else {
        toast.error(`${productTitle} removed from wishlist`);
        setHeartIcons(prev => ({ ...prev, [productId]: false }));
        // setWishlist(prevFav => prevFav.filter(item => item.productId !== productId));
        fetchLatestProducts();
        fetchWishlistProducts();
      }

    } catch (error) {
      throw new Error(error)
    }
  };

  const visibleProducts = showAllLatest ? latestProducts : latestProducts.slice(0, 5);

  return (
    <>
      <h1 className='text-secondary text-lg xl:text-2xl lg:text-2xl font-semibold text-center xl:text-left'>
        Latest Products
      </h1>
      {
        isLoading ? (
          <div className="col-span-2 flex justify-center items-center h-[50vh]">
            <AppLoader />
          </div>
        ) : latestProducts.length === 0 ? (
          <>
            <p className='col-span-5 flex items-center justify-center h-[50vh]'>No products available</p>
          </>
        ) : (
          <>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-5 gap-5'>
              {visibleProducts.map((product) => {
                return (
                  <div className='group relative' key={product._id}>
                    <Link
                      to="/product-details"
                      state={{
                        productId: product._id,
                        categoryId: product.category._id
                      }}
                      className="cursor-pointer"
                    >
                      <div className='w-full aspect-[2/3] rounded-xl overflow-hidden'>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className='w-full h-full object-cover rounded-xl shadow-md transition transform scale-100 duration-500 ease-in-out cursor-pointer group-hover:scale-105'
                          onError={(e) => e.target.src = '/no-image.jpg'}
                        />
                      </div>

                    </Link>
                    <MdZoomOutMap
                      onClick={() => handleOpenImageZoom(product.images, 0)}
                      className='absolute top-2 left-2 cursor-pointer text-gray-600 bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                    />
                    {product.isInWishlist || heartIcons[product._id] ? (
                      <RiHeart3Fill
                        onClick={() => handleWishlist(product._id, product.title)}
                        className='absolute top-2 right-2 cursor-pointer text-primary bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                      />
                    ) : (
                      <RiHeart3Line
                        onClick={() => handleWishlist(product._id, product.title)}
                        className='absolute top-2 right-2 cursor-pointer bg-white text-gray-600 w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                      />
                    )}
                    <div className='mt-3'>
                      <h4 className='font-medium text-sm xl:text-lg lg:text-lg capitalize truncate w-40 xl:w-60 lg:w-60'>
                        {product.title.slice(0, 15) + '...'}
                      </h4>
                      <p className='text-gray-600 font-normal text-xs xl:text-sm lg:text-sm capitalize truncate overflow-hidden whitespace-nowrap w-40 xl:w-60 lg:w-60'>
                        {product.description.slice(0, 20) + '...'}
                      </p>

                      <div className='flex items-center gap-2 mt-2'>
                        <p className='text-primary text-base xl:text-xl lg:text-xl font-semibold'>
                          ₹{product.offerPrice % 1 >= 0.9 ? Math.ceil(product.offerPrice) : Math.floor(product.offerPrice)}
                        </p>
                        <p className='text-gray-600 text-sm xl:text-base lg:text-base line-through'>
                          ₹{product.actualPrice % 1 >= 0.9 ? Math.ceil(product.actualPrice) : Math.floor(product.actualPrice)}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {latestProducts.length > 5 && (
              <div className='flex justify-center items-center pb-8'>
                <Button
                  onClick={() => setShowAllLatest(!showAllLatest)}
                  className='bg-transparent font-custom shadow-none text-black font-normal capitalize text-sm 
                                    flex items-center gap-2 border border-gray-700 rounded-3xl px-3 py-2 hover:shadow-none'
                >
                  {showAllLatest ? "Show Less" : "Show More"} {showAllLatest ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </Button>
              </div>
            )}
          </>

        )}

      <UserNotLoginPopup
        open={openUserNotLogin}
        handleOpen={handleOpenUserNotLogin}
      />

      <ImageZoomModal
        open={openImageModal}
        handleOpen={handleOpenImageZoom}
        zoomImage={zoomImage}
      />
    </>
  );
};

export default LatestProducts;
