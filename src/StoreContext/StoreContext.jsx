import axios from 'axios';
import React, { createContext, useState } from 'react';
import { useEffect } from 'react';

export const AppContext = createContext();

const StoreContext = ({ children }) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL; // base url
    const [open, setOpen] = useState(null);
    const [openDrawer, setDrawerOpen] = useState(false);
    const [openBottomDrawer, setBottomDrawerOpen] = useState(false);
    const [openSizeDrawer, setOpenSizeDrawer] = useState(false);
    const [modalType, setModalType] = useState(null); // New state for modal type
    const [profile, setProfile] = useState([]) //for userprofile and mobile sidebar
    const [getAddress, setGetAddress] = useState([])
    const [openUserNotLogin, setOpenUserNotLogin] = useState(false); //for non-logged users
    // const [cart, setCart] = useState([]) //is for updating cart length in product details and navbar
    // const [fav, setFav] = useState([]) // is for updating fav length in product details and navbar
    const [searchedProducts, setSearchedProducts] = useState([])
    const [searchUser, setSearchUser] = useState('') // above serach bar state for used in both navbar search in desktop and userSearch.jsx in mobile side
    const [wishlist, setWishlist] = useState([]); //fetching wishlist products
    const [isLoading, setIsLoading] = useState(true);
    const [viewCart, setViewCart] = useState([]) //for UserCart.jsx
    const [cartItems, setCartItems] = useState(viewCart.items || []); // for get details

    // Handle modal
    const handleOpen = (modal, type) => {
        setOpen(modal);
        setModalType(type); // Set the modal type
    };

    // Handle drawer
    const handleOpenDrawer = () => setDrawerOpen(true);
    const handleCloseDrawer = () => setDrawerOpen(false);

    // Handle view all bottom drawer
    const handleOpenBottomDrawer = () => setBottomDrawerOpen(true);
    const handleCloseBottomDrawer = () => setBottomDrawerOpen(false);

    // handle size chart bottom drawer
    const handleOpenSizeDrawer = (e) => {
        e.preventDefault();
        setOpenSizeDrawer(true);
    }
    const handleCloseSizeDrawer = () => setOpenSizeDrawer(false);

    // handle non logged users modal
    const handleOpenUserNotLogin = () => {
        setOpenUserNotLogin(true);
    };

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    // fetch favourite products
    const fetchWishlistProducts = async () => {
        if (!userId) {
            handleOpenUserNotLogin();
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}/user/wishlist/view/${userId}`);
            const items = response.data?.items || [];
            setWishlist(items);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
        finally {
            setIsLoading(false); // ✅ Ensure `isLoading` is false, even if an error occurs or wishlist is empty
        }
    };

    useEffect(() => {
        fetchWishlistProducts();
    }, [userId]);

    //fetch cart items
    const fetchCartItems = async () => {
        if (!userId || !token) {
            handleOpenUserNotLogin();
            return;
        }
        try {
            if (token && userId) {
                const response = await axios.get(`${BASE_URL}/user/cart/view-cart/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setViewCart(response.data);
                setCartItems(response.data.items);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                console.log("Authentication failed: Token invalid or expired");
                // Clear the invalid credentials
                localStorage.removeItem('userToken');
                localStorage.removeItem('userId');
                // Redirect to login or show login modal
                handleOpenUserNotLogin();
            } else {
                // Handle other types of errors
                console.error("Error fetching cart items:", error.message);
            }
        } finally {
            setIsLoading(false)
        }
    };
    useEffect(() => {
        fetchCartItems();
    }, [BASE_URL]);


    return (
        <AppContext.Provider
            value={{
                BASE_URL,
                open,
                handleOpen,
                openDrawer,
                handleOpenDrawer,
                handleCloseDrawer,
                openBottomDrawer,
                handleOpenBottomDrawer,
                handleCloseBottomDrawer,
                handleOpenSizeDrawer,
                handleCloseSizeDrawer,
                openSizeDrawer,
                modalType, // Provide modal type
                profile,
                setProfile,
                getAddress,
                setGetAddress,
                openUserNotLogin,
                setOpenUserNotLogin,
                handleOpenUserNotLogin,
                searchUser,
                searchedProducts,
                setSearchedProducts,
                setSearchUser,
                wishlist,
                setWishlist,
                fetchWishlistProducts,
                isLoading,
                setIsLoading,
                fetchCartItems,
                viewCart,
                setViewCart,
                cartItems,
                setCartItems
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default StoreContext;
