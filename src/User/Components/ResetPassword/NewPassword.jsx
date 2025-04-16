import { Button } from '@material-tailwind/react';
import React, { useContext, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../StoreContext/StoreContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewPassword = () => {
    const { BASE_URL } = useContext(AppContext);
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate();

    const newToken = localStorage.getItem('newToken');

    const handleNewPassword = async () => {
        if (!newPass || !confirmPass) {
            toast.error('Please fill out all fields.');
            return;
        }

        if (newPass !== confirmPass) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const newPassPayload = {
                tempToken: newToken,
                newPassword: newPass,
            };

            const response = await axios.patch(`${BASE_URL}/user/auth/forgot-password/reset-password`, newPassPayload);

            if (response.status === 200 || response.status === 201) {
                toast.success('New password is created successfully!');
                navigate('/login-user');
            } else {
                toast.error('Failed to create a new password. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <div className="flex justify-center items-center h-[100vh] px-4 py-20 lg:py-0">
                <div className="flex flex-col justify-center items-center space-y-2">
                    <div className="w-20 h-20 bg-primary/10 p-4 rounded-full">
                        <img src="key.png" alt="" className="w-full h-full" />
                    </div>
                    <h1 className="capitalize text-3xl font-semibold">Set new password</h1>
                    <p className="text-sm text-gray-700">
                        Your new password must be different from previously used passwords.
                    </p>
                    <div className="!mt-10 space-y-4 flex flex-col w-full">
                        {/* Password Field */}
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className="w-full border border-gray-500 focus:outline-none bg-white py-2 rounded-lg px-5 placeholder:text-blue-gray-300
                            placeholder:text-sm"
                        />
                        {/* Confirm Password Field */}
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full border border-gray-500 focus:outline-none bg-white py-2 rounded-lg px-5 placeholder:text-blue-gray-300
                            placeholder:text-sm"
                        />
                        <Button
                            onClick={handleNewPassword}
                            className="bg-primary font-custom capitalize font-normal text-sm">
                            Reset password
                        </Button>
                    </div>
                    <Link to="/login-user" className="flex items-center !mt-10">
                        <IoIosArrowBack />
                        Back to log in
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NewPassword;
