import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    Radio,
    Input,
    Checkbox,
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
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [cancellationPassword, setCancellationPassword] = useState('')
    const [isRefunded, setIsRefunded] = useState(false)
    const [cancelReason, setCancelReason] = useState('')

    const token = localStorage.getItem('token')

    const handleUpdateStatus = async () => {
        // If status is Cancelled, show password modal instead of proceeding
        if (statusHandle === 'Cancelled') {
            setShowPasswordModal(true)
            return
        }
        
        await updateStatus(statusHandle)
    };

    const handleCancelOrder = async () => {
        if (!cancellationPassword) {
            toast.error("Please enter the cancellation password")
            return
        }
        
        const payload = {
            status: statusHandle,
            cancellationPassword,
            isRefunded,
            cancelReason: cancelReason || "No reason provided"
        }
        
        await updateStatus(statusHandle, payload)
        setShowPasswordModal(false)
        setCancellationPassword('')
        setIsRefunded(false)
        setCancelReason('')
    }

    const updateStatus = async (status, additionalPayload = {}) => {
        try {
            const statusPayload = {
                orderIds: selectOrder,
                status,
                ...additionalPayload
            }

            const updatedOrders = orderList.map(order => {
                if (selectOrder.includes(order._id)) {
                    return { ...order, status };
                }
                return order;
            });
            setOrderList(updatedOrders);

            const response = await axios.patch(`${BASE_URL}/admin/orderlist/edit/status`, statusPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            toast.success("Status updated");

            if (response.data.skippedOrders && response.data.skippedOrders.length > 0) {
                const skippedOrderNumbers = response.data.skippedOrders
                    .map(order => order.order_id)
                    .join(", ");
                setTimeout(() => {
                    toast.error(`Warning: Orders (${skippedOrderNumbers}) were skipped.`);
                }, 3000)
            }

            if (response.data.updatedOrders.some(order => order.TrackId)) {
                setTimeout(() => {
                    toast.success("Mail has been sent for tracked orders.");
                }, 2000)
            }

            setSelectOrder([])
            handleOpen()
        } catch (error) {
            if (error.response && error.response.status === 400) {
                if (error.response.data.message === 'No valid orders found for updating.') {
                    handleOpen()
                    toast.error("No valid orders found for updating.");
                } else if (error.response.data.message === 'Invalid cancellation password') {
                    toast.error("Incorrect cancellation password");
                } else {
                    toast.error(error.response.data.message || "Something went wrong!");
                }
            } else {
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

            {/* Cancellation password modal */}
            <Dialog open={showPasswordModal} handler={() => setShowPasswordModal(false)} size='xs'>
                <DialogHeader className='capitalize font-custom flex justify-between items-center'>
                    Confirm Order Cancellation
                    <HiXMark onClick={() => setShowPasswordModal(false)} className='cursor-pointer' />
                </DialogHeader>
                <DialogBody className='pt-2'>
                    <div className='space-y-4'>
                        <Input
                            type='password'
                            label='Enter cancellation password'
                            value={cancellationPassword}
                            onChange={(e) => setCancellationPassword(e.target.value)}
                        />
                        {/* <Input
                            label='Cancellation reason (optional)'
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        /> */}
                        <Checkbox
                            label='Mark as refunded'
                            checked={isRefunded}
                            onChange={() => setIsRefunded(!isRefunded)}
                        />
                    </div>
                    <div className='flex items-center justify-center mt-10 space-x-4'>
                        <Button 
                            onClick={() => setShowPasswordModal(false)} 
                            className='bg-gray-500 text-sm capitalize font-custom font-normal'
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCancelOrder} 
                            className='bg-red-500 text-sm capitalize font-custom font-normal'
                        >
                            Confirm Cancellation
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}