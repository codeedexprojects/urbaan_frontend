import {
    List,
    ListItem,
    ListItemPrefix,
    Card
} from "@material-tailwind/react";
import React, { useState, useEffect } from 'react'
import { IoMdTimer } from "react-icons/io";
import { MdOutlineWindow, MdOutlineCategory, MdOutlineViewCarousel } from "react-icons/md";
import { CgListTree } from "react-icons/cg";
import { TbListCheck, TbFileInvoice, TbTruckDelivery , TbRulerMeasure  } from "react-icons/tb";
import { RiCouponLine } from "react-icons/ri";
import { PiUsersBold } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { GiRolledCloth } from "react-icons/gi";

export function AppSidebar() {
    const location = useLocation();
    const pathMap = {
        "/adminHome": "dashboard",
        "/adminHome/userslist": "userslist",
        "/adminHome/userDetails": "userslist",
        "/adminHome/orderlist": "orderlist",
        "/adminHome/product": "product",
        "/adminHome/addProduct": "product",
        "/adminHome/editProduct": "product",
        "/adminHome/category": "category",
        "/adminHome/subcategory": "subcategory",
        "/adminHome/admincarousel": "admincarousel",
        "/adminHome/delivery": "delivery",
        "/adminHome/coupon": "coupon",
        "/adminHome/invoice": "invoice",
        "/adminHome/sizechart":"sizechart",
         "/adminHome/specifications":"specifications"
    };
    
    const [activeLink, setActiveLink] = useState(pathMap[location.pathname] || "dashboard");

    useEffect(() => {
        setActiveLink(pathMap[location.pathname] || "dashboard");
    }, [location]);

    return (
        <Card className="hidden lg:block h-screen lg:w-64 pt-4 shadow-none rounded-none overflow-y-auto hide-scrollbar">
            <div className='flex justify-center items-center'>
                <Link to='/adminHome'>
                    <div className="mb-2 pt-2 w-28 rounded-3xl">
                        <img src="/logo.png" alt="" className='w-full object-contain' />
                    </div>
                </Link>
            </div>
            <List className='mt-8 px-4 space-y-1'>
                {[
                    { to: "/adminHome", label: "Dashboard", icon: IoMdTimer, key: "dashboard" },
                    { to: "/adminHome/userslist", label: "Users List", icon: PiUsersBold, key: "userslist" },
                    { to: "/adminHome/orderlist", label: "Order List", icon: TbListCheck, key: "orderlist" },
                    { to: "/adminHome/product", label: "Products", icon: MdOutlineWindow, key: "product" },
                    { to: "/adminHome/category", label: "Category", icon: MdOutlineCategory, key: "category" },
                    { to: "/adminHome/subcategory", label: "Sub Category", icon: CgListTree, key: "subcategory" },
                    { to: "/adminHome/admincarousel", label: "Carousel", icon: MdOutlineViewCarousel, key: "admincarousel" },
                    { to: "/adminHome/sizechart", label: "Size Chart", icon: TbRulerMeasure, key: "sizechart" },
                    { to: "/adminHome/specifications", label: "Specifications", icon: GiRolledCloth, key: "specifications" },
                    { to: "/adminHome/delivery", label: "Delivery", icon: TbTruckDelivery, key: "delivery" },
                    { to: "/adminHome/coupon", label: "Coupons", icon: RiCouponLine, key: "coupon" },
                    { to: "/adminHome/invoice", label: "Invoice", icon: TbFileInvoice, key: "invoice" }
                ].map(({ to, label, icon: Icon, key }) => (
                    <Link to={to} key={key}>
                        <ListItem onClick={() => setActiveLink(key)} className={`text-secondary bg-gray-100 p-3 text-base font-medium transition-all duration-300 ease-in-out
                            ${activeLink === key ? "!bg-primary text-white py-6 focus:!text-white" : "bg-none"}`}>
                            <ListItemPrefix>
                                <Icon className="h-5 w-5" />
                            </ListItemPrefix>
                            {label}
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Card>
    );
}
