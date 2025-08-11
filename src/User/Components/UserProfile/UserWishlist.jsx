import { Button } from '@material-tailwind/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdZoomOutMap } from 'react-icons/md';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import AppLoader from '../../../Loader';
import { AppContext } from '../../../StoreContext/StoreContext';
import { ImageZoomModal } from '../ImageZoomModal/ImageZoomModal';

const UserWishlist = () => {
    const navigate = useNavigate();
    const { BASE_URL, wishlist, fetchWishlistProducts, isLoading, setIsLoading } = useContext(AppContext);
    const [zoomImage, setZoomImage] = useState(null);
    const [openImageModal, setOpenImageModal] = React.useState(false);


    const userId = localStorage.getItem('userId');

    //handle image zoom
    const handleOpenImageZoom = (productImages, index) => {
        setOpenImageModal(!openImageModal);
        setZoomImage({ images: productImages, currentIndex: index });
    }

    // Fetch wishlist products
    useEffect(() => {
        if (userId) {
            fetchWishlistProducts();
        } else {
            setIsLoading(false)
        }
    }, [userId]);

    // Delete wishlist product
    const handleWishlistDelete = async (productId, productTitle) => {
        try {
            const response = await axios.delete(`${BASE_URL}/user/wishlist/remove`, {
                data: { userId, productId },
            });

            if (response.status === 200) {
                toast.success(`${productTitle} is removed from wishlist`);
                fetchWishlistProducts();
            }
        } catch (error) {
            console.error('Error deleting wishlist item:', error);
            toast.error('Failed to remove product');
        }
    };

    // handle clear
    const handleWishlistClear = async () => {
        try {
            await axios.delete(`${BASE_URL}/user/wishlist/clear/${userId}`);
            fetchWishlistProducts();
            toast.success('Wishlist is cleared');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div>
                {wishlist.length > 0 && (
                    <p onClick={handleWishlistClear} className="text-sm underline underline-offset-1 hover:text-primary cursor-pointer flex justify-end items-center">
                        Clear all
                    </p>
                )}
                {isLoading ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className='flex flex-col justify-center items-center !mt-0 mb-20'>
                        <div className='w-64 h-64 xl:w-72 xl:h-72 lg:w-72 lg:h-72'>
                            <img src="/favourite.png" alt="Empty Wishlist" className='w-full h-full object-cover' />
                        </div>
                        <div className='space-y-3 flex flex-col justify-center items-center'>
                            <h1 className='text-2xl font-semibold'>Your wishlist is Empty</h1>
                            <p className='text-center text-gray-600'>
                                You can add an item to your favourites by clicking “Heart Icon”
                            </p>
                            <Link to='/'>
                                <Button className='bg-primary text-sm capitalize w-48 font-custom font-normal'>
                                    Go Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 gap-x-5 gap-y-10 !mt-16'>
                        {wishlist.map((product) => (
                            product.productId && (
                                <div key={product?.productId?._id} className='relative'>
                                    <RiDeleteBin5Line
                                        onClick={() => handleWishlistDelete(product.productId._id, product.productId?.title)}
                                        className='text-deleteBg absolute -top-5 right-1 cursor-pointer'
                                    />
                                     <Link
                                                                            to={`/product-details/${product?.productId?._id}${product?.productId?.category?._id ? `/${product.productId.category._id}` : ""}`}
                                                                            state={{
                                                                                productId: product?.productId?._id,
                                                                                categoryId: product?.productId?.category?._id
                                                                            }}
                                                                            className="group"
                                                                        >
                                        <div className='w-full h-52 xl:h-80 lg:h-80 rounded-xl overflow-hidden'>
                                            <img
                                                src={product?.productId?.images[0]}
                                                alt={product.productId.title}
                                                className='w-full h-full object-cover rounded-xl shadow-md
                                        transition-transform scale-100 duration-500 ease-in-out group-hover:scale-105'
                                                onError={(e) => e.target.src = '/no-image.jpg'}
                                            />
                                        </div>
                                    </Link>
                                    <MdZoomOutMap
                                        onClick={() => handleOpenImageZoom(product?.productId?.images, 0)}
                                        className='absolute top-2 left-2 cursor-pointer text-gray-600 bg-white w-7 h-7 xl:w-8 xl:h-8 lg:w-8 lg:h-8 p-1 rounded-full shadow-md'
                                    />
                                    <div className='mt-3'>
                                        <h4 className='font-medium text-sm xl:text-lg lg:text-lg capitalize truncate w-40 xl:w-60 lg:w-60'>
                                            {product.productId.title}
                                        </h4>
                                        <p className="text-gray-600 text-xs xl:text-sm truncate w-40 xl:w-60 lg:w-60">
                                            {product.productId.description}
                                        </p>
                                        <p className='text-primary text-base xl:text-xl lg:text-xl font-semibold mt-2'>
                                            ₹{product.productId.offerPrice}
                                        </p>
                                    </div>

                                </div>
                            )

                        ))}
                    </div>
                )}
            </div>

            <ImageZoomModal
                open={openImageModal}
                handleOpen={handleOpenImageZoom}
                zoomImage={zoomImage}
            />
        </>
    )
}

export default UserWishlist
