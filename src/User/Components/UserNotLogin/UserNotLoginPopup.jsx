import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function UserNotLoginPopup({ open, handleOpen }) {
    // if (!open) return null;

    return (
        <>
            <Dialog open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: 1 },
                }}
                size="xs" className="rounded-none">
                <DialogBody className="flex flex-col justify-center items-center p-5">
                    <Typography className="font-custom text-xl xl:text-2xl lg:text-2xl text-secondary font-semibold mb-2">
                        Oops! You're not logged in
                    </Typography>
                    <Typography className="font-custom text-sm xl:text-base lg:text-base text-gray-500 font-light text-center mb-7">
                        To continue, please log in to your account.
                    </Typography>
                    <Link
                        to="/login-user"
                        className="focus:outline-none"
                        onClick={() => console.log("Login link clicked")}
                    >
                        <Button
                            // onClick={handleOpenUserNotLogin}
                            className="w-32 bg-primary text-sm capitalize font-normal"
                        >
                            <span>Log in</span>
                        </Button>
                    </Link>
                </DialogBody>
            </Dialog>
        </>
    );
}
