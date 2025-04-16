import { Card, Chip } from '@material-tailwind/react'
import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { AppContext } from '../../../StoreContext/StoreContext'
import AppLoader from '../../../Loader'
import namer from 'color-namer';

const UserOrders = () => {
    const { BASE_URL } = useContext(AppContext);
    const [userOrders, setUserOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true);
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
                console.log(response.data.orders);

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserOrders();
    }, [])

    return (
        <>
            <div>
                <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-1 gap-5 lg:gap-2'>
                    {isLoading ? (
                        <div className="col-span-2 flex justify-center items-center h-[50vh]">
                            <AppLoader />
                        </div>
                    ) : userOrders.length === 0 ? (
                        <p className='col-span-2 flex justify-center items-center h-[50vh]'>No orders placed yet!</p>
                    ) : (
                        userOrders.map((usrOrder) => (
                            <Card className='p-4' key={usrOrder._id}>
                                <div className='flex justify-between'>
                                    <div className='flex gap-5 lg:gap-2'>
                                        <div className='w-20 h-32 xl:w-24 lg:w-24 xl:h-32 lg:h-32'>
                                            <img
                                                src={usrOrder.products[0]?.productId?.images[0]}
                                                alt="Product"
                                                className='w-full h-full object-cover rounded-lg'
                                                onError={(e) => e.target.src = '/no-image.jpg'} />
                                        </div>
                                        <div>
                                            <h1 className='text-secondary font-medium capitalize truncate overflow-hidden 
                                            whitespace-nowrap w-28 xl:w-36 lg:w-full text-base xl:text-lg lg:text-base'>
                                                {usrOrder.products[0]?.productId?.title || "Product Title Unavailable"}
                                            </h1>
                                            <p className='text-gray-700 text-sm truncate overflow-hidden 
                                            whitespace-nowrap w-28 xl:w-36 lg:w-72 lg:text-xs'>{usrOrder.products[0]?.productId?.description || "No Description Available"}</p>
                                            <ul className='mt-3'>
                                                <li className='text-secondary space-x-2 lg:text-sm'>
                                                    <span>Color :</span>
                                                    <span className='font-semibold'>{getNamedColor(usrOrder.products[0]?.color)}</span>
                                                </li>
                                                <li className='text-secondary space-x-2 lg:text-sm'>
                                                    <span>Size :</span>
                                                    <span className='uppercase font-semibold'>{usrOrder.products[0]?.size}</span>
                                                </li>
                                                <li className='text-secondary space-x-2'>
                                                    <span className='text-sm'>Track ID :</span>
                                                    <span className='font-medium text-sm text-buttonBg'>{usrOrder.TrackId || 'No-Track ID'}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* price */}
                                    <div className='flex flex-col justify-between items-end'>
                                        <Chip
                                            value={usrOrder.status === 'In-Transist' ? 'dispatched' : usrOrder.status === 'invoice_generated' ? 'Dispatched' : usrOrder.status}
                                            className={`text-xs font-normal capitalize ${statusColors[usrOrder.status] || statusColors.default}`}
                                        />
                                        <p className='text-secondary font-bold text-2xl lg:text-xl'>₹{usrOrder.finalPayableAmount}</p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}

                </div>
            </div>
        </>
    )
}

export default UserOrders
