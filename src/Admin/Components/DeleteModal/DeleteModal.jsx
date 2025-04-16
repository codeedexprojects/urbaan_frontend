import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    Typography,
} from "@material-tailwind/react";

export function DeleteModal({ open, handleOpen, title, description, handleDelete, modalType, catId, SubCatId, carouselId, couponId, productId, deliveryId, UserId }) {
    return (
        <Dialog open={open} handler={handleOpen} size="sm" className="rounded-none" aria-modal="true">
            <div className={`inert ${open ? '' : 'block'}`}>
                <DialogBody className="flex flex-col justify-center items-center py-8 px-10 space-y-5">
                    <div className="w-12 h-12">
                        <img src="/close.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <Typography className="font-custom text-2xl text-secondary font-semibold">
                        {title}
                    </Typography>
                    <Typography className="font-custom text-base text-gray-500 font-light text-center">
                        {description}
                    </Typography>
                    <div className="flex items-center space-x-2">
                        <Button
                            className="bg-gray-300 text-black font-custom capitalize text-sm tracking-wider font-normal w-36"
                            onClick={handleOpen}
                        >
                            Close
                        </Button>
                        <Button
                            className="bg-deleteBg text-white font-custom capitalize text-sm tracking-wider font-normal w-36"
                            onClick={() => {
                                if (modalType === "categories") {
                                    handleDelete(catId);
                                } 
                                else if (modalType === "subcategories") {
                                    handleDelete(SubCatId);
                                } 
                                else if (modalType === "carousel") {
                                    handleDelete(carouselId);
                                }
                                else if (modalType === "coupon") {
                                    handleDelete(couponId);
                                }
                                else if (modalType === "products") {
                                    handleDelete(productId);
                                }
                                else if (modalType === "delivery") {
                                    handleDelete(deliveryId);
                                }
                                else if (modalType === "user") {
                                    handleDelete(UserId);
                                }

                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogBody>
            </div >
        </Dialog >
    );
}
