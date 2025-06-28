import React, { useContext } from "react";
import { Dialog, Typography, IconButton } from "@material-tailwind/react";
import { HiMiniXMark } from "react-icons/hi2";
import { AppContext } from "../../../StoreContext/StoreContext";

export function SizeChart({ productSizeData = [] }) {
    const { handleCloseSizeDrawer, openSizeDrawer } = useContext(AppContext);

    return (
        <Dialog
            open={openSizeDrawer}
            handler={handleCloseSizeDrawer}
            size="md"
            className="rounded-lg p-4 max-h-[70vh] overflow-y-auto"
        >
            <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="font-bold text-gray-900">
                    Size Guide
                </Typography>
                <IconButton
                    variant="text"
                    onClick={handleCloseSizeDrawer}
                    className="text-gray-500 hover:text-gray-900 p-1"
                >
                    <HiMiniXMark className="h-5 w-5" />
                </IconButton>
            </div>

            <div className="space-y-4">
                {productSizeData.length > 0 ? (
                    productSizeData.map((chart, chartIndex) => (
                        <div key={chartIndex} className="border rounded-md overflow-hidden">
                            <div className="bg-gray-50 p-2">
                                <Typography variant="h6" className="font-medium text-sm">
                                    {chart.title}
                                </Typography>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-25">
                                        <tr>
                                            <th className="p-2 text-left min-w-[60px]">
                                                <Typography variant="small" className="font-medium text-xs">
                                                    Size
                                                </Typography>
                                            </th>
                                            {chart.sizes[0]?.measurements &&
                                                Object.keys(chart.sizes[0].measurements).map((key, index) => (
                                                    <th key={index} className="p-2 text-center">
                                                        <Typography variant="small" className="font-medium text-xs">
                                                            {key} (in)
                                                        </Typography>
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {chart.sizes.map((size, sizeIndex) => (
                                            <tr key={sizeIndex} className="hover:bg-gray-25">
                                                <td className="p-2">
                                                    <span className="text-xs font-medium">{size.size}</span>
                                                </td>
                                                {size.measurements ? (
                                                    Object.values(size.measurements).map((value, valueIndex) => (
                                                        <td key={valueIndex} className="p-2 text-center">
                                                            <Typography variant="small" className="text-xs">{value}"</Typography>
                                                        </td>
                                                    ))
                                                ) : (
                                                    <td
                                                        colSpan={
                                                            chart.sizes[0]?.measurements
                                                                ? Object.keys(chart.sizes[0].measurements).length
                                                                : 0
                                                        }
                                                        className="p-2 text-center"
                                                    >
                                                        <Typography variant="small" className="text-xs text-gray-500">No measurements</Typography>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <Typography className="text-sm text-gray-500">No size chart data found for this product.</Typography>
                )}
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleCloseSizeDrawer}
                    className="px-4 py-1.5 bg-pink-500 text-white text-sm rounded-md hover:bg-pink-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </Dialog>
    );
}