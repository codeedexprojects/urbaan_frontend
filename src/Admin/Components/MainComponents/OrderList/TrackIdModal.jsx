import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../../../StoreContext/StoreContext";
import toast from "react-hot-toast";

export function TrackIdModal({ open, handleOpen, selectedOrderId,fetchOrderList }) {
    const [trackIdInput, setTrackIdInput] = useState();
    const { BASE_URL } = useContext(AppContext);
    const token = localStorage.getItem('token')

    const handleTrackId = async (e) => {
        e.preventDefault();
        try {
            const trackPayload = {
                TrackId: trackIdInput
            }
            console.log(trackPayload);
            const response = await axios.patch(`${BASE_URL}/admin/orderlist/${selectedOrderId}/edit`, trackPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            toast.success('Track Id is created');
            handleOpen();
            fetchOrderList();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen} size='xs'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <Typography className="text-lg font-custom font-bold" variant="lead">
                            Set a Track Id and then click button.
                        </Typography>
                        <HiOutlineXMark className='text-2xl cursor-pointer' onClick={handleOpen} />
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className="grid gap-6">
                        <Input
                            label="Track Id"
                            value={trackIdInput}
                            className='font-custom'
                            onChange={(e) => setTrackIdInput(e.target.value)}
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="gradient" color="green" className='font-custom capitalize text-sm tracking-wider font-normal'
                        onClick={handleTrackId}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}