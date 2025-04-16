import { Button } from '@material-tailwind/react'
import React from 'react'
import { useContext } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../../StoreContext/StoreContext'
import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

const EnterNumber = () => {
    const { BASE_URL } = useContext(AppContext)
    const [number, setNumber] = useState('')
    const navigate = useNavigate()

    const handleSendOtp = async () => {
        try {
            const numberPayload = {
                phone: number
            }
            const response = await axios.post(`${BASE_URL}/user/auth/forgot-password/send-otp`, numberPayload)
            navigate('/reset-otp', { state: { phone: number } })
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.data.message === "User with this phone number does not exist") {
                toast.error("User not found. Please sign up.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
            console.error(error);
        }
    }
    return (
        <>
            <div className='flex justify-center items-center h-[100vh] px-4 py-20 lg:py-0'>
                <div className='flex flex-col justify-center items-center space-y-2'>
                    <div className='w-20 h-20 bg-primary/10 p-4 rounded-full'>
                        <img src="key.png" alt="" className='w-full h-full' />
                    </div>
                    <h1 className='capitalize text-3xl font-semibold'>Forgot password?</h1>
                    <p className='text-sm text-gray-700'>Enter your registered phone number to receive a code and reset your password.</p>
                    <div className='!mt-10 space-y-4 flex flex-col w-full'>
                        <input
                            type="number"
                            name=""
                            id=""
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder='Enter your number'
                            className="w-full border border-gray-500 focus:outline-none bg-white py-2 rounded-lg px-5 placeholder:text-blue-gray-300
                            placeholder:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <Button onClick={handleSendOtp} className='bg-primary font-custom capitalize font-normal text-sm'>Reset password</Button>
                    </div>
                    <Link
                        to='/login-user'
                        className='flex items-center !mt-10'
                    >
                        <IoIosArrowBack />
                        Back to log in
                    </Link>
                </div>
            </div>
        </>
    )
}

export default EnterNumber
