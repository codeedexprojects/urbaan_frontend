import { Card, Chip } from '@material-tailwind/react'
import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
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
        Delivered: "text-shippedBg bg-shippedBg/20",
        Cancelled: "text-cancelBg bg-cancelBg/20",
        Pending: "text-pendingBg bg-pendingBg/20",
        Processing: 'text-processingBg bg-processingBg/20',
        default: "text-intransistBg bg-intransistBg/20",
        "In-Transist": "text-intransistBg bg-intransistBg/20",
    };

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
    }, [BASE_URL, userId, userToken])

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {userOrders.map((order) => (
                            <Card key={order._id} className="p-3">
                                <div className="flex flex-col gap-3">
                                    {/* Product Info */}
                                    <div className="flex gap-3">
                                        <div className="w-12 h-16 flex-shrink-0">
                                            <img
                                                src={order.products[0]?.productId?.images[0]}
                                                alt="Product"
                                                className="w-full h-full object-cover rounded-md"
                                                onError={(e) => e.target.src = '/no-image.jpg'}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-secondary line-clamp-2">
                                                {order.products[0]?.productId?.title || "Product Title Unavailable"}
                                            </h3>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Order: {order.orderId}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Track: {order.TrackId || 'Not available'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status and Price Row */}
                                    <div className="flex justify-between items-center">
                                        <Chip
                                            value={order.status === 'In-Transist' ? 'dispatched' :
                                                order.status === 'invoice_generated' ? 'Dispatched' :
                                                    order.status}
                                            className={`text-[10px] font-normal capitalize ${statusColors[order.status] || statusColors.default}`}
                                        />
                                        <p className="text-sm font-bold text-secondary">
                                            ₹{Math.ceil(order.finalPayableAmount).toFixed(2)}
                                        </p>

                                    </div>
                                </div>
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