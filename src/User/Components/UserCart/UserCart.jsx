import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import CartItems from './CartItems';
import CartDetails from './CartDetails';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const UserCart = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <h1 className="flex items-center gap-1 text-lg xl:text-xl lg:text-xl font-medium cursor-pointer" onClick={() => navigate('/')}>
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Back
                </h1>
                <div className='grid grid-cols-1 xl:grid-cols-5 gap-5 mt-5'>
                    <div className='space-y-5 xl:col-span-3 lg:col-span-2'>
                        <CartItems />
                    </div>

                    <div className='xl:col-span-2 space-y-5'>
                        <CartDetails />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserCart;
