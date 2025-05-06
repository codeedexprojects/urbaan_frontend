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
        email: "", // Added email field
    });
    const [isWalkIn, setIsWalkIn] = useState(false); // Added state for isWalkIn
    const [isPrivacyChecked, setIsPrivacyChecked] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCheckboxChange = () => {
        setIsWalkIn((prevState) => !prevState); // Toggle isWalkIn value
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        const isLogin = loginSignUpUser === "login";

        // Define required fields
        const requiredFields = isLogin ? ["phone", "password"] : ["phone", "name", "email", "password"];

        // Validate required fields dynamically
        for (const field of requiredFields) {
            if (!loginFormData[field]?.trim()) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
                return;
            }
        }

        // Ensure privacy policy is checked for sign-up
        if (!isLogin && !isPrivacyChecked) {
            toast.error("To create an account, you must accept the Terms and Privacy Policy.", {
                duration: 3000, 
              
            });
            return;
        }

        try {
            // const isLogin = loginSignUpUser === "login";
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
                    email: loginFormData.email, // Include email
                    isWalkIn: isWalkIn, // Send isWalkIn in the payload
                };
            const response = await axios.post(`${BASE_URL}${endpoint}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(payload);

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
            const errorMessage = error.response?.data?.message ||
                (isLogin
                    ? "Login failed. Please check your credentials."
                    : "Sign up failed. Please try again.");
            console.error("Error:", errorMessage);
            toast.error(errorMessage);
        }
    };


    return (
        <div className="lg:flex lg:justify-center lg:items-center min-h-screen lg:h-screen bg-userBg px-4 py-20 lg:py-0">
            <Card color="transparent" shadow={false}>
                <Typography
                    variant="h4"
                    className="text-primary font-custom text-center text-4xl xl:text-3xl lg:text-3xl"
                >
                    {loginSignUpUser === "login" ? "Login here" : "Create Account"}
                </Typography>
                <Typography
                    color="gray"
                    className="mt-8 xl:mt-1 lg:mt-1 font-semibold font-custom text-secondary text-center text-2xl xl:text-xl"
                >
                    {loginSignUpUser === "login"
                        ? "Welcome! Let’s find your perfect style!"
                        : "Sign up to explore our collections!"}
                </Typography>
                <form
                    className="mt-12 xl:mt-8 lg:mt-8 mb-2 lg:w-full max-w-screen-lg"
                    onSubmit={handleAuthSubmit}
                >
                    <div className="mb-1 flex flex-col gap-6">
                        <div className="flex items-center border-[1px] rounded-lg !border-gray-300 bg-white">
                            <span className="py-3 px-4 text-secondary cursor-default">+91</span>
                            <Input
                                name="phone"
                                type='number'
                                maxLength={16}
                                value={loginFormData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                pattern="\d{10,15}"
                                className="px-0 border-none placeholder:text-blue-gray-300 !font-custom placeholder:font-custom placeholder:opacity-100 focus:border-gray-300 focus:border-[1px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                            <div
                                aria-label={passwordVisible ? "Hide password" : "Show password"}
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="cursor-pointer"
                            >
                                {passwordVisible ? (
                                    <FaRegEye className="text-xl" />
                                ) : (
                                    <FaRegEyeSlash className="text-xl" />
                                )}
                            </div>
                        </div>
                        {loginSignUpUser !== "signUp" && (
                            <Link to='/forget-password'>
                                <Typography className="font-custom text-sm text-primary font-medium text-right">
                                    Forgot Password?
                                </Typography>
                            </Link>
                        )}
                    </div>
                    {loginSignUpUser !== "login" && (
                        <div className="flex items-center">
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
                    )}
                    {loginSignUpUser !== "login" && (
                        <div className="flex items-center">
                            <Checkbox
                                color='pink'
                                checked={isPrivacyChecked}
                                onChange={() => setIsPrivacyChecked(!isPrivacyChecked)}
                                className="h-4 w-4 rounded-sm"
                            />
                            <Typography className="font-custom text-sm text-secondary">
                                I accept the <Link to='/terms-conditions' className='underline text-buttonBg'>Terms and
                                    conditions</Link> and <Link to='/privacy-policy' className='underline text-buttonBg'>Privacy policy</Link>
                            </Typography>
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="mt-6 bg-primary font-custom text-sm font-normal capitalize hover:bg-secondary"
                        fullWidth
                    >
                        {loginSignUpUser === "login" ? "Sign in" : "Continue"}
                    </Button>
                    <Typography
                        color="gray"
                        className="mt-4 text-center text-secondary text-sm font-normal font-custom"
                    >
                        {loginSignUpUser === "login" ? (
                            <>
                                Don't have an account?{" "}
                                <Link
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setLoginSignUpUser("signUp");
                                    }}
                                    className="font-medium text-primary"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setLoginSignUpUser("login");
                                    }}
                                    className="font-medium text-primary"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </Typography>
                    <div className="flex flex-col items-center justify-center gap-4 mt-10">
                        <ul className="flex items-center justify-between w-full">
                            <li className="bg-secondary h-[0.5px] rounded-full w-full"></li>
                            <li className="font-custom font-medium text-secondary text-sm w-full text-center">or Log in with</li>
                            <li className="bg-secondary h-[0.5px] rounded-full w-full"></li>
                        </ul>
                        <div
                            onClick={() => {
                                window.open(`${BASE_URL}/user/auth/google`, "_self");
                            }}
                            className="flex items-center justify-center gap-2 border-[1px] bg-white w-full border-gray-300 text-xl p-3 rounded-lg cursor-pointer"
                        >
                            <div className='w-6 h-6'>
                                <img src="/google.png" alt="" className='w-full h-full object-cover' />
                            </div>
                            <p className='text-secondary text-sm'>Log in with Google</p>
                        </div>

                    </div>

                </form>
            </Card>
        </div>
    );
}
