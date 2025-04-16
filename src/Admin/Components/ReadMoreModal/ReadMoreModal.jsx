import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export function ReadMoreModal({ handleOpen, open, category }) {
    if (!category) return null; // Ensure item is defined

    return (
        <Dialog
            open={open}
            handler={() => handleOpen(null)}
            size="xs"
            className="fixed right-0 p-0 rounded-none"
            animate={{
                mount: { x: 0, y: 0 }, // Center position
                unmount: { x: 100, y: 0 }, // Move off to the right
            }}
        >
            <DialogBody className="flex flex-col justify-center items-center space-y-4">
                <div className="w-full h-72">
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-none"
                    />
                </div>
                <div>
                    <h1 className="font-bold text-2xl text-secondary capitalize mb-3">
                        {category.name}
                    </h1>
                    <p className="font-normal text-gray-600 capitalize text-sm">
                        {category.description}
                    </p>
                </div>
            </DialogBody>
        </Dialog>
    );
}
