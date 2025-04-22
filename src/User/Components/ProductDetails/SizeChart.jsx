import React, { useContext } from "react";
import { Dialog, Typography, Radio, IconButton } from "@material-tailwind/react";
import { HiMiniXMark } from "react-icons/hi2";
import { AppContext } from "../../../StoreContext/StoreContext";

export function SizeChart({ productSizeData = [] }) {
    const { handleCloseSizeDrawer, openSizeDrawer } = useContext(AppContext);

    return (
        <Dialog
            open={openSizeDrawer}
            handler={handleCloseSizeDrawer}
            size="lg"
            className="rounded-lg p-6 max-h-[80vh] overflow-y-auto"
        >
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h4" className="font-bold text-gray-900">
                    Size Guide
                </Typography>
                <IconButton
                    variant="text"
                    onClick={handleCloseSizeDrawer}
                    className="text-gray-500 hover:text-gray-900"
                >
                    <HiMiniXMark className="h-6 w-6" />
                </IconButton>
            </div>

            <div className="space-y-8">
                {productSizeData.length > 0 ? (
                    productSizeData.map((chart, chartIndex) => (
                        <div key={chartIndex} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-100 p-4">
                                <Typography variant="h5" className="font-semibold">
                                    {chart.title}
                                </Typography>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 text-left min-w-[80px]">
                                                <Typography variant="small" className="font-semibold">
                                                    Size
                                                </Typography>
                                            </th>
                                            {chart.sizes[0]?.measurements &&
                                                Object.keys(chart.sizes[0].measurements).map((key, index) => (
                                                    <th key={index} className="p-3 text-center">
                                                        <Typography variant="small" className="font-semibold">
                                                            {key} (in)
                                                        </Typography>
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {chart.sizes.map((size, sizeIndex) => (
                                            <tr key={sizeIndex}>
                                                <td className="p-3">
                                                <span>{size.size}</span>
                                                </td>
                                                {size.measurements ? (
                                                    Object.values(size.measurements).map((value, valueIndex) => (
                                                        <td key={valueIndex} className="p-3 text-center">
                                                            <Typography variant="small">{value}"</Typography>
                                                        </td>
                                                    ))
                                                ) : (
                                                    <td
                                                        colSpan={
                                                            chart.sizes[0]?.measurements
                                                                ? Object.keys(chart.sizes[0].measurements).length
                                                                : 0
                                                        }
                                                        className="p-3 text-center"
                                                    >
                                                        <Typography variant="small">No measurements</Typography>
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
                    <Typography>No size chart data found for this product.</Typography>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleCloseSizeDrawer}
                    className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                    Close
                </button>
            </div>
        </Dialog>
    );
}
