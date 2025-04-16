import React, { useContext } from 'react'
import { Button, Card, CardBody, CardFooter, Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { AppContext } from "../../../../StoreContext/StoreContext"
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import AppLoader from '../../../../Loader';

const TABLE_HEAD = ["invoice Number", "Customer", "mobile", "Date", "sub total", "delivery charge", "discount", "total", "payment", "Status", "action"];

const InvoiceTable = ({ invoice, setInvoice }) => {
    const { BASE_URL } = useContext(AppContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true)

    // Predefined allowed statuses
    const allowedStatuses = ["Paid", "Refund", "Unpaid", "Pending"];

    // Status colors
    const statusColors = {
        Paid: "text-shippedBg bg-shippedBg/20",
        Refund: "text-processingBg bg-processingBg/20",
        Unpaid: "text-cancelBg bg-cancelBg/20",
        Pending: "text-pendingBg bg-pendingBg/20",
        default: "text-gray-500 bg-gray-200",
    };

    // handle status
    const handleStatusChange = async (invoiceId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${BASE_URL}/admin/invoice/update/${invoiceId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                const updatedInvoice = invoice.map((inv) =>
                    inv._id === invoiceId ? { ...inv, status: newStatus } : inv
                );
                setInvoice(updatedInvoice);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    // fetch invoice
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${BASE_URL}/admin/invoice/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setInvoice(response.data)
                setIsLoading(false)
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }finally{
                setIsLoading(false)
            }
        }
        fetchInvoices()
    }, [])



    // Get current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInvoice = invoice.slice(indexOfFirstItem, indexOfLastItem);


    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next and prev page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(invoice.length / itemsPerPage)) {
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
                isLoading ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : invoice.length === 0 ? (
                    <>
                        <p className='col-span-5 text-sm text-secondary flex justify-center items-center h-[50vh]'>No invoices match the selected filters.</p>
                    </>
                ) : (
                    <>
                        <Card className="w-full shadow-sm rounded-xl bg-white border-[1px]">
                            <CardBody className=''>
                                <table className="w-full table-auto text-left">
                                    <thead>
                                        <tr className='bg-quaternary'>
                                            {TABLE_HEAD.map((head) => (
                                                <th
                                                    key={head}
                                                    className="border-b border-blue-gray-100 p-3 text-center"
                                                >
                                                    <Typography
                                                        variant="small"
                                                        className="font-semibold font-custom text-secondary leading-none text-base uppercase w-[160px]"
                                                    >
                                                        {head}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(currentInvoice) && currentInvoice.map((invoice, index) => {
                                            const isLast = index === currentInvoice.length - 1;
                                            const classes = `${isLast ? "p-4" : "p-4 border-b border-gray-300"} text-center w-[150px] truncate`;

                                            return (
                                                <tr key={invoice._id}>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm uppercase"
                                                        >
                                                            {invoice.invoice_Number}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal capitalize font-custom text-sm"
                                                        >
                                                            {invoice.customerName}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal capitalize font-custom text-sm"
                                                        >
                                                            {invoice.customerMobile}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm"
                                                        >
                                                            {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal capitalize font-custom text-sm"
                                                        >
                                                            ₹{invoice.SubTotalAmount || 0}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal capitalize font-custom text-sm"
                                                        >
                                                            ₹{invoice.Delivery_Charge || 0}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal capitalize font-custom text-sm"
                                                        >
                                                            ₹{invoice.Discounted_Amount || 0}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal capitalize font-custom text-sm"
                                                        >
                                                            ₹{invoice.totalAmount || 0}
                                                        </Typography>
                                                    </td>

                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm"
                                                        >
                                                            ₹{invoice.totalAmount || 0}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Chip
                                                            className={`capitalize text-sm text-center font-normal ${statusColors[invoice.status] || statusColors.default}`}
                                                            value={invoice.status}
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <Menu>
                                                            <MenuHandler>
                                                                <Button className="text-buttonBg bg-editBg font-custom font-normal text-sm capitalize px-4 py-1 shadow-none
                                                                hover:shadow-none hover:bg-buttonBg hover:text-editBg">
                                                                    Edit</Button>
                                                            </MenuHandler>
                                                            <MenuList>
                                                                {allowedStatuses.map((status, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        onClick={() => handleStatusChange(invoice._id, status)}
                                                                        className={`font-custom capitalize ${statusColors[status]?.split(" ")[0]} hover:!text-buttonBg`}
                                                                    >
                                                                        {status}</MenuItem>
                                                                ))}
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
                                    {[...Array(Math.ceil(invoice.length / itemsPerPage))].map((_, index) => (
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
                                    disabled={currentPage === Math.ceil(invoice.length / itemsPerPage)}
                                >
                                    Next page
                                </Button>
                            </CardFooter>
                        </Card>
                    </>
                )
            }
        </>
    )
}

export default InvoiceTable