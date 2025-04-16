import React, { useContext } from 'react'
import { Button, Card, CardBody, CardFooter, Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { AppContext } from "../../../../StoreContext/StoreContext"
import { DeleteModal } from '../../DeleteModal/DeleteModal';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import AppLoader from '../../../../Loader';
import { EditCouponModal } from './EditCouponModal';
import toast from 'react-hot-toast';

const TABLE_HEAD = ["Discount", "Discount Type", "Coupon Title", "Code", "Start Date", "End Date", "Status", "Action"];


const CouponsTable = ({ adminCoupon, setAdminCoupon }) => {
    const { open, handleOpen, BASE_URL, modalType } = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(true);
    const [initialEditCoupon, setInitialEditCoupon] = useState(null)
    const [selectCouponId, setSelectCouponId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);


    // handle edit modal
    const handleEditModal = (couponDetails) => {
        setInitialEditCoupon(couponDetails)
        handleOpen('editCouponModal')
        console.log(couponDetails);
    }

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
            console.log(response.data);
            setIsLoading(false)
        } catch (error) {
            console.log(error, ": error fetching data");
        }
    }
    useEffect(() => {
        fetchCoupons();
    }, [])


    // handle delete coupon
    const handleDeleteCoupon = async (couponId) => {
        console.log(couponId);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/admin/coupon/delete/${couponId}`, { headers })
            console.log(response.data);
            handleOpen()
            toast.success('Coupon is deleted')
            setAdminCoupon((prevCoupons) => prevCoupons.filter((coupon) => coupon._id !== couponId));
        } catch (error) {
            console.log(error, ": Error deleting coupon");
            alert("Coupon is not deleted")
        }

    }

    // Get current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrderList = adminCoupon.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next and prev page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(adminCoupon.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <>
            {
                isLoading || adminCoupon.length === 0 ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : (
                    <>
                        <Card className="w-full shadow-sm rounded-xl bg-white border-[1px]">
                            <CardBody>
                                <table className="w-full table-auto text-left border-collapse">
                                    <thead>
                                        <tr className='bg-quaternary'>
                                            {TABLE_HEAD.map((head) => (
                                                <th
                                                    key={head}
                                                    className="border-b border-gray-300 p-3 text-center"
                                                >
                                                    <Typography
                                                        variant="small"
                                                        className="font-semibold font-custom text-secondary leading-none text-sm uppercase"
                                                    >
                                                        {head}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(currentOrderList) && currentOrderList.map((coupon, index) => {
                                            const isLast = index === adminCoupon.length - 1;
                                            const classes = isLast
                                                ? "p-4 text-center"
                                                : "p-4 border-b border-gray-300 text-center";

                                            return (
                                                <tr key={coupon._id}>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm capitalize"
                                                        >
                                                            {coupon.discountValue}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm capitalize"
                                                        >
                                                            {coupon.discountType}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal capitalize font-custom text-sm"
                                                        >
                                                            {coupon.title}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm capitalize"
                                                        >
                                                            {coupon.code}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm capitalize"
                                                        >
                                                            {new Date(coupon.startDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm capitalize"
                                                        >
                                                            {new Date(coupon.endDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Chip
                                                            className={`
                                                 ${coupon.status === "expired" ? "text-cancelBg bg-cancelBg/20 capitalize text-sm text-center font-normal" : ""}
                                                 ${coupon.status === "active" ? "text-shippedBg bg-shippedBg/20 capitalize text-sm text-center font-normal" : ""}
                                                 ${!["expired", "active"].includes(coupon.status) ? "text-gray-500 bg-gray-200 capitalize text-sm text-center font-normal" : ""}
                                                    `}
                                                            value={
                                                                coupon.status === "expired" ? "Expired" :
                                                                    coupon.status === "active" ? "Active" : "Unknown"
                                                            }

                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Menu>
                                                            <MenuHandler>
                                                                <IconButton variant="text">
                                                                    <HiOutlineDotsHorizontal className='text-primary text-2xl cursor-pointer' />
                                                                </IconButton>
                                                            </MenuHandler>
                                                            <MenuList>
                                                                <MenuItem onClick={() => {
                                                                    handleEditModal(coupon);
                                                                    setSelectCouponId(coupon._id)
                                                                }}
                                                                    className={`font-custom !text-buttonBg hover:!text-buttonBg ${selectCouponId ? 'text-white' : ''}`}>Edit</MenuItem>
                                                                <MenuItem onClick={() => {
                                                                    setSelectCouponId(coupon._id);
                                                                    handleOpen("deleteModal")
                                                                }} className='font-custom text-primary hover:!text-primary'>
                                                                    Delete</MenuItem>
                                                            </MenuList>
                                                        </Menu>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </CardBody>
                            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                                <Button
                                    variant="outlined"
                                    size="sm"
                                    className='font-custom border-gray-300 font-normal capitalize text-sm cursor-pointer hover:bg-black hover:text-white'
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    Prev. page
                                </Button>

                                <div className="flex items-center gap-2">
                                    {[...Array(Math.ceil(adminCoupon.length / itemsPerPage))].map((_, index) => (
                                        <IconButton key={index} variant="text" size="sm" onClick={() => paginate(index + 1)}>
                                            {index + 1}
                                        </IconButton>
                                    ))}
                                </div>

                                <Button
                                    variant="outlined"
                                    size="sm"
                                    className='font-custom border-gray-300 font-normal capitalize text-sm cursor-pointer hover:bg-black hover:text-white'
                                    onClick={handleNextPage}
                                    disabled={currentPage === Math.ceil(adminCoupon.length / itemsPerPage)}
                                >
                                    Next page
                                </Button>
                            </CardFooter>
                        </Card>

                    </>
                )
            }
            <DeleteModal
                open={open === "deleteModal"}
                handleOpen={handleOpen}
                title="Are you sure ?"
                description="Do you really want to delete this item? This action cannot be undone."
                handleDelete={handleDeleteCoupon}
                modalType='coupon'
                couponId={selectCouponId}
            />
            <EditCouponModal
                open={open === "editCouponModal"}
                handleOpen={handleOpen}
                initialEditCoupon={initialEditCoupon}
                setAdminCoupon={setAdminCoupon}
            />
        </>
    )
}

export default CouponsTable
