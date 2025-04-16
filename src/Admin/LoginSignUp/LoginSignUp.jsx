import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((formData) => ({ ...formData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error("Email is required")
            return;
        }
        if (!formData.password) {
            toast.error("Password is required")
            return;
        }
        if (!formData.email || !formData.password) {
            toast.error("Email and password is required")
            return;
        }
        try {
            const BASE_URL = import.meta.env.VITE_BASE_URL;
            console.log("BASE_URL:", BASE_URL);

            const response = await axios.post(`${BASE_URL}/admin/auth/login`, {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate("/adminHome");
            }
            toast.success("Logined successfully!")
        } catch (error) {
            console.error("Login Error:", error);
            setError(error?.response?.data?.message || error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="relative h-screen w-full bg-cover bg-center bg-[url('/banner.jpeg')] bg-no-repeat">
            <div className="absolute inset-0 bg-primary/60 bg-opacity-50"></div>
            <div className="flex justify-center items-center h-full">
                <Card className="bg-white shadow-md p-10 cursor-default">
                    <div className="flex justify-center items-center mb-10">
                        <div className="pt-2 w-28 rounded-3xl">
                            <img src="/logo.png" alt="Logo" className="w-full object-contain" />
                        </div>
                    </div>
                    <Typography variant="h4" className="font-custom text-secondary text-center text-xl">
                        Login to Account
                    </Typography>
                    {error && <Typography color="red" className="text-center mt-2">{error}</Typography>}
                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                        <div className="mb-6 flex flex-col gap-6">
                            <Typography variant="h6" className="-mb-3 font-custom text-sm font-medium">
                                Email address
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="border-[1px] border-gray-400 focus:border-[1px] focus:!border-gray-400 !font-custom"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />

                            <div className="flex items-center justify-between">
                                <Typography variant="h6" className="-mb-3 font-custom text-sm font-medium">
                                    Password
                                </Typography>
                                {/* <Typography
                                    variant="h6"
                                    className="-mb-3 !font-custom text-sm font-medium cursor-pointer hover:text-buttonBg"
                                >
                                    Forget Password ?
                                </Typography> */}
                            </div>
                            <div className="relative">
                                <Input
                                    type={passwordVisible ? "text" : "password"} // Toggle visibility
                                    size="lg"
                                    placeholder='Enter your password'
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className=" border-[1px] border-gray-400 focus:border-[1px] focus:!border-gray-400"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                                <button
                                    type="button"
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                    onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                                    className="absolute top-3 right-3 text-gray-500 focus:outline-none"
                                >
                                    {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="mt-6 font-custom bg-primary hover:bg-secondary text-sm font-normal capitalize tracking-wider"
                            fullWidth
                        >
                            Sign In
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
