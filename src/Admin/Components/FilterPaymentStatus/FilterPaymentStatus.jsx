import React, { useState, useEffect, useCallback } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  MenuList,
  Button,
} from "@material-tailwind/react";

const paymentStatus = ["Paid", "Unpaid", "Refund", "Pending"];

export function FilterPaymentStatus({ setFilters, resetFilter }) {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null); // Store a single selected status

  const handleStatusSelect = useCallback((status) => {
    setSelectedPaymentStatus(status); // Directly set the selected status

    // Update filters
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: status,  // Set the selected payment status to the filter
    }));
  }, [setFilters]);

  useEffect(() => {
    if (resetFilter) {
      setSelectedPaymentStatus(null); // Reset the selected status
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: null,  // Reset the paymentStatus filter
      }));
    }
  }, [resetFilter, setFilters]);

  return (
    <Menu>
      <MenuHandler>
        <Button className="!bg-white text-secondary rounded-xl cursor-pointer flex items-center gap-5 p-3 font-custom 
        capitalize text-base font-normal border-gray-300 border-[1px] shadow-none focus:shadow-none hover:shadow-none">
          <div className="flex gap-1 whitespace-nowrap overflow-x-auto hide-scrollbar w-32">
            {selectedPaymentStatus || "Payment Status"} {/* Display only the selected status */}
          </div>
          <ChevronDownIcon
            strokeWidth={2.5}
            className="h-3.5 w-3.5 transition-transform"
          />
        </Button>
      </MenuHandler>
      <MenuList className="rounded-2xl w-full max-w-lg p-0">
        <div className="p-5">
          <ul className="mt-5 flex flex-wrap justify-center items-center gap-2">
            {paymentStatus.map((status, index) => (
              <li
                key={index}
                onClick={() => handleStatusSelect(status)}
                className={`cursor-pointer border-[1px] border-gray-400 text-sm w-[30%] p-2 flex justify-center items-center 
                rounded-full ${selectedPaymentStatus === status
                    ? "bg-primary text-white"
                    : ""
                  }`}
              >
                {status}
              </li>
            ))}
          </ul>
        </div>
      </MenuList>
    </Menu>
  );
}
