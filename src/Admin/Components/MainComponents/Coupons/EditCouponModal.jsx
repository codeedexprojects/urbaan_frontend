import React, { useState, useEffect, useContext } from "react";
import { Button, Checkbox, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import axios from "axios";
import { AppContext } from "../../../../StoreContext/StoreContext";
import toast from "react-hot-toast";
import { HiMiniXMark } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef } from "react";

export function EditCouponModal({ open, handleOpen, initialEditCoupon, setAdminCoupon }) {
    const { BASE_URL } = useContext(AppContext);
    const [categories, setCategories] = useState([]);
    const [editCouponTitle, setEditCouponTitle] = useState('');
    const [editCouponCode, setEditCouponCode] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryEnable, setCategoryEnable] = useState(false);
    const [editCouponStartDate, setEditCouponStartDate] = useState('');
    const [editCouponEndDate, setEditCouponEndDate] = useState('');
    const [editCouponDiscountValue, setEditCouponDiscountValue] = useState('');
    const [editCouponDiscountType, setEditCouponDiscountType] = useState('');
    const [editCouponIsActive, setEditCouponIsActive] = useState(true);
    const categoryContainerRef = useRef(null);
    const categoryContainerRef2 = useRef(null);

    // Set initial values when modal opens
    useEffect(() => {
        if (initialEditCoupon) {
            setEditCouponTitle(initialEditCoupon.title);
            setEditCouponCode(initialEditCoupon.code);
            setSelectedCategories(initialEditCoupon.category || []);
            setEditCouponStartDate(initialEditCoupon.startDate?.split('T')[0]);
            setEditCouponEndDate(initialEditCoupon.endDate?.split('T')[0]);
            setEditCouponDiscountValue(initialEditCoupon.discountValue);
            setEditCouponDiscountType(initialEditCoupon.discountType);
            setEditCouponIsActive(initialEditCoupon.status === 'active');
        }
    }, [initialEditCoupon]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/category/get`);
                setCategories(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, [BASE_URL]);

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategories(prev => {
            const isSelected = prev.some(cat => cat._id === category.id);
            if (isSelected) {
                return prev.filter(cat => cat._id !== category.id);
            }
            return [...prev, { _id: category.id, name: category.name }];
        });
    };

    // Handle select all categories
    const handleSelectAll = () => {
        if (selectedCategories.length === categories.length) {
            setSelectedCategories([]);
        } else {
            const allCategories = categories.map(category => ({
                _id: category.id,
                name: category.name
            }));
            setSelectedCategories(allCategories);
        }
    };

    // Handle remove category
    const handleRemoveCategory = (categoryId) => {
        setSelectedCategories(prev => prev.filter(category => category._id !== categoryId));
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

    const handleEditCouponSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authorization is missing");
                return;
            }

            const status = editCouponIsActive ? 'active' : 'expired';
            const discountValue = parseFloat(editCouponDiscountValue);
            const discountType = editCouponDiscountType.toLowerCase();

            if (discountType !== 'percentage' && discountType !== 'amount') {
                throw new Error("Invalid discount type");
            }

            // Compare initial categories with current selection to determine changes
            const initialCategoryIds = new Set(initialEditCoupon.category.map(cat => cat._id));
            const currentCategoryIds = new Set(selectedCategories.map(cat => cat._id));

            const addCategories = selectedCategories
                .map(cat => cat._id)
                .filter(id => !initialCategoryIds.has(id));

            const removeCategories = initialEditCoupon.category
                .map(cat => cat._id)
                .filter(id => !currentCategoryIds.has(id));

            const couponData = {
                title: editCouponTitle,
                code: editCouponCode,
                addCategories,
                removeCategories,
                startDate: editCouponStartDate,
                endDate: editCouponEndDate,
                discountValue,
                discountType,
                status,
            };

            console.log(couponData);


            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            await axios.patch(
                `${BASE_URL}/admin/coupon/update/${initialEditCoupon._id}`,
                couponData,
                { headers }
            );

            handleOpen();
            toast.success('Coupon is updated');
            fetchCoupons();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update coupon");
        }
    };

    const nextSlide = () => {
        if (categoryContainerRef.current) {
            categoryContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    const prevSlide = () => {
        if (categoryContainerRef.current) {
            categoryContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const nextSlide2 = () => {
        if (categoryContainerRef2.current) {
            categoryContainerRef2.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    const prevSlide2 = () => {
        if (categoryContainerRef2.current) {
            categoryContainerRef2.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="md" className="rounded-none">
            <DialogBody>
                <div className="p-5">
                    <h1 className="text-2xl font-custom font-semibold mb-0 text-secondary">
                        Edit Coupon
                    </h1>
                    <form className="space-y-5 mt-10" onSubmit={handleEditCouponSubmit}>
                        {/* Title and Code */}
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex flex-col gap-1 w-1/2">
                                <label className="font-normal text-base">Coupon title</label>
                                <input
                                    type="text"
                                    value={editCouponTitle}
                                    onChange={(e) => setEditCouponTitle(e.target.value)}
                                    placeholder="Coupon title"
                                    className="border-[1px] w-full capitalize text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <label className="font-normal text-base">Code</label>
                                <input
                                    type="text"
                                    value={editCouponCode}
                                    onChange={(e) => setEditCouponCode(e.target.value)}
                                    placeholder="Code"
                                    className="border-[1px] w-full text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="flex flex-col gap-3 w-full">
                            <div className='flex items-center justify-between'>
                                <label className="font-normal text-base">Available Categories</label>
                                <ul className='flex items-center gap-5'>
                                    <li onClick={prevSlide} className='text-sm font-semibold text-secondary flex items-center gap-0 cursor-pointer'><IoIosArrowBack /> Prev</li>
                                    <li onClick={nextSlide} className='text-sm font-semibold text-secondary flex items-center gap-0 cursor-pointer'>Next <IoIosArrowForward /></li>
                                </ul>
                            </div>
                            <div className="flex items-center">
                                <div className="flex flex-col items-center gap-2 pr-3">
                                    <Button
                                        onClick={() => setCategoryEnable(!categoryEnable)}
                                        className="text-sm capitalize font-custom font-normal bg-buttonBg shrink-0 w-28 px-2"
                                    >
                                        Add category
                                    </Button>
                                </div>
                                <div className="pl-2 flex items-center gap-2 overflow-x-auto hide-scrollbar" ref={categoryContainerRef}>
                                    {selectedCategories.map((category) => (
                                        <span
                                            key={category._id}
                                            className="flex items-center justify-between gap-5 cursor-default capitalize bg-gray-200 shrink-0 p-2 rounded-full text-sm"
                                        >
                                            {category.name}
                                            <HiMiniXMark
                                                onClick={() => handleRemoveCategory(category._id)}
                                                className="text-deleteBg cursor-pointer text-lg"
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {categoryEnable && (
                                <>
                                        <ul className='flex items-center justify-between'>
                                            <li onClick={prevSlide2} className='text-sm font-semibold text-secondary flex items-center gap-0 cursor-pointer'><IoIosArrowBack /> Prev</li>
                                            <li onClick={nextSlide2} className='text-sm font-semibold text-secondary flex items-center gap-0 cursor-pointer'>Next <IoIosArrowForward /></li>
                                        </ul>
                                        <div className="flex flex-row items-center gap-2 overflow-x-auto hide-scrollbar" ref={categoryContainerRef2}>
                                            {categories.length > 0 && (
                                                <div className="flex items-center space-x-0 shrink-0">
                                                    <Checkbox
                                                        checked={selectedCategories.length === categories.length}
                                                        onChange={handleSelectAll}
                                                        color="black"
                                                        className="w-4 h-4 border-2 border-gray-600 rounded-sm"
                                                    />
                                                    <Typography className="text-sm sm:text-base font-custom font-medium capitalize text-secondary">
                                                        Select All
                                                    </Typography>
                                                </div>
                                            )}
                                            {categories.map((category) => (
                                                <div key={category.id} className="flex items-center space-x-0 shrink-0">
                                                    <Checkbox
                                                        checked={selectedCategories.some(cat => cat._id === category.id)}
                                                        onChange={() => handleCategorySelect(category)}
                                                        color="black"
                                                        className="w-4 h-4 border-2 border-gray-600 rounded-sm"
                                                    />
                                                    <Typography className="text-sm sm:text-base font-custom font-medium capitalize text-secondary truncate">
                                                        {category.name}
                                                    </Typography>
                                                </div>
                                            ))}
                                        </div>
                                </>
                            )}
                        </div>

                        {/* Start and End Date */}
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex flex-col gap-1 w-full">
                                <label className="font-normal text-base">Start Date</label>
                                <input
                                    type="date"
                                    value={editCouponStartDate}
                                    onChange={(e) => setEditCouponStartDate(e.target.value)}
                                    className="border-[1px] text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="font-normal text-base">End Date</label>
                                <input
                                    type="date"
                                    value={editCouponEndDate}
                                    onChange={(e) => setEditCouponEndDate(e.target.value)}
                                    className="border-[1px] text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Discount Value, Type and Status */}
                        <div className="flex justify-between items-end gap-2">
                            <div className="flex flex-col gap-1 w-1/3">
                                <label className="font-normal text-sm">Discount Value</label>
                                <input
                                    type="text"
                                    value={editCouponDiscountValue}
                                    onChange={(e) => setEditCouponDiscountValue(e.target.value)}
                                    placeholder="Discount Value (50 or 50%)"
                                    className="border-[1px] capitalize text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/3">
                                <label className="font-normal text-sm">Discount Type</label>
                                <input
                                    type="text"
                                    value={editCouponDiscountType}
                                    onChange={(e) => setEditCouponDiscountType(e.target.value)}
                                    placeholder="Discount Type (Percentage or amount)"
                                    className="border-[1px] capitalize text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-1/3">
                                <label className="font-normal text-base">Status</label>
                                <select
                                    value={editCouponIsActive ? 'active' : 'expired'}
                                    onChange={(e) => setEditCouponIsActive(e.target.value === 'active')}
                                    className="w-full text-sm text-gray-500 font-light bg-gray-100/50 border p-2 rounded-md focus:outline-none focus:cursor-pointer"
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-center items-center mt-5">
                            <Button
                                onClick={handleOpen}
                                className="mr-1 capitalize bg-primary/20 text-primary font-normal text-sm w-52"
                            >
                                <span>Close</span>
                            </Button>
                            <Button
                                type="submit"
                                className="capitalize bg-buttonBg font-normal text-sm w-52"
                            >
                                <span>Update coupon</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogBody>
        </Dialog>
    );
}