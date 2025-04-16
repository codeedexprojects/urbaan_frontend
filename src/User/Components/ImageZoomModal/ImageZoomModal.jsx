import React from "react";
import {
    Carousel,
    Dialog,
    DialogBody,
    IconButton,
} from "@material-tailwind/react";
import { HiOutlineXMark } from "react-icons/hi2";

export function ImageZoomModal({ handleOpen, open, zoomImage }) {
    const { images, currentIndex } = zoomImage || {};

    return (
        <Dialog
            open={open}
            handler={handleOpen}
            size="xl"
            className="bg-transparent shadow-none focus:outline-none"
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: 1 },
            }}
        >
            <DialogBody className="p-0 relative bg-transparent">
                {/* Image container */}
                <div className="relative w-full flex items-center justify-center p-4">
                    {images && images.length > 0 ? (
                        <>
                            <img
                                src={images[currentIndex]}
                                alt="Zoomed Product"
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
                            />
                            {/* Close button inside image */}
                            <HiOutlineXMark
                                onClick={handleOpen}
                                className="absolute top-4 right-4 text-gray-800 bg-white w-8 h-8 p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-200 transition"
                            />
                        </>
                    ) : (
                        <p className="text-gray-500">No image available</p>
                    )}
                </div>
            </DialogBody>
        </Dialog>
    );
}

