import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './Admin/Components/MainComponents/PrivateRoute/PrivateRoute';
import LoginSignUp from "./Admin/LoginSignUp/LoginSignUp";
import Home from "./Admin/Home/Home";
import Dashboard from "./Admin/Components/MainComponents/DashBoard/DashBoard";
import Products from "./Admin/Components/MainComponents/Products/Products";
import Category from "./Admin/Components/MainComponents/Category/Category";
import SubCategory from "./Admin/Components/MainComponents/SubCategory/SubCategory";
import OrderList from "./Admin/Components/MainComponents/OrderList/OrderList";
import Coupons from "./Admin/Components/MainComponents/Coupons/Coupons";
import UsersList from "./Admin/Components/MainComponents/UsersList/UsersList";
import Invoice from "./Admin/Components/MainComponents/Invoice/Invoice";
import AddProduct from "./Admin/Components/MainComponents/Products/AddProduct";
import ViewUserDetails from "./Admin/Components/MainComponents/UsersList/ViewUserManagement";
import EditProduct from "./Admin/Components/MainComponents/Products/EditProduct";
import AdminCarousel from './Admin/Components/MainComponents/AdminCarousel/AdminCarousel';
import SizeCharts from './Admin/Components/MainComponents/SizeChart/SizeChart';


import ScrollToTop from "./ScrollToTop";
import { LoginSignUpUser } from './User/LoginSignUpUser/LoginSignUpUser';
import { Otp } from './User/Otp/Otp';
import UserHome from './User/Home/Home';
import UserNavbar from './User/Components/Navbar/Navbar';
import ProductDetails from './User/Components/ProductDetails/ProductDetails';
import CustomerReviews from './User/Components/ProductDetails/CustomerReviews';
import WriteReview from './User/Components/ProductDetails/WriteReview';
import FavouriteProduct from './User/Components/FavouriteProduct/FavouriteProduct';
import UserProfile from './User/Components/UserProfile/UserProfile';
import ViewAllCategory from './User/Components/UserCategory/ViewAllCategory';
import UserSearch from './User/Components/UserSearch/UserSearch';
import UserCart from './User/Components/UserCart/UserCart';
import SelectUserAddress from './User/Components/UserAddress/SelectUserAddress';
import OrdersTracking from './User/Components/TrackOrder/OrdersTracking';
import AllCategory from './User/Components/UserCategory/AllCategory';
import AddUserAddress from './User/Components/UserAddress/AddUserAddress';
import EditUserAddress from './User/Components/UserAddress/EditUserAddress';
import NotFound from './NotFound';
import UserAddress from './User/Components/UserProfile/UserAddress';
import UserOrders from './User/Components/UserProfile/UserOrders';
import Delivery from './Admin/Components/MainComponents/Delivery/Delivery';
import Checkout from './User/Components/Checkout/Checkout';
import OrderPlaced from './User/Components/Order.jsx/OrderPlaced';
import EnterNumber from './User/Components/ResetPassword/EnterNumber';
import { ResetOtp } from './User/Components/ResetPassword/ResetOtp';
import NewPassword from './User/Components/ResetPassword/NewPassword';
import PrivacyPolicy from './User/Components/Footer/PrivacyPolicy';
import TermsConditions from './User/Components/Footer/Terms&Conditions';
import ShippingPolicy from './User/Components/Footer/ShippingPolicy'
import RefundPolicy from './User/Components/Footer/RefundPolicy'
import PleaseNote from './User/Components/Checkout/PleaseNote'
import PricingPolicy from './User/Components/Footer/PricingPolicy'
import MaterialsList from './Admin/Components/MainComponents/Material/AddMaterial';


const FullRoutes = () => {
    return (
        <Router>
            <RoutesWithLocation />
        </Router>
    );
}

