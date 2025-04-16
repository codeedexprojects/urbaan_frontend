import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    Typography,
} from "@material-tailwind/react";

export function RemoveAddressModal({ openRemoveModal, handleOpenRemoveModal, handleDelete, addressId }) {

    return (
        <>
            <Dialog open={openRemoveModal} handler={handleOpenRemoveModal} size='sm' className="rounded-none">
                <DialogBody className="flex flex-col justify-center items-center py-8 px-10 space-y-5">
                    <div className="w-12 h-12">
                        <img src="/close.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <Typography className="font-custom text-2xl text-secondary font-semibold">
                        Are you sure ?
                    </Typography>
                    <Typography className="font-custom text-base text-gray-500 font-light text-center">
                        Do you really want to delete this Address?
                    </Typography>
                    <div className="flex items-center space-x-2">
                        <Button
                            className="bg-gray-300 text-black font-custom capitalize text-sm tracking-wider font-normal"
                            onClick={handleOpenRemoveModal}
                        >
                            Close
                        </Button>
                        <Button
                            className="bg-deleteBg text-white font-custom capitalize text-sm tracking-wider font-normal"
                            onClick={() => handleDelete(addressId)}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}