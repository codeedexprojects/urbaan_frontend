import { Button, Card } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiCoupon4Line } from "react-icons/ri";
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../../../StoreContext/StoreContext';
import toast from 'react-hot-toast';
import ApplyCouponModal from './ApplyCouponModal';
import AppLoader from '../../../Loader';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';

const CartDetails = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const { selectedAddress } = location.state || {};
    const { BASE_URL, setOpenUserNotLogin, fetchCartItems, isLoading, setIsLoading, viewCart } = useContext(AppContext);
    const [checkoutId, setCheckoutId] = useState('')
    const [openCoupon, setOpenCoupon] = React.useState(false); // modal for coupon
    const [defaultAddress, setDefaultAddress] = useState([])

    // handle Coupon modal
    const handleCouponModalOpen = () => setOpenCoupon(!openCoupon);

    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');


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
                setIsLoading(false); // Ensure this is called after the data is fetched
            }
        };
        fetchDefaultAddress();
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [BASE_URL]);


    // Find the address with defaultAddress set to true
    const defaultAddr = defaultAddress.find(address => address.defaultAddress === true);


    return (
        <>
            {/* coupon */}
            <Card className='p-4'>
                <Link onClick={handleCouponModalOpen}>
                    <div className='flex items-center justify-between'>
                        <h1 className='flex items-center gap-3 text-base text-secondary font-medium'>
                            <RiCoupon4Line className='text-xl' />Apply Coupon</h1>
                        <IoIosArrowForward className='text-secondary text-2xl' />
                    </div>
                </Link>
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
                        <span className='font-normal text-sm'>Sub Total</span>
                        <span className='text-secondary font-medium text-sm'>
                            ₹{viewCart?.totalPrice % 1 >= 0.9
                                ? Math.ceil(viewCart?.totalPrice)
                                : Math.floor(viewCart?.totalPrice || 0.00)}

                        </span>

                    </li>
                    <li className='flex justify-between items-center'>
                        <span className='font-normal text-sm'>Discount</span>
                        <span className='text-secondary font-medium text-sm'>
                            ₹{viewCart?.coupenAmount % 1 >= 0.9
                                ? Math.ceil(viewCart?.coupenAmount)
                                : Math.floor(viewCart?.coupenAmount || 0.00)}

                            {viewCart?.discountType === 'percentage' ? '%' : ''}
                        </span>
                    </li>

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
                        <p className='text-primary underline text-sm font-medium'>Change</p>
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
                                    ? `${selectedAddress.address}, ${selectedAddress.landmark}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pincode}`
                                    : `${defaultAddr?.address}, ${defaultAddr?.landmark}, ${defaultAddr?.city}, ${defaultAddr?.state}, ${defaultAddr?.pincode}`}
                            </p>
                        )}
                    </>
                )
                }
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
