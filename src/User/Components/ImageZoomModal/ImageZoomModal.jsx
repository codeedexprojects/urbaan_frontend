import React from "react";
import {
    Dialog,
    DialogBody,
    IconButton,
} from "@material-tailwind/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export function ImageZoomModal({ handleOpen, open, zoomImage, onNext, onPrev }) {
    const { images = [], currentIndex = 0 } = zoomImage || {};

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
                    {images.length > 0 ? (
                        <>
                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <IconButton
                                        variant="text"
                                        onClick={onPrev}
                                        className="!absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg h-12 w-12 flex items-center justify-center transition"
                                    >
                                        <IoIosArrowBack className="text-2xl" />
                                    </IconButton>

                                    <IconButton
                                        variant="text"
                                        onClick={onNext}
                                        className="!absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg h-12 w-12 flex items-center justify-center transition"
                                    >
                                        <IoIosArrowForward className="text-2xl" />
                                    </IconButton>

                                </>
                            )}

                            <img
                                src={images[currentIndex]}
                                alt="Zoomed Product"
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
                            />

                            {/* Close button */}
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