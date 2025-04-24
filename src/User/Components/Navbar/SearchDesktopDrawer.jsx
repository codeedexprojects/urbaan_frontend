import React from "react";
import { Drawer } from "@material-tailwind/react";
import { RiHeart3Fill, RiHeart3Line, RiSearch2Line } from "react-icons/ri";
import { useContext } from "react";
import { AppContext } from "../../../StoreContext/StoreContext";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { MdZoomOutMap } from "react-icons/md";
import { ImageZoomModal } from "../ImageZoomModal/ImageZoomModal";
import { UserNotLoginPopup } from "../UserNotLogin/UserNotLoginPopup";

export function SearchDesktopDrawer({ open, closeSearchDrawer }) {
    const { BASE_URL, searchUser, setSearchUser, searchedProducts, setSearchedProducts, fetchWishlistProducts } = useContext(AppContext);
    const [heartIcons, setHeartIcons] = useState({})
    const [openImageModal, setOpenImageModal] = React.useState(false);
    const [zoomImage, setZoomImage] = useState(null);
    const [openUserNotLogin, setOpenUserNotLogin] = useState(false);

    const userId = localStorage.getItem('userId')

    // handle non logged users modal
    const handleOpenUserNotLogin = () => {
        setOpenUserNotLogin(!openUserNotLogin);
    };


    //handle image zoom
    const handleOpenImageZoom = (productImages, index) => {
        setOpenImageModal(!openImageModal);
        setZoomImage({ images: productImages, currentIndex: index });
    }

    // fetch serahed products
    const fetchUserSearchProducts = async () => {
        if (searchUser.trim() === '') {
            return setSearchedProducts([]); // Clear results if search is empty
        }
        try {
            const params = userId ? { userId } : {};
            const response = await axios.get(`${BASE_URL}/user/search/view?query=${searchUser}`, { params });
            setSearchedProducts(response.data.products) // Setting the search results
            console.log(response.data.products);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchUserSearchProducts()
    }, [searchUser, BASE_URL, setSearchedProducts])

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
            } else {
                toast.error(`${productTitle} removed from wishlist`);
                setHeartIcons(prev => ({ ...prev, [productId]: false }));
                fetchUserSearchProducts();
                fetchWishlistProducts();
            }

        } catch (error) {
            throw new Error(error)
        }
    };

    return (
        <React.Fragment>
            <Drawer open={open} className="p-4 overflow-y-scroll hide-scrollbar" placement='bottom' size={750}>
                <div className="flex flex-col items-center justify-center my-20">
                    <div onClick={closeSearchDrawer} className='absolute right-5 top-5 z-50 cursor-pointer'>
                        <HiXMark className='text-4xl' />
                    </div>
                    <div className='xl:w-[650px] lg:w-[650px] border-b-2 border-gray-700'>
                        <ul>
                            <li className='w-full flex items-center gap-2 text-sm p-4 rounded-full placeholder:font-normal bg-transparent placeholder:text-gray-700'>
                                <input
                                    type="search"
                                    name="search"
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                    placeholder='Search Products, Brands, Categories...'
                                    className='bg-transparent text-lg placeholder:text-gray-600 placeholder:text-lg font-light focus:outline-none text-secondary w-full'
                                />
                                <RiSearch2Line className='text-gray-600 text-3xl' />
                            </li>
                        </ul>
                    </div>
                    {/* <div className='mt-5 flex flex-col justify-center items-center'>
                        <p className='uppercase text-sm tracking-wider text-center'>popular searches</p>
                        <ul className='mt-5 flex flex-wrap items-center gap-2'>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Kurti</li>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Night Wear</li>
                        </ul>
                    </div> */}
                </div>
                <div className="xl:py-5 xl:px-32 lg:py-5 lg:px-32 font-normal">
                    {searchUser.length === 0 ? (
                        <></>
                    ) : (
                        <div className='grid grid-cols-5 gap-5'>
                            {searchedProducts.map((product) => {
                                return (
                                    <div className='group relative' key={product._id}>
                                        <Link
                                            to="/product-details"
                                            state={{
                                                productId: product._id,
                                                categoryId: product.category._id
                                            }}
                                            onClick={closeSearchDrawer}
                                            className="cursor-pointer">
                                            <div className='w-full h-52 xl:h-80 lg:h-80 rounded-xl overflow-hidden'>
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
                                            <h4 className='font-medium text-sm xl:text-lg lg:text-lg capitalize truncate w-40 xl:w-60 lg:w-60'>{product.title.slice(0, 15) + '...'}</h4>
                                            <p className='text-gray-600 font-normal text-xs xl:text-sm lg:text-sm capitalize truncate overflow-hidden 
                                                whitespace-nowrap w-40 xl:w-60 lg:w-60'>
                                                {product.description.slice(0, 15) + '...'}
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
                                )
                            })}
                        </div>
                    )}
                </div>
            </Drawer>

            <UserNotLoginPopup
                open={openUserNotLogin}
                handleOpen={handleOpenUserNotLogin}
            />

            <ImageZoomModal
                open={openImageModal}
                handleOpen={handleOpenImageZoom}
                zoomImage={zoomImage}
            />
        </React.Fragment>
    );
}