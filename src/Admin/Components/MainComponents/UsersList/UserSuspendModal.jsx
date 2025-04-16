import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    Typography,
} from "@material-tailwind/react";

export function UserSuspendModal({ open, handleOpen, userId, handleSuspend, setIsSuspend }) {
    return (
        <>
            <Dialog open={open} handler={handleOpen} size='sm' className='rounded-none'>
                <DialogBody className='flex flex-col justify-center items-center py-8 px-10 space-y-5'>
                    <div className='w-12 h-12'>
                        <img src="/closeSuspend.png" alt="" className='w-full h-full object-cover' />
                    </div>
                    <Typography className='font-custom text-2xl text-secondary font-semibold'>
                        Do you want to suspend this ?
                    </Typography>
                    <Typography className='font-custom text-base text-gray-500 font-light text-center'>
                        You can reactivate it later
                    </Typography>
                    <div className='flex items-center space-x-2'>
                        <Button
                            className='bg-gray-300 text-black font-custom capitalize text-sm tracking-wider font-normal w-36'
                            onClick={handleOpen}
                        >
                            <span>Close</span>
                        </Button>
                        <Button
                            className='bg-processingBg text-white font-custom capitalize text-sm tracking-wider font-normal w-36'
                            onClick={async () => {
                                await handleSuspend(userId);
                                setIsSuspend(false); // State update after API call
                            }}
                        >
                            <span>Suspend</span>
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}