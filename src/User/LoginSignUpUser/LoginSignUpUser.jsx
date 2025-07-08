import {
    Button,
    Card,
    Checkbox,
    Input,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../StoreContext/StoreContext";

export function LoginSignUpUser() {
    const [loginSignUpUser, setLoginSignUpUser] = useState("login");
    const { BASE_URL } = useContext(AppContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const [loginFormData, setLoginFormData] = useState({
        phone: "",
        password: "",
        name: "",
        email: "",
    });
    const [isWalkIn, setIsWalkIn] = useState(false);
    const [isPrivacyChecked, setIsPrivacyChecked] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCheckboxChange = () => {
        setIsWalkIn((prevState) => !prevState);
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const isLogin = loginSignUpUser === "login";

        // Define required fields
        const requiredFields = isLogin ? ["phone", "password"] : ["phone", "name", "email", "password"];

        // Validate required fields dynamically
        for (const field of requiredFields) {
            if (!loginFormData[field]?.trim()) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                setIsSubmitting(false);
                return;
            }
        }

        // Validate phone number format
        if (!/^\d{10,15}$/.test(loginFormData.phone)) {
            toast.error("Please enter a valid phone number (10-15 digits)");
            setIsSubmitting(false);
            return;
        }

        // Ensure privacy policy is checked for sign-up
        if (!isLogin && !isPrivacyChecked) {
            toast.error("To create an account, you must accept the Terms and Privacy Policy.", {
                duration: 3000,
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const endpoint = isLogin ? "/user/auth/login" : "/user/auth/register";
            const payload = isLogin
                ? {
                    phone: loginFormData.phone,
                    password: loginFormData.password,
                }
                : {
                    phone: loginFormData.phone,
                    password: loginFormData.password,
                    name: loginFormData.name,
                    email: loginFormData.email,
                    isWalkIn: isWalkIn,
                };

            const response = await axios.post(`${BASE_URL}${endpoint}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle login response
            if (isLogin && response.data.token) {
                localStorage.setItem("userToken", response.data.token);
                localStorage.setItem('userId', response.data.userId);
                navigate("/");
                toast.success("Login Success");
            }

            // Handle sign-up response
            if (!isLogin) {
                navigate('/otp', { state: { phone: loginFormData.phone } });
                toast.success("Please verify OTP via the OTP message.");
            }
        } catch (error) {
            // Improved error handling
            const errorMessage = error.response?.data?.msg || 
                              error.response?.data?.error ||
                              (isLogin 
                                  ? "Login failed. Please check your credentials." 
                                  : "Sign up failed. Please try again.");
            
            toast.error(errorMessage);
            
           
           
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-userBg px-4 py-8 overflow-auto">
            <Card color="transparent" shadow={false} className="w-full max-w-md">
                <Typography
                    variant="h4"
                    className="text-primary font-custom text-center text-3xl mb-2"
                >
                    {loginSignUpUser === "login" ? "Login here" : "Create Account"}
                </Typography>
                <Typography
                    color="gray"
                    className="mb-6 font-semibold font-custom text-secondary text-center text-lg"
                >
                    {loginSignUpUser === "login"
                        ? "Welcome! Let's find your perfect style!"
                        : "Sign up to explore our collections!"}
                </Typography>
                
                <form
                    className="mb-2 w-full"
                    onSubmit={handleAuthSubmit}
                >
                    <div className="mb-4 flex flex-col gap-4">
                        <div className="flex items-center border-[1px] rounded-lg !border-gray-300 bg-white">
                            <span className="py-3 px-4 text-secondary cursor-default">+91</span>
                            <Input
                                name="phone"
                                type='tel'
                                value={loginFormData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                pattern="[0-9]{10,15}"
                                maxLength={15}
                                className="px-0 border-none placeholder:text-blue-gray-300 !font-custom placeholder:font-custom placeholder:opacity-100 focus:border-gray-300 focus:border-[1px]"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                        </div>
                        
                        {loginSignUpUser !== "login" && (
                            <>
                                <Input
                                    name="name"
                                    size="lg"
                                    value={loginFormData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="!border-gray-300 bg-white placeholder:text-blue-gray-300 !font-custom placeholder:font-custom placeholder:opacity-100 focus:border-gray-300 focus:border-[1px]"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    value={loginFormData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="!border-gray-300 bg-white placeholder:text-blue-gray-300 !font-custom placeholder:font-custom placeholder:opacity-100 focus:border-gray-300 focus:border-[1px]"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                            </>
                        )}
                        
                        <div className="flex items-center border-[1px] rounded-lg pr-3 !border-gray-300 bg-white">
                            <Input
                                type={passwordVisible ? "text" : "password"}
                                value={loginFormData.password}
                                onChange={handleInputChange}
                                name="password"
                                size="lg"
                                placeholder="Password"
                                className="border-none placeholder:text-blue-gray-300 !font-custom placeholder:font-custom placeholder:opacity-100 focus:border-gray-300 focus:border-[1px]"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="cursor-pointer text-gray-500 focus:outline-none"
                            >
                                {passwordVisible ? (
                                    <FaRegEye className="text-xl" />
                                ) : (
                                    <FaRegEyeSlash className="text-xl" />
                                )}
                            </button>
                        </div>
                        
                        {loginSignUpUser === "login" && (
                            <Link to='/forget-password' className="self-end">
                                <Typography className="font-custom text-sm text-primary font-medium">
                                    Forgot Password?
                                </Typography>
                            </Link>
                        )}
                    </div>
                    
                    {loginSignUpUser !== "login" && (
                        <>
                            <div className="flex items-center mb-2">
                                <Checkbox
                                    color='pink'
                                    checked={isWalkIn}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 rounded-sm"
                                />
                                <Typography className="font-custom text-sm text-secondary">
                                    Are you a walk-in customer?
                                </Typography>
                            </div>
                            <div className="flex items-center mb-4">
                                <Checkbox
                                    color='pink'
                                    checked={isPrivacyChecked}
                                    onChange={() => setIsPrivacyChecked(!isPrivacyChecked)}
                                    className="h-4 w-4 rounded-sm"
                                />
                                <Typography className="font-custom text-sm text-secondary">
                                    I accept the <Link to='/terms-conditions' className='underline text-buttonBg'>Terms</Link> and <Link to='/privacy-policy' className='underline text-buttonBg'>Privacy policy</Link>
                                </Typography>
                            </div>
                        </>
                    )}
                    
                    <Button
                        type="submit"
                        className="mt-2 bg-primary font-custom text-sm font-normal capitalize hover:bg-secondary"
                        fullWidth
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : (loginSignUpUser === "login" ? "Sign in" : "Continue")}
                    </Button>
                    
                    <Typography
                        color="gray"
                        className="mt-4 text-center text-secondary text-sm font-normal font-custom"
                    >
                        {loginSignUpUser === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    onClick={() => setLoginSignUpUser("signUp")}
                                    className="font-medium text-primary focus:outline-none"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setLoginSignUpUser("login")}
                                    className="font-medium text-primary focus:outline-none"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </Typography>
                    
                    <div className="flex flex-col items-center justify-center gap-4 mt-6">
                        <div className="flex items-center w-full">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="px-3 text-gray-500 font-medium text-sm">or continue with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <button
                            onClick={() => window.open(`${BASE_URL}/user/auth/google`, "_self")}
                            className="flex items-center justify-center gap-2 border border-gray-300 bg-white w-full text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <img src="/google.png" alt="Google" className="w-5 h-5" />
                            <span className="text-sm">Google</span>
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}