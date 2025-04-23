import { Button, Card, Radio, Typography } from '@material-tailwind/react'
import React, { useState, useEffect, useContext } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import namer from 'color-namer'; // Import the color-namer library
import { AppContext } from '../../../StoreContext/StoreContext'
import AppLoader from '../../../Loader'
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup'
import toast from 'react-hot-toast'

const Checkout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const checkoutDetailsId = location.state.checkoutId
    const { BASE_URL } = useContext(AppContext);
    const [checkoutData, setCheckoutData] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    const [deliveryCharge, setDeliveryCharge] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [openUserNotLogin, setOpenUserNotLogin] = useState(false);

    // handle non logged users modal
    const handleOpenUserNotLogin = () => {
        setOpenUserNotLogin(!openUserNotLogin);
    };


    const checkoutDetails = checkoutData?.checkout;
    console.log(checkoutDetails);

    // token and userId
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');


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

    // fetch checkout details
    const fetchCheckoutDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/checkout/checkout/${checkoutDetailsId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCheckoutData(response.data || {});
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching checkout details:', error);
        } finally {
            setIsLoading(false)
        }
    };
    useEffect(() => {
        fetchCheckoutDetails();
    }, [BASE_URL, checkoutDetailsId]);


    useEffect(() => {
        const fetchDeliveryChargeList = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/delivery-fee/view`);
                const deliveryFees = response.data.data || [];
                setDeliveryCharge(deliveryFees);
            } catch (error) {
                console.error('Error fetching delivery charge list:', error);
            }
        };
        fetchDeliveryChargeList();
    }, [BASE_URL]);


    // Calculate the delivery charge based on the cart items and available delivery fees
    const calculateDeliveryCharge = (cartItems) => {
        if (!deliveryCharge?.length || !cartItems?.length) return 0;

        return cartItems.reduce((totalFee, item) => {
            const bestMatch = deliveryCharge
                .filter((fee) => fee.quantity <= item.quantity)
                .reduce((max, fee) => Math.max(max, fee.deliveryFee), 0);
            return totalFee + bestMatch;
        }, 0);
    };

    const calculateTotalPrice = () => {
        const subtotal = checkoutDetails?.discountedPrice || 0;
        const deliveryFee = calculateDeliveryCharge(checkoutDetails?.cartItems);
        return subtotal + deliveryFee;
    };

    // handle razorpay
    const handleRazorpayPayment = (orderResponse) => {
        const options = {
            key: "rzp_live_MrSkSujB02FR7y",
            amount: orderResponse.amount,
            currency: orderResponse.currency,
            name: "URBAAN COLLECTIONS",
            description: "Welcome to URBAAN COLLECTIONS, a fashion and lifestyle e-commerce platform located at 3rd Floor, Oberon Mall, Edappally, Ernakulam, Kerala - 682024.",
            image: "/logo.png",
            order_id: orderResponse.razorpayOrderId,
            handler: async function (response) {
                toast.success("Payment Successful!");
                console.log("Razorpay Response:", response);

                // Call backend API to update payment status
                try {
                    const confirmPayload = {
                        userId: userId,  // Ensure userId is passed correctly
                        addressId: checkoutDetails.addressId._id,
                        paymentMethod: paymentMethod,
                        deliveryCharge: calculateDeliveryCharge(checkoutDetails?.cartItems),
                        checkoutId: checkoutDetailsId,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    };

                    console.log("Confirm Order Payload:", confirmPayload);

                    await axios.post(`${BASE_URL}/user/order/confirm`, confirmPayload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    toast.success("Order confirmed!");
                    navigate("/order"); // Redirect user to order confirmation page
                } catch (error) {
                    console.error("Order confirmation failed:", error);
                    alert("Payment success, but order confirmation failed.");
                }
            },
            prefill: {
                name: checkoutDetails?.addressId?.name,
                email: checkoutDetails?.addressId?.email,
                contact: checkoutDetails?.addressId?.number,
            },
            theme: {
                color: "#C21E56",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };



    // handleSubmitOrder
    const handleSubmitOrder = async () => {
        if (!paymentMethod) {
            toast.error("Select any Payment options")
            return;
        }
        try {
            const orderPayload = {
                userId: userId,
                addressId: checkoutDetails.addressId._id,
                deliveryCharge: calculateDeliveryCharge(checkoutDetails?.cartItems),
                paymentMethod: paymentMethod,
                checkoutId: checkoutDetailsId
            }

            console.log(orderPayload);

            const response = await axios.post(`${BASE_URL}/user/order/create`, orderPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
            if (orderPayload.paymentMethod === 'UPI' && response.data.razorpayOrderId) {
                handleRazorpayPayment(response.data)
                fetchCheckoutDetails();
            }
            // else {
            //     // alert(response.message);
            //     navigate('/order')
            // }
        } catch (error) {
            console.error("Order submission error:", error);
            if (error.response.status === 401) {
                handleOpenUserNotLogin()
            }
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    }

    return (
        <>
            <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <h1 className="flex items-center gap-1 text-lg xl:text-xl lg:text-xl font-medium cursor-pointer" onClick={() => navigate(-1)}>
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Back
                </h1>
                <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 mt-10 gap-5'>
                    {isLoading ? (
                        <div className="col-span-2 flex justify-center items-center h-[50vh]">
                            <AppLoader />
                        </div>
                    ) : checkoutDetails === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                            <Typography variant="h6" className="text-gray-700 font-semibold">
                                No orders available.
                            </Typography>
                            <Typography variant="small" className="text-gray-500 mt-2">
                                Once you place an order, it will appear here.
                            </Typography>
                        </div>
                    ) : (
                        <>
                            <Card className='p-4 xl:p-6 lg:p-6 h-fit'>
                                <h1 className='text-secondary font-medium capitalize text-xl mb-3'>Delivery address information</h1>
                                <form action="" className='space-y-3'>
                                    {/* name */}
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base text-secondary">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={checkoutDetails?.addressId?.name}
                                            id="name"
                                            disabled
                                            className="border-[2px] capitalize bg-gray-100 border-gray-100 text-gray-600 p-2 rounded-lg focus:outline-none"
                                        />
                                    </div>
                                    {/* number */}
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base text-secondary">
                                            Phone Number
                                        </label>
                                        <input
                                            type="number"
                                            name="number"
                                            id="number"
                                            disabled
                                            value={checkoutDetails?.addressId?.number}
                                            className="border-[1px] capitalize bg-gray-100 border-gray-100 text-gray-600 p-2 rounded-lg focus:outline-none"
                                        />
                                    </div>
                                    {/* address */}
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base text-secondary">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            id="address"
                                            disabled
                                            value={checkoutDetails?.addressId?.address}
                                            className="border-[1px] capitalize bg-gray-100 border-gray-100 text-gray-600 p-2 rounded-lg focus:outline-none"
                                        />
                                    </div>
                                    {/* landmark */}
                                    <div className="flex flex-col gap-1 w-full">
                                        <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base text-secondary">
                                            Landmark
                                        </label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            id="landmark"
                                            disabled
                                            value={checkoutDetails?.addressId?.landmark}
                                            className="border-[1px] capitalize bg-gray-100 border-gray-100 text-gray-600 p-2 rounded-lg focus:outline-none"
                                        />
                                    </div>
                                    {/* city state pincode */}
                                    <div className="flex gap-1 w-full">
                                        {/* city */}
                                        <div className="flex flex-col gap-1 w-1/3">
                                            <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base text-secondary">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="text"
                                                id="text"
                                                disabled
                                                value={checkoutDetails?.addressId?.city}
                                                className="border-[1px] capitalize w-full bg-gray-100 border-gray-100 text-gray-600 p-2 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                        {/* state */}
                                        <div className="flex flex-col gap-1 w-1/3">
                                            <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base text-secondary">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="text"
                                                id="text"
                                                disabled
                                                value={checkoutDetails?.addressId?.state}
                                                className="border-[1px] capitalize w-full bg-gray-100 border-gray-100 text-gray-600 p-2 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                        {/* pincode */}
                                        <div className="flex flex-col gap-1 w-1/3">
                                            <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base text-secondary">
                                                Pin Code
                                            </label>
                                            <input
                                                type="number"
                                                name="number"
                                                id="number"
                                                disabled
                                                value={checkoutDetails?.addressId?.pincode}
                                                className="border-[1px] capitalize w-full bg-gray-100 border-gray-100 text-gray-600 p-2 rounded-lg focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </Card>
                        </>
                    )}
                    {/* cart and total price */}
                    {isLoading || checkoutDetails?.cartItems === 0 ? (
                        <div className='flex justify-center items-center h-[50vh]'>
                            <AppLoader />
                        </div>
                    ) : (
                        <>
                            <div className='space-y-5'>
                                {/* cart */}
                                <Card className={`p-4 xl:p-6 lg:p-6 overflow-y-auto hide-scrollbar ${checkoutDetails?.cartItems?.length > 1 ? 'max-h-[500px]' : 'min-h-[200px]'}`}>
                                    <h1 className='text-secondary font-medium capitalize text-lg mb-3'>Review your cart</h1>
                                    <div>
                                        {checkoutDetails?.cartItems?.map((item, index) => (
                                            <div key={index} className='flex gap-5 mb-4'>
                                                <div className='w-20 h-28 xl:w-28 xl:h-32'>
                                                    <img
                                                        src={item.productId.images[0]}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => e.target.src = '/no-image.jpg'}
                                                    />
                                                </div>
                                                <div className='flex flex-col justify-between'>
                                                    <div>
                                                        <h1 className='text-base text-secondary font-medium xl:mb-2 lg:mb-2 capitalize'>{item?.productId.title || 'No name'}</h1>
                                                        <ul className='xl:space-y-1 lg:space-y-1'>
                                                            <li className='text-sm capitalize text-secondary'>Color : {getNamedColor(item.color)}</li>
                                                            <li className='text-sm capitalize text-secondary'>Size : {item.size}</li>
                                                            <li className='text-sm capitalize text-secondary'>Quantity : {item.quantity}</li>
                                                        </ul>
                                                    </div>
                                                    <div className='mt-2'>
                                                        <p className='text-secondary font-semibold text-xl'>₹{Math.floor(item.price)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                {/* total price */}
                                <Card className='p-4 xl:p-6 lg:p-6'>
                                    <ul className='space-y-2'>
                                        <li className='flex items-center justify-between'>
                                            <span className='text-secondary flex items-center gap-3'>
                                                Subtotal
                                                <span className='text-sm'>(Including discount)</span>
                                            </span>
                                            <span className='text-secondary font-bold'>
                                                ₹{Math.floor(checkoutDetails?.discountedPrice || 0.00)}
                                            </span>
                                        </li>

                                        <li className='flex items-center justify-between'>
                                            <span className='text-secondary'>Shipping</span>
                                            <span className='text-secondary font-bold'>
                                                ₹{calculateDeliveryCharge(checkoutDetails?.cartItems)}
                                            </span>
                                        </li>

                                        {checkoutDetails?.coupenAmount ? (
                                            <li className='flex items-center justify-between'>
                                                <span className='text-secondary'>Discount</span>
                                                <span className='text-secondary font-bold'>
                                                    ₹{Math.floor(checkoutDetails?.coupen.discountValue || 0.00)}
                                                    {checkoutDetails?.coupen.discountType === "percentage" ? "%" : ""}
                                                </span>
                                            </li>
                                        ) : (
                                            <li className='flex items-center justify-between'>
                                                <span className='text-secondary'>Discount</span>
                                                <span className='text-primary font-normal text-xs'>*No coupon applied</span>
                                            </li>
                                        )}

                                        <li className='flex items-center justify-between'>
                                            <span className='text-secondary'>Total</span>
                                            <span className='text-secondary font-bold'>
                                                ₹{Math.floor(calculateTotalPrice())}
                                            </span>
                                        </li>

                                        <li className='flex items-center justify-between'>
                                            <span className='text-secondary'><b>Please Note</b></span>
                                            <span className='text-primary text-xs cursor-pointer'>
                                                <Link to="/please-note">View</Link>
                                            </span>
                                        </li>
                                    </ul>

                                    <div className='mt-5'>
                                        <h3 className='font-medium text-sm xl:text-base lg:text-base text-secondary'>Payment Options</h3>
                                        <div className='flex flex-col xl:flex-row lg:flex-row lg:items-center xl:items-center gap-0 xl:gap-4 lg:gap-4'>
                                            <Radio
                                                name="type"
                                                label="Cash on Delivery (coming soon)"
                                                color='pink'
                                                disabled
                                                checked={paymentMethod === 'Cash on Delivery'}
                                                onChange={() => setPaymentMethod('Cash on Delivery')} // Explicitly setting the value
                                            />
                                            <Radio
                                                name="type"
                                                label=" UPI"
                                                color='pink'
                                                checked={paymentMethod === 'UPI'}
                                                onChange={() => setPaymentMethod('UPI')} // Explicitly setting the value
                                            />
                                        </div>
                                    </div>
                                    {/* <Link to='/order'> */}
                                    <div className='flex justify-center'>
                                        <Button onClick={handleSubmitOrder} className='hidden w-56 xl:block lg:block mt-5 bg-primary font-custom capitalize font-normal text-sm tracking-wider hover:bg-secondary'>Confirm Order</Button>
                                    </div>
                                    {/* </Link> */}
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className='bg-white shadow-md fixed bottom-0 inset-x-0 z-50 w-full p-4 xl:hidden lg:hidden'>
                <Button onClick={handleSubmitOrder} className='w-full bg-primary font-custom capitalize font-normal text-sm tracking-wider hover:bg-secondary'>Confirm Order</Button>
            </div>


            <UserNotLoginPopup
                open={openUserNotLogin}
                handleOpen={handleOpenUserNotLogin}
            />
        </>
    )
}

export default Checkout

