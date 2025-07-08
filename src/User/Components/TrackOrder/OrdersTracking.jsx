import { Card, Chip } from '@material-tailwind/react'
import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { MdLocalShipping, MdReceipt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../../StoreContext/StoreContext'
import AppLoader from '../../../Loader'
import namer from 'color-namer'

const OrdersTracking = () => {
    const navigate = useNavigate()
    const { BASE_URL } = useContext(AppContext)
    const [userOrders, setUserOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const userId = localStorage.getItem('userId')
    const userToken = localStorage.getItem('userToken')

    // Define status color mapping
    const statusColors = {
        Delivered: "text-green-700 bg-green-100 border-green-200",
        Cancelled: "text-red-700 bg-red-100 border-red-200",
        Pending: "text-amber-700 bg-amber-100 border-amber-200",
        Processing: 'text-blue-700 bg-blue-100 border-blue-200',
        default: "text-purple-700 bg-purple-100 border-purple-200",
        "In-Transist": "text-purple-700 bg-purple-100 border-purple-200",
    };

    // Check if user is logged in
    const isLoggedIn = !!userId;

    const getNamedColor = (colorCode) => {
        try {
            const namedColors = namer(colorCode);
            return namedColors.pantone[0].name || "Unknown Color";
        } catch (error) {
            console.error("Invalid color code:", error);
            return "Invalid Color";
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            setIsLoading(false);
            return;
        }

        const fetchUserOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/order/view/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                })
                setUserOrders(response.data.orders)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            }
        }
        fetchUserOrders()
    }, [BASE_URL, userId, userToken, isLoggedIn])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        })
    }

    if (!isLoggedIn) {
        return (
            <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg min-h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <h1 className="flex items-center gap-0 text-lg xl:text-xl lg:text-xl font-medium cursor-pointer" onClick={() => navigate(-1)}>
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Back
                </h1>
                
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-medium text-gray-800 mb-4">Login To View Your Orders</h2>
                        <p className="text-gray-600 mb-6">Please login to access your order history and tracking information.</p>
                        <button
                            onClick={() => navigate('/login-user')}
                            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            Login Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg min-h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
            <h1 className="flex items-center gap-0 text-lg xl:text-xl lg:text-xl font-medium cursor-pointer" onClick={() => navigate(-1)}>
                <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Back
            </h1>

            {/* Order List Section */}
            <div className="mt-10">
                <h2 className="text-secondary font-medium text-xl mb-5">Your Orders</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center h-[50vh]">
                        <AppLoader />
                    </div>
                ) : userOrders.length === 0 ? (
                    <p className="text-center py-10">No orders found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {userOrders.map((order) => (
                            <Card key={order._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
                                {/* Header with Status Badge */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <MdReceipt className="text-gray-500 text-lg" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Order #{order.orderId}
                                            </span>
                                        </div>
                                        <Chip
                                            value={order.status === 'In-Transist' ? 'Dispatched' :
                                                order.status === 'invoice_generated' ? 'Dispatched' :
                                                    order.status}
                                            className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[order.status] || statusColors.default}`}
                                        />
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="p-6">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={order.products[0]?.productId?.images[0]}
                                                alt="Product"
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = '/no-image.jpg'}
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2">
                                                {order.products[0]?.productId?.title || "Product Title Unavailable"}
                                            </h3>
                                            
                                            {/* Order Date */}
                                            {order.createdAt && (
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Ordered on {formatDate(order.createdAt)}
                                                </p>
                                            )}

                                            {/* Tracking Info */}
                                            {order.TrackId && order.TrackId !== 'Not available' && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <MdLocalShipping className="text-gray-400 text-sm" />
                                                    <span className="text-sm text-gray-600">
                                                        Track: {order.TrackId}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="flex items-center justify-between">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-gray-800">
                                                        ₹{Math.ceil(order.finalPayableAmount).toFixed(2)}
                                                    </p>
                                                    {order.products.length > 1 && (
                                                        <p className="text-sm text-gray-500">
                                                            +{order.products.length - 1} more item{order.products.length > 2 ? 's' : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Tracking Services Section */}
            <div className="mt-10">
                <h2 className="text-secondary font-medium text-xl mb-5">Track Your Order</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-5">
                    <a href="https://www.dtdc.in/trace.asp" target="_blank" rel="noreferrer">
                        <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-14">
                                        <img src="/dtdc.jpg" alt="DTDC" className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <div>
                                        <p className="text-secondary font-medium">DTDC Courier</p>
                                        <p className="text-gray-600 text-sm">Track your DTDC shipment</p>
                                    </div>
                                </div>
                                <IoIosArrowForward className="text-secondary text-xl" />
                            </div>
                        </Card>
                    </a>
                    <a href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx" target="_blank" rel="noreferrer">
                        <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-14">
                                        <img src="/speedpost.avif" alt="Speed Post" className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <div>
                                        <p className="text-secondary font-medium">India Post</p>
                                        <p className="text-gray-600 text-sm">Track your Speed Post</p>
                                    </div>
                                </div>
                                <IoIosArrowForward className="text-secondary text-xl" />
                            </div>
                        </Card>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default OrdersTracking