import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Typography
} from "@material-tailwind/react";
import namer from 'color-namer';
import React from "react";

export function ViewOrdersModal({ handleOpen, open, getUserOrders }) {

    const TABLE_HEAD = ["Product", "Title", "Product Code", "Color", "Size", "Quantity", "Price"];

    // Function to get the nearest named color
    const getNamedColor = (colorCode) => {
        try {
            const namedColors = namer(colorCode);
            return namedColors.pantone[0].name || "Unknown Color";
        } catch (error) {
            console.error("Invalid color code:", error);
            return "Invalid Color";
        }
    };
    const roundPrice = (price) => {
        return Math.ceil(price);
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen} size='lg'>
                <DialogBody>
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none font-custom"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(getUserOrders) && getUserOrders.map((userOrder, index) => {
                                const isLast = index === getUserOrders.length - 1;
                                const classes = isLast ? "p-4 text-center" : "p-4 border-b border-blue-gray-50 text-center";

                                return (
                                    <tr key={userOrder._id}>
                                        <td className={classes}>
                                            <div className='w-full h-24'>
                                                <img
                                                    src={userOrder.productId?.images?.length > 0
                                                        ? userOrder.productId.images[0]
                                                        : "/no-image.jpg"}
                                                    alt="Product Image"
                                                    className='w-full h-full object-cover rounded-xl'
                                                />

                                            </div>
                                        </td>

                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                {userOrder.productId?.title || 'product'}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                {userOrder.productId?.product_Code || 'code'}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                {userOrder?.color?.length > 0 && userOrder?.color
                                                    ? getNamedColor(userOrder?.color)
                                                    : "No Color Available"
                                                }
                                            </Typography>
                                        </td>


                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal uppercase font-custom"
                                            >
                                                {userOrder?.size}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                {userOrder?.quantity}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal capitalize font-custom"
                                            >
                                                ₹{roundPrice(userOrder?.price)}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </DialogBody>
                <DialogFooter className='flex items-center justify-center'>
                    <Button onClick={handleOpen} className='bg-cancelBg cursor-pointer text-sm font-custom font-normal capitalize tracking-wider'>Close</Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}