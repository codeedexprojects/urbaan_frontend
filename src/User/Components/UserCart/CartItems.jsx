import { Button, Card } from '@material-tailwind/react';
import axios from 'axios';
import namer from 'color-namer'; // Import the color-namer library
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsPlusLg } from "react-icons/bs";
import { HiMinus } from "react-icons/hi2";
import { RiDeleteBin5Line, RiHeart3Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import AppLoader from '../../../Loader';
import { AppContext } from '../../../StoreContext/StoreContext';

const CartItems = () => {
    const { BASE_URL, setCart, fetchCartItems, isLoading, cartItems, setCartItems, setViewCart } = useContext(AppContext);
    const [isUpdating, setIsUpdating] = useState(false);

    // Function to get the nearest named color
    const getNamedColor = (colorCode) => {
        try {
            const namedColors = namer(colorCode);
            return namedColors.pantone[0].name || "Unknown Color";
        } catch (error) {
            console.error("Invalid color code:", error);
            return "Invalid Color";
        }
    };

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        fetchCartItems();
    }, [])


    // handle update
    const updateQuantity = async (itemId, newQuantity) => {
        if (isUpdating || newQuantity <= 0) return;
        setIsUpdating(true);
        if (!userId || !token) return;
        try {
            const item = cartItems.find(item => item._id === itemId);

            if (!item) throw new Error('Product not found in cart.');

            const payload = {
                userId,
                productId: item.productId._id,
                quantity: newQuantity,
                color: item.color,
                size: item.size,
            };

            const response = await axios.patch(`${BASE_URL}/user/cart/update`, payload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                setCartItems(prev => {
                    const updatedItems = prev.map(cartItem =>
                        cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
                    );

                    // Recalculate total price
                    const newTotal = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                    setViewCart(prev => ({
                        ...prev,
                        items: updatedItems,
                        totalPrice: newTotal,
                        discountedTotal: newTotal - (prev.coupenAmount || 0),
                    }));

                    return updatedItems;
                });
            }
        } catch (error) {
            console.error('Error updating quantity:', error.response?.data || error.message);
            toast.error('Failed to update quantity. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };


    // handle remove
    const removeCart = async (itemId) => {
        if (!userId || !token) return;
        // Find the item in the cartItems array
        const item = cartItems.find(item => item.productId._id === itemId);

        if (!item) {
            toast.error('Item not found in the cart.');
            return;
        }

        try {
            const payload = {
                userId: userId,
                productId: item.productId._id,
                color: item.color,
                size: item.size,
            };

            const response = await axios.delete(`${BASE_URL}/user/cart/remove`, {
                data: payload,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Remove item from local state
                const updatedCartItems = cartItems.filter(cartItem => cartItem.productId._id !== itemId);
                setCartItems(updatedCartItems);
                // Update global cart state
                setViewCart(prevViewCart => {
                    // Calculate new total price
                    const newTotalPrice = updatedCartItems.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0);
                    // Recalculate discounted total (you can include coupon amount or any other factors here)
                    const newDiscountedTotal = newTotalPrice - (prevViewCart?.coupenAmount || 0);

                    return {
                        ...prevViewCart,
                        items: updatedCartItems,
                        totalPrice: newTotalPrice,
                        discountedTotal: newDiscountedTotal, // Update the discounted total here
                    };
                });


                toast.success('Item removed from the cart');
            } else {
                console.error("Unexpected response status:", response.status);
                toast.error('Failed to remove item from the cart. Please try again.');
            }
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            toast.error('An error occurred while removing the item. Please try again.');
        }
    };

    const handleClearAll = async () => {
        if (!userId || !token) return;
        try {
            const response = await axios.delete(`${BASE_URL}/user/cart/clear/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
            setCartItems([]); // Clear the local cart items
            setViewCart({ items: [], totalPrice: 0 });
            fetchCartItems();
            toast.success('Cart cleared successfully');
        } catch (error) {
            console.log(error);
            toast.error('Failed to clear the cart');
        }
    }



    return (
        <>
            {cartItems.length > 0 && (
                <p onClick={handleClearAll} className='capitalize underline underline-offset-1 flex justify-end items-center gap-1 text-sm hover:text-primary cursor-pointer'>
                    clear all</p>
            )}

            {isLoading ? (
                <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                    <AppLoader />
                </div>
            ) : cartItems.length === 0 ? (
                <div className='flex flex-col justify-center items-center h-[60vh] !mb-20'>
                    <div className='w-72 h-72 xl:w-96 xl:h-96 lg:w-96 lg:h-96'>
                        <img src="/empty-cart.png" alt="" className='w-full h-full object-cover' />
                    </div>
                    <div className='space-y-3 flex flex-col justify-center items-center'>
                        <h1 className='text-2xl font-semibold'>Your Cart is Empty</h1>
                        <p className='text-center text-gray-600'>Looks like you haven't added anything to your cart yet</p>
                        <Link to='/'>
                            <Button className='bg-primary w-52 text-sm capitalize font-custom font-normal'>Go shopping</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                cartItems.map((item) => (
                    <Card className='p-2 xl:p-6 lg:p-6' key={item._id}>
                        <div className='flex justify-between'>
                            <div className='flex gap-2 xl:gap-6 lg:gap-6'>
                                <div className='w-20 h-28 xl:w-28 xl:h-32 relative'>
                                    {item.productId && item.productId.images && item.productId.images.length > 0 ? (
                                        <img
                                            src={item.productId.images[0]}
                                            alt={item.productId.title}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => e.target.src = '/no-image.jpg'} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                            <span className="text-gray-500 text-sm text-center">Image not available</span>
                                        </div>
                                    )}
                                    {item?.productId?.isInWishlist === true ? (
                                        <RiHeart3Fill
                                            className='absolute top-2 right-2 cursor-pointer text-primary'
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className='flex flex-col justify-between'>
                                    {item.productId ? (
                                        <div>
                                            <h1 className='text-base capitalize text-secondary font-medium xl:mb-2 lg:mb-2'>{item.productId.title}</h1>
                                            <ul className='xl:space-y-1 lg:space-y-1'>
                                                <li className='text-sm capitalize flex items-center gap-1'>
                                                    <span>Color :</span>
                                                    <span className='font-semibold'>{getNamedColor(item.color)}</span>
                                                </li>
                                                <li className='text-sm capitalize flex items-center gap-1'>
                                                    <span>Size :</span>
                                                    <span className='uppercase font-semibold'>{item.size}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div>
                                            <h1 className='text-base text-secondary font-medium xl:mb-2 lg:mb-2'>Product Unavailable</h1>
                                            <p className='text-sm text-gray-500'>This product has been removed from our catalog.</p>
                                        </div>
                                    )}
                                    <ul className="flex items-center">
                                        <li
                                            className={`text-secondary flex items-center justify-center w-7 h-7 rounded-full cursor-pointer border-[1px] 
                                                            border-secondary hover:bg-gray-100 hover:border-gray-500 ${item.quantity === 1 && "cursor-not-allowed opacity-50"}`}
                                            onClick={() => item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)}
                                        >
                                            <HiMinus className="text-lg" />
                                        </li>

                                        <li className="text-secondary cursor-default text-center font-medium text-base w-7">{item.quantity}</li>

                                        <li
                                            className="text-secondary flex items-center justify-center w-7 h-7 rounded-full cursor-pointer border-[1px] 
                                                            border-secondary hover:bg-gray-100 hover:border-gray-500"
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        >
                                            <BsPlusLg className="text-lg" />
                                        </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='flex flex-col items-end justify-between'>
                                <RiDeleteBin5Line
                                    onClick={() => removeCart(item.productId._id)}
                                    className="text-deleteBg cursor-pointer hover:text-primary"
                                />

                                <p className='text-secondary font-semibold text-xl'>₹{item.price}</p>
                            </div>
                        </div>
                    </Card>
                ))
            )
            }
        </>
    );
};

export default CartItems