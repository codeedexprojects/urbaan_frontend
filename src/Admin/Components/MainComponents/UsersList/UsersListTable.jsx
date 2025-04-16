import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardBody, CardFooter, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { AppContext } from "../../../../StoreContext/StoreContext";
import AppLoader from '../../../../Loader';
import axios from 'axios';
import toast from 'react-hot-toast';
import { DeleteModal } from '../../DeleteModal/DeleteModal';
import { RiHeart3Fill } from 'react-icons/ri';
import * as XLSX from 'xlsx';

const TABLE_HEAD = ["user name", "mobile", "email", "address", "city", "state", "pincode", "Action"];

const UsersListTable = ({ userList, setUserList }) => {
    const { BASE_URL, open, handleOpen, modalType, } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    console.log(userList);


    const token = localStorage.getItem('token')

    // Get current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUserList = userList.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next and prev page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(userList.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // fetch user list
    const fetchUserList = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/users/view-all/`);
            setUserList(response.data.users); // Ensure you access the correct field in the API response
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUserList();
    }, [BASE_URL]);

    // handle delete user
    const handleDeleteUser = async (UserId) => {
        if (!UserId) {
            console.error("UserId is undefined. Cannot delete user.");
            toast.error("User ID is missing.");
            // return;
        }
        try {
            const response = await axios.delete(`${BASE_URL}/admin/users/delete/${UserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
            setUserList((prevUserList) => prevUserList.filter(user => user.id !== UserId));
            handleOpen();
            setSelectedUserId(null);
            toast.success("User is deleted")
            fetchUserList();
        } catch (error) {
            console.log(error);
        }
    }

    //download user list in excel format
    const downloadUserList = () => {
        if (userList.length === 0) {
            toast.error("No users to download.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(userList.map(user => ({
            Name: user.name,
            Mobile: user.phone || "N/A",
            Email: user.email || "N/A",
            Address: user.addresses?.[0]?.address || "N/A",
            City: user.addresses?.[0]?.city || "N/A",
            State: user.addresses?.[0]?.state || "N/A",
            Pincode: user.addresses?.[0]?.pincode || "N/A",
            Status: user.status ? "Active" : "Suspended"
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "UserList");

        XLSX.writeFile(workbook, "UserList.xlsx");
    };


    return (
        <>
            {isLoading || userList.length === 0 ? (
                <div className="col-span-2 flex justify-center items-center h-[50vh]">
                    <AppLoader />
                </div>
            ) : (
                <>
                    <div className='flex items-center justify-end mb-10'>
                        <a href=""
                            onClick={downloadUserList}
                            className='underline underline-offset-2 text-sm text-shippedBg cursor-pointer'
                        >Download as an Excel file</a>
                    </div>

                    <Card className="w-full shadow-sm rounded-xl bg-white border-[1px]">
                        <CardBody>
                            <table className="w-full table-auto text-left border-collapse">
                                <thead className="bg-quaternary">
                                    <tr>
                                        {TABLE_HEAD.map((head, index) => (
                                            <th
                                                key={index}
                                                className="border-b border-gray-300 px-4 py-3 text-center text-sm font-semibold text-secondary uppercase w-[150px]"
                                            // style={{ minWidth: "120px" }} // Adjust minWidth to ensure uniformity
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUserList.map((user, index) => {
                                        const isLast = index === currentUserList.length - 1;
                                        const classes = `${isLast ? "p-4 relative" : "p-4 border-b border-gray-300 relative"} text-center w-[150px] truncate`;
                                        const firstAddress = user.addresses?.[0] || {}; // Safely access the first address
                                        return (
                                            <tr key={user._id}>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal flex items-center gap-1 capitalize font-custom text-sm"
                                                    >
                                                        {user.name}
                                                        {user.isFavorite === true && user.status === true ? <RiHeart3Fill className='text-primary' /> : null}
                                                    </Typography>
                                                    {user.status === false && (
                                                        <p className='text-xs tracking-wider text-primary font-bold absolute inset-0 flex
                                                         justify-center items-end'>*suspended</p>
                                                    )}
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal capitalize font-custom text-sm"
                                                    >
                                                        {user.phone || "N/A"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal font-custom text-sm"
                                                    >
                                                        {user.email || "N/A"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal capitalize font-custom text-sm"
                                                    >
                                                        {firstAddress.address || "N/A"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal capitalize font-custom text-sm"
                                                    >
                                                        {firstAddress.city || "N/A"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal capitalize font-custom text-sm"
                                                    >
                                                        {firstAddress.state || "N/A"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        className="font-normal font-custom text-xs"
                                                    >
                                                        {firstAddress.pincode || "N/A"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Menu>
                                                        <MenuHandler>
                                                            <IconButton variant="text">
                                                                <HiOutlineDotsHorizontal className="text-primary text-2xl cursor-pointer" />
                                                            </IconButton>
                                                        </MenuHandler>
                                                        <MenuList>
                                                            <Link
                                                                to={{
                                                                    pathname: '/adminHome/userDetails',
                                                                }}
                                                                state={{ user }}
                                                            >
                                                                <MenuItem className="font-custom text-buttonBg hover:!text-buttonBg">View</MenuItem>
                                                            </Link>
                                                            {/* <MenuItem className="font-custom text-processingBg hover:!text-processingBg">
                                                            Suspend
                                                        </MenuItem> */}
                                                            <MenuItem
                                                                onClick={() => {
                                                                    setSelectedUserId(user._id || user.id); // Set the selected user's ID
                                                                    handleOpen("deleteModal"); // Open the modal
                                                                }}
                                                                className="text-deleteBg font-custom"
                                                            >
                                                                Delete
                                                            </MenuItem>

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
                                {[...Array(Math.ceil(userList.length / itemsPerPage))].map((_, index) => (
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
                                disabled={currentPage === Math.ceil(userList.length / itemsPerPage)}
                            >
                                Next page
                            </Button>
                        </CardFooter>
                    </Card>
                </>
            )}

            <DeleteModal
                open={open === "deleteModal"}
                handleOpen={handleOpen}
                title="Are you sure?"
                description="Do you really want to delete this user? This action cannot be undone."
                handleDelete={handleDeleteUser}
                UserId={selectedUserId}
                modalType="user"
            />
        </>
    );
};

export default UsersListTable;
