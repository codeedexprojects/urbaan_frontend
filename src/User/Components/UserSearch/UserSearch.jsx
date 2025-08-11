import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosArrowBack } from 'react-icons/io'
import { MdZoomOutMap } from 'react-icons/md'
import { RiHeart3Fill, RiHeart3Line } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../../StoreContext/StoreContext'
import { ImageZoomModal } from '../ImageZoomModal/ImageZoomModal'
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup'
import UserSearchBar from './UserSearchBar'

const UserSearch = () => {
    const { BASE_URL, searchedProducts, setSearchedProducts, searchUser, fetchWishlistProducts } = useContext(AppContext)
    const navigate = useNavigate()
    const [heartIcons, setHeartIcons] = useState({});
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

    //fetch searched products
    const fetchSearchedProducts = async () => {
        try {
            const params = userId ? { userId } : {};
            const response = await axios.get(`${BASE_URL}/user/products/view-products`, { params });
            setSearchedProducts(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchSearchedProducts()
    }, [BASE_URL])

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
                fetchSearchedProducts();
                fetchWishlistProducts();
            }

        } catch (error) {
            throw new Error(error)
        }
    };

    return (
        <>
            <div className='p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto'>
                <h1 className="flex items-center gap-1 text-lg xl:text-xl lg:text-xl font-medium cursor-pointer" onClick={() => navigate('/')}>
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Back
                </h1>

                <div className='mt-5'>
                    <UserSearchBar />
                </div>

                {searchUser.length === 0 ? (
                    <div>
                        {/* <div className='mt-10'>
                        <h3 className='text-base font-medium text-secondary'>Your Recent Searches</h3>
                        <ul className='mt-5 space-y-2'>
                            <li className='text-sm flex items-center gap-1 text-gray-700'><RxCountdownTimer />Kurti</li>
                            <li className='text-sm flex items-center gap-1 text-gray-700'><RxCountdownTimer />Churidar</li>
                            <li className='text-sm flex items-center gap-1 text-gray-700'><RxCountdownTimer />Ethnic Wear</li>
                            <li className='text-sm flex items-center gap-1 text-gray-700'><RxCountdownTimer />Palazzo</li>
                        </ul>
                    </div>
                    <div className='mt-10'>
                        <h3 className='text-base font-medium text-secondary'>Popular Searches</h3>
                        <ul className='mt-5 flex flex-wrap items-center gap-2'>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Kurti</li>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Night Wear</li>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Palazzo</li>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Churidar</li>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Maternity Wear</li>
                            <li className='text-sm text-primary border-[1px] border-primary rounded-xl px-3 py-2'>Bottoms</li>
                        </ul>
                    </div> */}
                        <p className='flex items-center justify-center h-[50vh] text-gray-500 font-normal text-sm'>Your search here</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 gap-5 mt-10'>
                        {searchedProducts.map((product) => {
                            return (
                                <div className='group relative' key={product._id}>
                                    <Link  to={`/product-details/${product._id}/${product.category._id}`} state={{ productId: product._id, categoryId: product.category?._id }} className="cursor-pointer">
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
                                        <h4 className='font-medium text-sm xl:text-lg lg:text-lg capitalize truncate w-40 xl:w-60 lg:w-60'>{product.title}</h4>
                                        <p className='text-gray-600 font-normal text-xs xl:text-sm lg:text-sm capitalize truncate w-40 xl:w-60 lg:w-60'>{product.description}</p>
                                        <p className='text-primary text-base xl:text-xl lg:text-xl font-semibold mt-2'>
                                            ₹{product.offerPrice}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

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
    )
}

export default UserSearch
