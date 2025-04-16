import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    Radio,
} from "@material-tailwind/react";
import { HiXMark } from "react-icons/hi2";
import { useContext } from "react";
import { AppContext } from "../../../../StoreContext/StoreContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

export function OrderStatusModal({ open, handleOpen, selectOrder, setSelectOrder, setOrderList, orderList }) {
    const { BASE_URL } = useContext(AppContext)
    const [statusHandle, setStatusHandle] = useState('')

    const token = localStorage.getItem('token')

    const handleUpdateStatus = async () => {
        try {
            const statusPayload = {
                orderIds: selectOrder,
                status: statusHandle,
            }
            console.log(statusPayload);

            const updatedOrders = orderList.map(order => {
                if (selectOrder.includes(order._id)) {
                    return { ...order, status: statusHandle };
                }
                return order;
            });
            setOrderList(updatedOrders);

            const response = await axios.patch(`${BASE_URL}/admin/orderlist/edit/status`, statusPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
            toast.success("status updated");

            // If there are skipped orders, extract their order numbers
            if (response.data.skippedOrders && response.data.skippedOrders.length > 0) {
                const skippedOrderNumbers = response.data.skippedOrders
                    .map(order => order.order_id)
                    .join(", ");
                setTimeout(() => {
                    toast.error(`Warning: Orders (${skippedOrderNumbers}) were skipped due to missing TrackId.`);
                }, 3000)
            }

            // Check if any updated orders have a TrackId
            const hasTrackId = response.data.updatedOrders.some(order => order.TrackId);
            if (hasTrackId) {
                setTimeout(() => {
                    toast.success("Mail has been sent for tracked orders.");
                }, 2000)
            }

            setSelectOrder([])
            handleOpen()
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle specific 400 error
                if (error.response.data.message === 'No valid orders found for updating.') {
                    handleOpen()
                    toast.error("No valid orders found for updating.");
                } else {
                    toast.error(error.response.data.message || "Something went wrong!");
                }
            } else {
                // Generic error handling
                console.log(error);
                toast.error("An error occurred while updating the status.");
            }
        }
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen} size='xs'>
                <DialogHeader className='capitalize font-custom flex justify-between items-center'>
                    change order status
                    <HiXMark onClick={handleOpen} className='cursor-pointer' />
                </DialogHeader>
                <DialogBody className='pt-2'>
                    <p className='text-secondary text-sm'>{selectOrder.length || 0} orders selected</p>
                    <div className='mt-3 flex flex-col'>
                        <Radio
                            name="type"
                            label="Pending"
                            color='purple'
                            checked={statusHandle === 'Pending'}
                            onChange={() => setStatusHandle('Pending')}
                        />
                        <Radio
                            name="type"
                            label="Processing"
                            color='yellow'
                            checked={statusHandle === 'Processing'}
                            onChange={() => setStatusHandle('Processing')}
                        />
                        <Radio
                            name="type"
                            label="In-Transist"
                            color='blue'
                            checked={statusHandle === 'In-Transist'}
                            onChange={() => setStatusHandle('In-Transist')}
                        />
                        <Radio
                            name="type"
                            label="Cancelled"
                            color='red'
                            checked={statusHandle === 'Cancelled'}
                            onChange={() => setStatusHandle('Cancelled')}
                        />
                        <Radio
                            name="type"
                            label="Delivered"
                            color='green'
                            checked={statusHandle === 'Delivered'}
                            onChange={() => setStatusHandle('Delivered')}
                        />
                        <Radio
                            name="type"
                            label="Invoice Generation"
                            color='black'
                            checked={statusHandle === 'invoice_generated'}
                            onChange={() => setStatusHandle('invoice_generated')}
                        />
                    </div>
                    <div className='flex items-center justify-center mt-10'>
                        <Button onClick={handleUpdateStatus} className='bg-buttonBg text-sm capitalize font-custom font-normal'>Save Status</Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}