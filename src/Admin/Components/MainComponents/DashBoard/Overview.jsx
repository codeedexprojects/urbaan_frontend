import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { AppContext } from '../../../../StoreContext/StoreContext';
import { useEffect } from 'react';
import axios from 'axios';

const Overview = () => {
    const [overView, setOverView] = useState([])
    const { BASE_URL } = useContext(AppContext);

    useEffect(() => {
        const fetchOverViews = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${BASE_URL}/admin/dashboard/view-Counts`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setOverView(response.data)
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchOverViews();
    }, [])

    return (
        <div>
            <div className="grid grid-cols-4 gap-5 mt-5">
                <div className='bg-white p-5 rounded-xl shadow-sm'>
                    <ul className='flex justify-between'>
                        <li className='flex flex-col gap-2'>
                            <span className='text-gray-700 text-base'>Total Customers</span>
                            <span className='text-secondary text-3xl font-semibold'>{overView.totalUsers || 0}</span>
                        </li>
                        <li className='w-[50px] h-[50px] bg-O1/30 p-3 rounded-2xl'>
                            <img src="/group.png" alt="" className='w-full h-full object-contain' />
                        </li>
                    </ul>
                    {/* <p className='flex items-center gap-2 mt-8 text-sm text-gray-600'>
                        <FaArrowTrendUp className='text-O3' />
                        <strong className='text-O3 font-normal'>8.5 %</strong> Up from yesterday
                        </p> */}
                </div>
                <div className='bg-white p-5 rounded-xl shadow-sm'>
                    <ul className='flex justify-between'>
                        <li className='flex flex-col gap-2'>
                            <span className='text-gray-700 text-base'>Total Orders</span>
                            <span className='text-secondary text-3xl font-semibold'>{overView.totalOrders || 0}</span>
                        </li>
                        <li className='w-[50px] h-[50px] bg-O2/30 p-3 rounded-2xl'>
                            <img src="/box.png" alt="" className='w-full h-full object-contain' />
                        </li>
                    </ul>
                    {/* <p className='flex items-center gap-2 mt-8 text-sm text-gray-600'><FaArrowTrendUp className='text-O3' />
                        <strong className='text-O3 font-normal'>8.5 %</strong> Up from yesterday</p> */}
                </div>
                <div className='bg-white p-5 rounded-xl shadow-sm'>
                    <ul className='flex justify-between'>
                        <li className='flex flex-col gap-2'>
                            <span className='text-gray-700 text-base'>Recent Orders</span>
                            <span className='text-secondary text-3xl font-semibold'>
                                {overView.recentOrders && overView.recentOrders.length > 0 ? overView.recentOrders[0].recentOrderCount : 0}
                            </span>
                        </li>
                        <li className='w-[50px] h-[50px] bg-O2/30 p-3 rounded-2xl'>
                            <img src="/box.png" alt="" className='w-full h-full object-contain' />
                        </li>
                    </ul>
                    {/* <p className='flex items-center gap-2 mt-8 text-sm text-gray-600'><FaArrowTrendDown className='text-O4' />
                        <strong className='text-O4 font-normal'>8.5 %</strong> Up from yesterday</p> */}
                </div>
                <div className='bg-white p-5 rounded-xl shadow-sm'>
                    <ul className='flex justify-between'>
                        <li className='flex flex-col gap-2'>
                            <span className='text-gray-700 text-base'>Total Earnings</span>
                            <span className='text-secondary text-3xl font-semibold'>{overView.totalRevenue || 0}</span>
                        </li>
                        <li className='w-[50px] h-[50px] bg-O3/30 p-3 rounded-2xl'>
                            <img src="/chart.png" alt="" className='w-full h-full object-contain' />
                        </li>
                    </ul>
                    {/* <p className='flex items-center gap-2 mt-8 text-sm text-gray-600'><FaArrowTrendDown className='text-O4' />
                        <strong className='text-O4 font-normal'>8.5 %</strong> Up from yesterday</p> */}
                </div>
            </div>
        </div>
    )
}

export default Overview
