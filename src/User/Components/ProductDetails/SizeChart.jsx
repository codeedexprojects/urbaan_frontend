import React, { useContext } from "react";
import {
    Drawer,
    Radio,
    Typography,
} from "@material-tailwind/react";
import { HiMiniXMark } from "react-icons/hi2";
import { AppContext } from "../../../StoreContext/StoreContext";

const TABLE_HEAD = ["Size", "To Fit Bust (in)", "Front Length (in)", "To Fit Waist (in)", "To Fit Hip (in)"];

const TABLE_ROWS = [
    {
        size: "S",
        bust: "34.0",
        front: "46.0",
        waist: "28.0",
        hip: "36.0"
    },
    {
        size: "M",
        bust: "34.0",
        front: "46.0",
        waist: "28.0",
        hip: "36.0"
    },
    {
        size: "XL",
        bust: "34.0",
        front: "46.0",
        waist: "28.0",
        hip: "36.0"
    },
];

export function SizeChart() {
    const { handleCloseSizeDrawer, openSizeDrawer } = useContext(AppContext)
    return (
        <>
            <Drawer
                open={openSizeDrawer}
                onClose={handleCloseSizeDrawer}
                className="rounded-t-3xl overflow-auto p-4"
                placement='bottom'
                overlay={false}>
                <div className="mb-6 flex items-center justify-between">
                    <Typography className='font-custom text-lg font-bold'>
                        Size Chart
                    </Typography>
                    <div>
                        <HiMiniXMark onClick={handleCloseSizeDrawer} className='text-2xl text-gray-500' />
                    </div>
                </div>
                <div className="mb-8 font-normal">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 text-center w-16"
                                    >
                                        <Typography
                                            className="font-semibold text-xs font-custom"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map((item, index) => {
                                const isLast = index === TABLE_ROWS.length - 1;
                                const classes = isLast ? "p-2 text-center w-10" : "p-2 border-b border-blue-gray-50 text-center w-16";

                                return (
                                    <tr key={index}>
                                        <td className={classes}>
                                            <Typography
                                                className="font-normal text-sm flex items-center font-custom"
                                            ><Radio name="color" color="pink" />
                                                {item.size}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                className="font-normal text-sm font-custom"
                                            >
                                                {item.bust}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                className="font-normal text-sm font-custom"
                                            >
                                                {item.front}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                className="font-normal text-sm font-custom"
                                            >
                                                {item.waist}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                className="font-normal text-sm font-custom"
                                            >
                                                {item.hip}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Drawer>
        </>
    );
}