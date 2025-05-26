import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Menu, MenuHandler, MenuList, Button } from "@material-tailwind/react";

const orderStatus = ["Pending", "Processing","In-Transist", "Delivered",  'invoice_generated', "Cancelled",];

export function FilterOrderStatus({ setFilters, resetFilter }) {
    const [selectedStatus, setSelectedStatus] = useState(null); // Single selection

    // Reset selected status when resetFilter is triggered
    useEffect(() => {
        if (resetFilter) {
            setSelectedStatus(null);
            setFilters((prevFilters) => ({
                ...prevFilters,
                status: undefined, // Reset status filter
            }));
        }
    }, [resetFilter, setFilters]);

    // Handle status selection (single selection)
    const handleOrderStatusSelect = (status) => {
        const newStatus = selectedStatus === status ? null : status; // Toggle selection

        setSelectedStatus(newStatus);

        // Update filters immediately
        setFilters((prevFilters) => ({
            ...prevFilters,
            status: newStatus ? [newStatus] : undefined,
        }));
    };

    return (
        <Menu>
            <MenuHandler>
                <Button
                    className="!bg-white text-secondary rounded-xl cursor-pointer flex items-center gap-5 p-3 font-custom capitalize text-base font-normal
                    border-gray-300 border-[1px] shadow-none focus:shadow-none focus:outline-none hover:shadow-none outline-none"
                    style={{ width: 'fit-content', maxWidth: '200px' }}
                >
                    <div className="flex gap-1 whitespace-nowrap overflow-x-auto hide-scrollbar w-32">
                        {selectedStatus === 'In-Transist' ? 'Dispatched' : selectedStatus === 'invoice_generated' ? 'Invoice Generated' : selectedStatus || "Order Status"}
                    </div>
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className="h-3.5 w-3.5 transition-transform"
                    />
                </Button>
            </MenuHandler>
            <MenuList className="rounded-2xl w-full max-w-lg p-0">
                <div className="border-b-[1px] p-5 hover:outline-none focus:outline-none">
                    <h1 className="text-secondary font-semibold text-lg text-center">Select Order Status</h1>
                    <ul className="mt-5 text-secondary flex flex-wrap justify-center items-center gap-2">
                        {orderStatus.map((status, index) => (
                            <li
                                key={index}
                                onClick={() => handleOrderStatusSelect(status)}
                                className={`cursor-pointer capitalize border-[1px] border-gray-400 text-sm w-[30%] p-2 flex justify-center items-center 
                                rounded-full ${selectedStatus === status ? 'bg-primary text-white' : ''}`}
                            >
                            {status === 'In-Transit' ? 'Dispatched' : status === 'invoice_generated' ? 'Invoice Generated' : status}
                            </li>

                        ))}
                    </ul>
                </div>
            </MenuList>
        </Menu>
    );
}
