import React, { useState, useEffect, useContext } from "react";
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
import axios from "axios";
import { AppContext } from "../../../../StoreContext/StoreContext";
import toast from "react-hot-toast";

const EditTrackIdModal = ({ open, handleOpen, selectedOrderId, initialTrackId, fetchOrderList }) => {
    const [editTrackIdInput, setEditTrackIdInput] = useState("");
    const { BASE_URL } = useContext(AppContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (initialTrackId) {
            setEditTrackIdInput(initialTrackId);
        }
    }, [initialTrackId]);

    const handleTrackId = async (e) => {
        e.preventDefault();
        try {
            const trackPayload = {
                TrackId: editTrackIdInput
            };
            const response = await axios.patch(`${BASE_URL}/admin/orderlist/${selectedOrderId}/edit`, trackPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            toast.success('Track Id is updated');
            handleOpen();
            fetchOrderList()
        } catch (error) {
            console.log(error);
            toast.error('Failed to update Track Id');
        }
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen} size='xs'>
                <DialogHeader>
                    <div className="flex justify-between w-full">
                        <Typography className="text-lg font-custom font-bold" variant="lead">
                            Edit Track Id
                        </Typography>
                        <HiOutlineXMark className='text-2xl cursor-pointer' onClick={handleOpen} />
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className="grid gap-6">
                        <Input
                            label="Track Id"
                            value={editTrackIdInput}
                            className='font-custom'
                            onChange={(e) => setEditTrackIdInput(e.target.value)}
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

export default EditTrackIdModal;