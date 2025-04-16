import React from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogBody,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../../../StoreContext/StoreContext";
import toast from 'react-hot-toast';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef } from "react";

export function AddCouponModal({ open, handleOpen, setAdminCoupon }) {
    const { BASE_URL } = useContext(AppContext)
    const [categories, setCategories] = useState([])
    const [couponTitle, setCouponTitle] = useState('')
    const [couponCode, setCouponCode] = useState('')
    const [couponCategory, setCouponCategory] = useState([])
    const [couponStartDate, setCouponStartDate] = useState('')
    const [couponEndDate, setCouponEndDate] = useState('')
    const [couponDiscountValue, setCouponDiscountValue] = useState('')
    const [couponDiscountType, setCouponDiscountType] = useState('')
    const [couponisActive, setCouponisActive] = useState(true);
    const categoryContainer = useRef(null);

    // handle category
    const handleCategorySelect = (categoryId) => {
        setCouponCategory((prev) => {
            if (prev.includes(categoryId)) {
                return prev.filter((id) => id !== categoryId);
            }
            return [...prev, categoryId];
        });
    };

    const handleSelectAll = () => {
        if (couponCategory.length === categories.length) {
            setCouponCategory([]);
        } else {
            setCouponCategory(categories.map((category) => category.id));
        }
    };

    // fetch coupon
    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/coupon/list`, { headers });
            setAdminCoupon(response.data);
        } catch (error) {
            console.log(error, ": error fetching data");
        }
    }
    useEffect(() => {
        fetchCoupons();
    }, [])


    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
                return;
            }

            // Map the boolean status to the required string
            const status = couponisActive ? 'active' : 'expired';

            // Format the dates to MM/DD/YYYY
            const formatDate = (date) => {
                const d = new Date(date);
                const month = d.getMonth() + 1; // Months are zero-indexed
                const day = d.getDate();
                const year = d.getFullYear();
                return `${month}/${day}/${year}`;
            };

            const formattedStartDate = formatDate(couponStartDate);
            const formattedEndDate = formatDate(couponEndDate);

            // Cast the discount value and type to the expected types
            const discountValue = couponDiscountType === 'Percentage'
                ? parseFloat(couponDiscountValue)  // cast percentage as a number
                : parseFloat(couponDiscountValue.replace('%', ''));  // cast amount without percentage symbol

            // Ensure discountType is valid
            const discountType = couponDiscountType.toLowerCase();  // normalize the case
            if (discountType !== 'percentage' && discountType !== 'amount') {
                throw new Error("Invalid discount type");
            }

            const couponData = {
                title: couponTitle,
                code: couponCode,
                category: couponCategory,
                startDate: formattedStartDate,                     //becoz in backend it expects row-data not form-data
                endDate: formattedEndDate,
                discountValue,
                discountType,
                status
            };

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'   //becoz in backend it expects row-data not form-data
            }

            const response = await axios.post(`${BASE_URL}/admin/coupon/create`, couponData, { headers });
            console.log(response.data);
            handleOpen();
            toast.success('Coupon is created');
            fetchCoupons();
            setCouponTitle('')
            setCouponStartDate('')
            setCouponEndDate('')
            setCouponDiscountValue('')
            setCouponDiscountType('')
            setCouponCategory('')
        } catch (error) {
            console.error("Error creating coupon:", error.response ? error.response.data : error.message);
            // alert('Failed to create coupon. Please try again.');
        }
    }


    // fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/category/get`);
                setCategories(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error, ": Error fetching data");
            }
        }
        fetchCategories();
    }, [])


    // Handle scrolling
    const nextSlideCategory = () => {
        if (categoryContainer.current) {
            categoryContainer.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    const prevSlideCategory = () => {
        if (categoryContainer.current) {
            categoryContainer.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };


    return (
        <>
            <Dialog open={open} handler={handleOpen} size='md' className='rounded-none'>
                <DialogBody>
                    <div className='p-5'>
                        <h1 className="text-2xl font-custom font-semibold mb-0 text-secondary">Add Coupon</h1>
                        <form action="" className='space-y-5 mt-10' onSubmit={handleCouponSubmit}>
                            {/* title */}
                            <div className='flex justify-between items-center gap-2'>
                                <div className='flex flex-col gap-1 w-1/2'>
                                    <label htmlFor="" className='font-normal text-base'>Coupon Title</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={couponTitle}
                                        onChange={(e) => setCouponTitle(e.target.value)}
                                        id=""
                                        placeholder='Coupon title'
                                        className='border-[1px] text-sm w-full
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                                </div>
                                <div className='flex flex-col gap-1 w-1/2'>
                                    <label className='font-normal text-base'>Code</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        id=""
                                        placeholder='Code'
                                        className='border-[1px] text-sm w-full uppercase
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:capitalize placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                                </div>
                            </div>
                            {/* category */}
                            <div className='flex flex-col gap-3 w-full'>
                                    <label className="font-normal text-base">Select Category</label>
                                <ul className='flex items-center justify-between'>
                                        <li onClick={prevSlideCategory} className='text-sm font-semibold text-secondary flex items-center gap-0 cursor-pointer'><IoIosArrowBack /> Prev</li>
                                        <li onClick={nextSlideCategory} className='text-sm font-semibold text-secondary flex items-center gap-0 cursor-pointer'>Next <IoIosArrowForward /></li>
                                    </ul>
                                    <div
                                        className='flex flex-row items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth'
                                        ref={categoryContainer}
                                    >
                                        <div className='flex items-center space-x-0 shrink-0'>
                                            <Checkbox
                                                checked={couponCategory.length === categories.length}
                                                onChange={handleSelectAll}
                                                color='black'
                                                className='w-4 h-4 border-2 border-gray-600 rounded-sm'
                                            />
                                            <Typography className='text-sm sm:text-base font-custom font-medium capitalize text-secondary'>
                                                Select All
                                            </Typography>
                                        </div>
                                        {categories.map((category) => (
                                            <div key={category.id} className='flex items-center space-x-0 shrink-0'>
                                                <Checkbox
                                                    checked={couponCategory.includes(category.id)}
                                                    onChange={() => handleCategorySelect(category.id)}
                                                    color='black'
                                                    className='w-4 h-4 border-2 border-gray-600 rounded-sm'
                                                />
                                                <Typography className='text-sm sm:text-base font-custom font-medium capitalize text-secondary truncate'>
                                                    {category.name}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                            </div>


                            {/* Start and End Date */}
                            <div className='flex justify-between items-center gap-2'>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='font-normal text-base'>Start Date</label>
                                    <input
                                        type="date"
                                        name=""
                                        value={couponStartDate}
                                        onChange={(e) => setCouponStartDate(e.target.value)}
                                        id=""
                                        placeholder="Start Date"
                                        className='border-[1px] text-sm
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                                </div>
                                <div className='flex flex-col gap-1 w-full'>
                                    <label className='font-normal text-base'>End Date</label>
                                    <input
                                        type="date"
                                        name=""
                                        value={couponEndDate}
                                        onChange={(e) => setCouponEndDate(e.target.value)}
                                        id=""
                                        placeholder="End Date"
                                        className='border-[1px] text-sm
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                                </div>
                            </div>
                            {/* Amount/ Status */}
                            <div className='flex justify-between items-end gap-2'>
                                <div className='flex flex-col gap-1 w-1/3'>
                                    <label htmlFor="" className='font-normal text-sm'>Discount Value</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={couponDiscountValue}
                                        onChange={(e) => setCouponDiscountValue(e.target.value)}
                                        id=""
                                        placeholder='Enter Value'
                                        className='border-[1px] text-sm 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                                </div>
                                <div className='flex flex-col gap-1 w-1/3'>
                                    <label htmlFor="" className='font-normal text-sm'>Discount Type</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={couponDiscountType}
                                        onChange={(e) => setCouponDiscountType(e.target.value)}
                                        id=""
                                        placeholder='Percentage or amount'
                                        className='border-[1px] text-sm
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                                </div>
                                <div className='flex flex-col gap-1 w-1/3'>
                                    <label className='font-normal text-base'>Status</label>
                                    <select
                                        name="status"
                                        value={couponisActive ? 'active' : 'expired'}
                                        onChange={(e) => setCouponisActive(e.target.value === 'active')}
                                        className="w-full text-sm text-secondary font-light bg-gray-100/50 border p-2 rounded-md focus:outline-none focus:cursor-pointer"
                                    >
                                        <option value="active" className='text-gray-500'>Active</option>
                                        <option value="expired" className='text-gray-500'>Expired</option>
                                    </select>
                                </div>

                            </div>

                            <div className='flex justify-center items-center mt-5'>
                                <Button
                                    onClick={handleOpen}
                                    className="mr-1 capitalize bg-primary/20 text-primary font-normal text-sm w-52"
                                >
                                    <span>Close</span>
                                </Button>
                                <Button type='submit' onClick={handleOpen} className='capitalize bg-buttonBg font-normal text-sm w-52'>
                                    <span>Save</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}