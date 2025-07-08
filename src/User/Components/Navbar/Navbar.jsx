import React, { useContext, useState } from 'react'
import {
    Navbar,
    Typography,
    Button,
} from "@material-tailwind/react";
import { RiSearch2Fill, RiSearch2Line } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";
import BottomBar from '../BottomBar/BottomBar';
import { AppContext } from '../../../StoreContext/StoreContext';
import MobileSidebar from './MobileSidebar';
import { CategoryMenu } from './CategoryMenu';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { useEffect } from 'react';
import axios from 'axios';
import { SearchDesktopDrawer } from './SearchDesktopDrawer';
import { UserNotLoginPopup } from '../UserNotLogin/UserNotLoginPopup';
import MyWhatsapp from '../Whatsapp/Whatsapp';


const NavList = () => {
    const { wishlist, cartItems } = useContext(AppContext)
    const cartView = cartItems?.length || 0;
    const favView = wishlist?.length || 0;
    const location = useLocation();
    const [navActive, setNavActive] = useState(() => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path == '/orders-tracking') return 'trackOrder'
        if (path == '/favourite') return 'wishlist'
        if (path == '/user-cart') return 'cart'
    })

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setNavActive("home");
        if (path === '/orders-tracking') setNavActive("trackOrder");
        if (path === '/favourite') setNavActive("wishlist");
        if (path === '/user-cart') setNavActive("cart");
    }, [location]);

    return (
        <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography
                as="li"
                onClick={() => setNavActive("home")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "home" ? "text-primary scale-110" : ""}`}
            >
                <Link to="/" >
                    Home
                </Link>
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("categories")}
                className={`p-1 uppercase text-base font-medium cursor-pointer font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "categories" ? "text-primary scale-110" : ""}`}
            >
                <CategoryMenu />
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("trackOrder")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "trackOrder" ? "text-primary scale-110" : ""}`}
            >
                <Link to='/orders-tracking' >
                    Order / Track Order
                </Link>
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("wishlist")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "wishlist" ? "text-primary scale-110" : ""}`}
            >
                <Link to='/favourite' >
                    Wishlist <span>({favView || 0})</span>
                </Link>
            </Typography>
            <Typography
                as="li"
                onClick={() => setNavActive("cart")}
                className={`p-1 uppercase text-base font-medium font-custom text-secondary transition-all transform duration-500 ease-in-out 
                    hover:text-primary ${navActive === "cart" ? "text-primary scale-110" : ""}`}
            >
                <Link to='/user-cart' >
                    Cart <span>({cartView || 0})</span>
                </Link>
            </Typography>
        </ul>
    );
}

const UserNavbar = () => {
    const { openDrawer, handleOpenDrawer, handleCloseDrawer } = useContext(AppContext)
    const location = useLocation();
    const isFavouritePage = location.pathname === "/favourite";
    const isCartPage = location.pathname === "/user-cart";
    const isSearch = location.pathname === '/user-search'
    const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
    const [openUserNotLogin, setOpenUserNotLogin] = useState(false);

    // handle non logged users modal
    const handleOpenUserNotLogin = () => {
        setOpenUserNotLogin(!openUserNotLogin);
    };

    const handleOpenSearchDrawer = () => setOpenSearchDrawer(true);
    const closeSearchDrawer = () => setOpenSearchDrawer(false);

    const token = localStorage.getItem("userToken")
    const userId = localStorage.getItem('userId');

    //extract details from url for google sign up
    useEffect(() => {
        // Extract query parameters from the URL
        const urlParams = new URLSearchParams(location.search);
        const googleToken = urlParams.get("Token");
        const googleRole = urlParams.get("role");
        const googleUserId = urlParams.get("userId");
        const googleName = urlParams.get("name");

        // Debugging: Log extracted values
        console.log("URL Params:", {
            googleToken,
            googleRole,
            googleUserId,
            googleName,
            fullSearch: location.search,
        });

        // Store these details in local storage if they exist
        if (googleToken) localStorage.setItem("userToken", googleToken);
        if (googleRole) localStorage.setItem("role", googleRole);
        if (googleUserId) localStorage.setItem("userId", googleUserId);
        if (googleName) localStorage.setItem("name", googleName);

        // Confirm what was stored
        console.log("Stored in localStorage:", {
            googleToken: localStorage.getItem("userToken"),
            googleRole: localStorage.getItem("role"),
            googleUserId: localStorage.getItem("userId"),
            googleName: localStorage.getItem("name"),
        });
    }, [location.search]);



    // pages where navbar don't visible
    const noNavbar = ["/customer-reviews", "/write-review", "/add-delivery-address", "/edit-delivery-address", "/select-delivery-address",
        "/select-tracking", "/order", '/forget-password', '/reset-otp', '/new-password', '/terms-conditions', '/privacy-policy']


    // Check if current path matches any of the visible routes
    if (noNavbar.includes(location.pathname)) {
        return null // dont render navbar
    }

    return (
        <>
            <div className='hidden sticky top-0 w-full z-50 xl:block lg:block bg-white shadow-lg'>
                <Navbar className="mx-auto max-w-screen-xl py-6 px-0 shadow-none rounded-none">
                    <div className="flex items-center justify-between text-blue-gray-900">
                        <div className="!w-28">
                            <Link to='/'>
                                <img src="/logo.png" alt="" className='w-full object-contain' />
                            </Link>
                        </div>
                        <div className="hidden lg:block xl:flex xl:items-center xl:gap-10 lg:items-center lg:gap-10">
                            <NavList />
                        </div>
                        <div>
                            <ul className='flex items-center gap-10'>
                                <li>
                                    <RiSearch2Line onClick={handleOpenSearchDrawer} className='text-secondary text-3xl cursor-pointer hover:text-primary' />
                                </li>
                                <li>
                                    {token ? (
                                        <UserProfile />
                                    ) : (
                                        <Link to='/login-user'><Button className='bg-primary font-custom font-normal
                                      capitalize text-sm'>Log in</Button>
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </Navbar>

                <div>
                    <MyWhatsapp />
                </div>
            </div>

            {/* mobile view */}
            <div className='xl:hidden lg:hidden sticky top-0 z-10 flex justify-between items-center bg-white shadow-md py-4 px-4'>
                <ul className='flex items-center gap-5'>
                    <li onClick={handleOpenDrawer} className='text-2xl text-secondary hover:text-primary'><IoMenu /></li>
                    <Link to='/'><li className="w-24 cursor-pointer">
                        <img src="/logo.png" alt="" className='w-full object-contain' />
                    </li></Link>
                </ul>
                <ul className='flex items-center gap-3'>
                    <Link to='/user-search'>
                        <li className='text-2xl text-secondary hover:text-primary'>
                            {isSearch ?
                                <>
                                    <RiSearch2Fill className='text-primary' />
                                </>
                                :
                                <>
                                    <RiSearch2Line />
                                </>
                            }
                        </li>
                    </Link>
                </ul>
            </div>
            <div>
                <MyWhatsapp />
            </div>

            <BottomBar />
            <MobileSidebar
                openDrawer={openDrawer}
                handleCloseDrawer={handleCloseDrawer}
            />

            <SearchDesktopDrawer
                open={openSearchDrawer}
                closeSearchDrawer={closeSearchDrawer}
            />

            <UserNotLoginPopup
                open={openUserNotLogin}
                handleOpen={handleOpenUserNotLogin}
            />
        </>
    )
}

export default UserNavbar