const RoutesWithLocation = () => {
    const location = useLocation();

    // Check if the current path belongs to the admin section
    const isAdminRoute = location.pathname.startsWith('/admin');
    // Check if the current path is the login or OTP page
    const isLoginOrOtpPage = location.pathname === '/login-user' || location.pathname === '/otp';

    return (
        <>
            <ScrollToTop />
            {/* Hide Navbar on login and OTP pages and Show Navbar only if not on an admin route */}
            {!isAdminRoute && !isLoginOrOtpPage && !location.pathname.includes('*') && <UserNavbar />}
            <Routes>
                {/* Routes of user section */}
                <Route path='/' element={<UserHome />} />
                <Route path='/login-user' element={<LoginSignUpUser />} />
                <Route path='/otp' element={<Otp />} />
                <Route path='/product-details' element={<ProductDetails />} />
                <Route path='/customer-reviews' element={<CustomerReviews />} />
                <Route path='/write-review' element={<WriteReview />} />
                <Route path='/favourite' element={<FavouriteProduct />} />
                <Route path='/user-profile' element={<UserProfile />} />
                <Route path='/user-addresses' element={<UserAddress />} />
                <Route path='/user-orders' element={<UserOrders />} />
                <Route path='/view-all-category' element={<ViewAllCategory />} />
                <Route path='/all-category' element={<AllCategory />} />
                <Route path='/user-search' element={<UserSearch />} />
                <Route path='/user-cart' element={<UserCart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/order' element={<OrderPlaced />} />
                <Route path='/add-delivery-address' element={<AddUserAddress />} />
                <Route path='/edit-delivery-address' element={<EditUserAddress />} />
                <Route path='/select-delivery-address' element={<SelectUserAddress />} />
                <Route path='/orders-tracking' element={<OrdersTracking />} />
                <Route path='/forget-password' element={<EnterNumber />} />
                <Route path='/reset-otp' element={<ResetOtp />} />
                <Route path='/new-password' element={<NewPassword />} />
                <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                <Route path='/terms-conditions' element={<TermsConditions />} />
                <Route path='/shipping-policy' element={<ShippingPolicy />} />
                <Route path='/refund-policy' element={<RefundPolicy />} />
                <Route path='/pricing-policy' element={<PricingPolicy />} />
                <Route path='/please-note' element={<PleaseNote />} />

                {/* Routes of admin section */}
                <Route path='/admin-login' element={<LoginSignUp />} />
                <Route path='/adminHome' element={<PrivateRoute><Home /></PrivateRoute>}>
                    <Route path='' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path='product' element={<PrivateRoute><Products /></PrivateRoute>} />
                    <Route path='category' element={<PrivateRoute><Category /></PrivateRoute>} />
                    <Route path='subcategory' element={<PrivateRoute><SubCategory /></PrivateRoute>} />
                    <Route path='admincarousel' element={<PrivateRoute><AdminCarousel /></PrivateRoute>} />
                    <Route path='orderlist' element={<PrivateRoute><OrderList /></PrivateRoute>} />
                    <Route path='coupon' element={<PrivateRoute><Coupons /></PrivateRoute>} />
                    <Route path='userslist' element={<PrivateRoute><UsersList /></PrivateRoute>} />
                    <Route path='delivery' element={<PrivateRoute><Delivery /></PrivateRoute>} />
                    <Route path='invoice' element={<PrivateRoute><Invoice /></PrivateRoute>} />
                    <Route path='addProduct' element={<PrivateRoute><AddProduct /></PrivateRoute>} />
                    <Route path='userDetails' element={<PrivateRoute><ViewUserDetails /></PrivateRoute>} />
                    <Route path='editProduct' element={<PrivateRoute><EditProduct /></PrivateRoute>} />
                    <Route path='sizechart' element={<PrivateRoute><SizeCharts /></PrivateRoute>} />
                    <Route path='material' element={<PrivateRoute><MaterialsList /></PrivateRoute>} />
                </Route>
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    );
}

export default FullRoutes;
