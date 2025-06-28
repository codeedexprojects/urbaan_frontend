import { Button, Card } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiCoupon4Line } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../../../StoreContext/StoreContext';
import toast from 'react-hot-toast';
import ApplyCouponModal from './ApplyCouponModal';
import AppLoader from '../../../Loader';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';
import { FiEdit } from 'react-icons/fi';

const CartDetails = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const { selectedAddress } = location.state || {};
    const { BASE_URL, setOpenUserNotLogin, fetchCartItems, isLoading, setIsLoading, viewCart } = useContext(AppContext);
    const [checkoutId, setCheckoutId] = useState('')
    const [openCoupon, setOpenCoupon] = React.useState(false); // modal for coupon
    const [defaultAddress, setDefaultAddress] = useState([])
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loadingCoupons, setLoadingCoupons] = useState(false);

    // Calculate total quantity
    const totalQuantity = viewCart?.items?.reduce((total, item) => {
        return total + (item.quantity || 0);
    }, 0) || 0;

    // handle Coupon modal
    const handleCouponModalOpen = () => setOpenCoupon(!openCoupon);

    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');

    // Fetch available coupons
    const fetchAvailableCoupons = async () => {
        setLoadingCoupons(true);
        try {
            const response = await axios.get(`${BASE_URL}/user/coupon/list`);
            // Filter only active coupons that are within date range
            const activeCoupons = response.data.filter(coupon => {
                const currentDate = new Date();
                const startDate = new Date(coupon.startDate);
                const endDate = new Date(coupon.endDate);
                return coupon.status === 'active' && currentDate >= startDate && currentDate <= endDate;
            });
            setAvailableCoupons(activeCoupons);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to load available coupons");
        } finally {
            setLoadingCoupons(false);
        }
    };

    // Remove coupon
    const removeCoupon = async () => {
        if (!userId || !token) {
            setOpenUserNotLogin(true);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/user/cart/remove-coupon`, {
                userId: userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Coupon removed successfully!");
                await fetchCartItems();
            }
        } catch (error) {
            console.error("Error removing coupon:", error);
            toast.error(error.response?.data?.message || "Failed to remove coupon");
            if (error.response?.status === 401) {
                setOpenUserNotLogin(true);
            }
        }
    };

    // handle checkout
    const handleCheckout = async () => {
        if (!userId || !token) return;
        try {
            // Use selectedAddress if available, otherwise defaultAddr
            const addressToSend = selectedAddress || defaultAddr;

            if (!addressToSend || !addressToSend._id) {
                toast.error("Please select a valid delivery address.");
                return null; // Ensure the function exits early if no valid address is selected
            }

            const checkoutPayload = {
                userId: userId,
                addressId: addressToSend._id,
            };

            console.log(checkoutPayload);

            const response = await axios.post(`${BASE_URL}/user/checkout/checkout`, checkoutPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newCheckoutId = response.data.checkoutId;
            setCheckoutId(newCheckoutId); // Update local state for completeness
            return newCheckoutId; // Return the checkoutId for further use
        } catch (error) {
            console.error("Error during checkout:", error.response?.data || error.message);
            if (error.response.status === 401) {
                setOpenUserNotLogin(true)
            }
        }
    };

    //handle address with defaultAddress true
    useEffect(() => {
        const fetchDefaultAddress = async () => {
            if (!token || !userId) {
                return;
            }
            try {
                if (token && userId) {
                    const response = await axios.get(`${BASE_URL}/user/address/view/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setDefaultAddress(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDefaultAddress();
    }, []);

    useEffect(() => {
        fetchCartItems();
        fetchAvailableCoupons();
    }, [BASE_URL]);

    // Find the address with defaultAddress set to true
    const defaultAddr = defaultAddress.find(address => address.defaultAddress === true);

    // Check if any coupon is applied
    const isCouponApplied = viewCart?.coupenAmount > 0;

    return (
        <>
            {/* coupon */}
            <Card className='p-4'>
                {isCouponApplied ? (
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <RiCoupon4Line className='text-xl text-green-600' />
                            <div>
                                <h1 className='text-base text-secondary font-medium'>Coupon Applied</h1>
                                <p className='text-sm text-green-600'>
                                    You saved ₹{viewCart?.coupenAmount % 1 >= 0.9
                                        ? Math.ceil(viewCart?.coupenAmount)
                                        : Math.floor(viewCart?.coupenAmount || 0)}
                                    {viewCart?.discountType === 'percentage' ? '%' : ''}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={removeCoupon}
                            size="sm"
                            className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs font-normal capitalize'
                        >
                            Remove
                        </Button>
                    </div>
                ) : (
                    <div>
                        <div className='flex items-center justify-between cursor-pointer' onClick={handleCouponModalOpen}>
                            <h1 className='flex items-center gap-3 text-base text-secondary font-medium'>
                                <RiCoupon4Line className='text-xl' />Apply Coupon</h1>
                            <IoIosArrowForward className='text-secondary text-2xl' />
                        </div>

                        {/* Available Coupons Dropdown */}
                        <div className='mt-3'>


                            {/* Show coupon details when available */}
                            {availableCoupons.length > 0 && !loadingCoupons && (
                                <div className='mt-2 p-2 bg-blue-50 rounded-lg'>
                                    <p className='text-xs text-blue-600 font-medium'>Available Offers:</p>
                                    <div className='mt-1 space-y-1'>
                                        {availableCoupons.map((coupon) => (
                                            <div key={coupon._id} className='text-xs text-gray-600'>
                                                <span className='font-medium text-primary'>{coupon.code}</span> -
                                                <span className='text-green-600 ml-1'>
                                                    {coupon.discountType === 'percentage'
                                                        ? `${coupon.discountValue}% OFF`
                                                        : `₹${coupon.discountValue} OFF`
                                                    }
                                                </span>
                                                <span className='ml-1'>on {coupon.category.map(cat => cat.name).join(', ')}</span>
                                            </div>
                                        ))}
                                        {/* {availableCoupons.length > 2 && (
                                            <p className='text-xs text-gray-500'>+{availableCoupons.length - 2} more offers available</p>
                                        )} */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Card>

            {/* total */}
            <Card className='p-4 xl:p-6 lg:p-6'>
                <h1 className='text-secondary font-medium'>Cart Totals</h1>
                <ul className='mt-3 border-b-[1px] border-gray-400 pb-3 space-y-4'>
                    <li className='flex justify-between items-center'>
                        <span className='font-normal text-sm'>Total Items</span>
                        <span className='text-secondary font-medium text-sm'>{viewCart?.items?.length || 0}</span>
                    </li>
                    <li className='flex justify-between items-center'>
                        <span className='font-normal text-sm'>Total Quantity</span>
                        <span className='text-secondary font-medium text-sm'>{totalQuantity}</span>
                    </li>
                    <li className='flex justify-between items-center'>
                        <span className='font-normal text-sm'>Sub Total</span>
                        <span className='text-secondary font-medium text-sm'>
                            ₹{viewCart?.totalPrice % 1 >= 0.9
                                ? Math.ceil(viewCart?.totalPrice)
                                : Math.floor(viewCart?.totalPrice || 0.00)}
                        </span>
                    </li>
                    {isCouponApplied && (
                        <li className='flex justify-between items-center'>
                            <span className='font-normal text-sm text-green-600'>Coupon Discount</span>
                            <span className='text-green-600 font-medium text-sm'>
                                -₹{viewCart?.coupenAmount % 1 >= 0.9
                                    ? Math.ceil(viewCart?.coupenAmount)
                                    : Math.floor(viewCart?.coupenAmount || 0.00)}
                            </span>
                        </li>
                    )}
                    <p className='mt-4 text-xs text-gray-500 italic'>
                        * Delivery charges will be calculated during checkout.
                    </p>
                </ul>

                <ul className='mt-2'>
                    <li className='flex justify-between items-center'>
                        <span className='text-secondary font-medium text-sm'>Total</span>
                        <span className='text-secondary font-bold text-lg'>₹{viewCart?.discountedTotal % 1 >= 0.9
                            ? Math.ceil(viewCart?.discountedTotal)
                            : Math.floor(viewCart?.discountedTotal || 0.00)}
                        </span>
                    </li>
                </ul>

            </Card>

            {/* delivery address */}
            <Card className='p-4 xl:p-6 lg:p-6'>
                <div className='flex items-center justify-between mb-3'>
                    <h1 className='text-secondary font-medium'>Delivery Address</h1>
                    <Link to='/select-delivery-address'>
                        <p className='flex items-center gap-1 text-primary underline text-sm font-medium'>
                            <FiEdit className='text-base' />
                            Change
                        </p>
                    </Link>
                </div>
                {isLoading ? (
                    <div className='mb-3 flex justify-center items-center'>
                        <AppLoader />
                    </div>
                ) : (
                    <>
                        {((!userId && !token) || (!selectedAddress && !defaultAddr)) ? (
                            <p className='text-sm text-gray-600 text-center my-5'>
                                {(!userId && !token) ? (
                                    <>
                                        <Link to='/login-user' className='text-primary font-semibold'>
                                            Log in
                                        </Link> to add a new address.
                                    </>
                                ) : (
                                    <>No address found.</>
                                )}
                            </p>
                        ) : (
                            <p className='text-sm font-normal mb-3 capitalize'>
                                {selectedAddress
                                    ? `${selectedAddress.address},${selectedAddress.area}, ${selectedAddress.landmark}, ${selectedAddress.city}, ${selectedAddress.state},${selectedAddress.country}, ${selectedAddress.pincode}`
                                    : `${defaultAddr?.address},${defaultAddr?.area}, ${defaultAddr?.landmark}, ${defaultAddr?.city}, ${defaultAddr?.state}, ${defaultAddr?.country}, ${defaultAddr?.pincode}`}
                            </p>
                        )}
                    </>
                )}
                <Button
                    onClick={async () => {
                        const newCheckoutId = await handleCheckout(); // Ensure handleCheckout returns checkoutId
                        if (newCheckoutId) {
                            navigate('/checkout', { state: { checkoutId: newCheckoutId } });
                        }
                    }}
                    className='w-full bg-primary font-custom font-normal text-sm capitalize'
                >
                    Checkout
                </Button>
            </Card>

            <ApplyCouponModal
                handleCouponModalOpen={handleCouponModalOpen}
                openCoupon={openCoupon}
                fetchCartItems={fetchCartItems}
            />

            <UserNotLoginPopup
                title="Session Expired"
                description="Your session has expired. Please log in again to continue."
            />
        </>
    )
}

export default CartDetails