import React, { useContext, useState, useEffect } from 'react';
import { RxHeart } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { AppContext } from '../../../StoreContext/StoreContext';
import axios from 'axios';
import AppLoader from '../../../Loader';
import { RiHeart3Fill, RiHeart3Line } from 'react-icons/ri';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdZoomOutMap } from 'react-icons/md';
import { ImageZoomModal } from '../ImageZoomModal/ImageZoomModal';

const OfferProducts = () => {
    const { BASE_URL, fetchWishlistProducts, setWishlist } = useContext(AppContext);
    const [offerProducts, setOfferProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [heartIcons, setHeartIcons] = useState({});
    const [showAllOffer, setShowAllOffer] = useState(false);
    const [openImageModal, setOpenImageModal] = React.useState(false);
    const [zoomImage, setZoomImage] = useState(null);
    const [openUserNotLogin, setOpenUserNotLogin] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
  
    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    const userId = localStorage.getItem('userId');

    // handle non logged users modal
    const handleOpenUserNotLogin = () => {
        setOpenUserNotLogin(!openUserNotLogin);
    };

    // handle image zoom
    const handleOpenImageZoom = (productImages, index) => {
        setOpenImageModal(!openImageModal);
        setZoomImage({ images: productImages, currentIndex: index });
    }

    // fetch offer products
    const fetchOfferProducts = async () => {
        try {
            const params = userId ? { userId } : {}; // Only include userId if it exists
            const response = await axios.get(`${BASE_URL}/user/products/view-products`, { params });
            const filteredProducts = response.data.filter(product => product.isOfferProduct);
            setOfferProducts(filteredProducts);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching offer products:", error);
        }
    };

    useEffect(() => {
        fetchOfferProducts();
    }, []);

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
                fetchOfferProducts();
                fetchWishlistProducts();
            }

            // setFav((prevFav) => {
            //     if (response.data.isInWishlist) {
            //         // Product added to wishlist
            //         return prevFav.some(item => item.productId === payload.productId)
            //             ? prevFav
            //             : [...prevFav, payload];
            //     } else {
            //         // Product removed from wishlist
            //         return prevFav.filter(item => item.productId !== payload.productId);
            //     }
            // });

        } catch (error) {
            throw new Error(error)
        }
    };


    const visibleProducts = showAllOffer
  ? offerProducts
  : offerProducts.slice(0, screenWidth < 640 ? 6 : 5);


    return (
        <>
            <h1 className='text-secondary text-lg xl:text-2xl lg:text-2xl font-semibold text-center xl:text-left'>
                Offer Products
            </h1>
            {isLoading ? (
                <div className="col-span-2 flex justify-center items-center h-[50vh]">
                    <AppLoader />
                </div>
            ) : offerProducts.length === 0 ? (
                <p className='col-span-5 flex items-center justify-center h-[50vh]'>No products available</p>
            ) : (
                <>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-5 gap-5 pb-2'>
                        {visibleProducts.map(product => {
                            return (
                                <div className='group relative' key={product._id}>
                                    <Link
                                        to={`/product-details/${product._id}/${product.category._id}`}
                                        state={{ productId: product._id, categoryId: product.category?._id }}
                                        className="cursor-pointer"
                                    >
                                        <div className='w-full aspect-[2/3] relative rounded-xl overflow-hidden'>
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className='w-full h-full object-cover rounded-xl shadow-md transition-transform duration-500 ease-in-out group-hover:scale-105'
                                                onError={(e) => (e.target.src = '/no-image.jpg')}
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
                                        <h4 className='font-medium text-sm xl:text-lg lg:text-lg capitalize truncate w-40 xl:w-60 lg:w-60'>{product.title.slice(0, 15) + '...'}
                                        </h4>
                                        <p className='text-gray-600 capitalize text-xs xl:text-sm lg:text-sm truncate w-40 xl:w-60 lg:w-60'>{product.description.slice(0, 20) + '...'}</p>
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

                    {offerProducts.length > 5 && (
                        <div className='flex justify-center items-center pb-8'>
                            <Button
                                onClick={() => setShowAllOffer(!showAllOffer)}
                                className='bg-transparent font-custom shadow-none text-black font-normal capitalize text-sm 
                                flex items-center gap-2 border border-gray-700 rounded-3xl px-3 py-2 hover:shadow-none'
                            >
                                {showAllOffer ? "Show Less" : "Show More"} {showAllOffer ? <IoIosArrowUp /> : <IoIosArrowDown />}
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

export default OfferProducts;
