import { Card } from '@material-tailwind/react'
import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const OrdersTracking = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <h1 className="flex items-center gap-0 text-lg xl:text-xl lg:text-xl font-medium cursor-pointer" onClick={() => navigate(-1)}>
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Back
                </h1>
                <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-5 mt-10">
                    <a href="https://www.dtdc.in/trace.asp" target='_blank'>
                        <Card className='p-2'>
                            <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-5'>
                                <div className='w-16 h-14'>
                                    <img src="dtdc.jpg" alt="" className='w-full h-full object-cover rounded-lg' />
                                </div>
                                <p className='text-secondary text-sm font-medium'>DTDC Tracking</p>
                                </div>
                                <IoIosArrowForward className='text-secondary text-xl' />
                            </div>
                        </Card>
                    </a>
                    <a href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx" target='_blank'>
                        <Card className='p-2'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-5'>
                                    <div className='w-16 h-14'>
                                        <img src="speedpost.avif" alt="" className='w-full h-full object-cover rounded-lg' />
                                    </div>
                                    <p className='text-secondary text-sm font-medium'>Speed Post Tracking</p>
                                </div>
                                <IoIosArrowForward className='text-secondary text-xl' />
                            </div>
                        </Card>
                    </a>
                </div>
            </div>
        </>
    )
}

export default OrdersTracking
