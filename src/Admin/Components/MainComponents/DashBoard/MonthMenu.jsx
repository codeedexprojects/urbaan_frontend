import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
    Menu,
    MenuHandler,
    MenuList,
    Button,
    MenuItem,
} from "@material-tailwind/react";
import { useContext } from "react";
import { AppContext } from "../../../../StoreContext/StoreContext";
import axios from "axios";
import { useEffect } from "react";

const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const MonthMenu = ({ setGraphData }) => {
    const [selectedMonth, setSelectedMonth] = useState("Month");
    const { BASE_URL } = useContext(AppContext)


    // Handle month selection
    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
    };

    // Prevent the click event from propagating to the Menu component
    const handleClickInside = (event) => {
        event.stopPropagation();
    };

    useEffect(() => {
        const fetchGraphMonth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Token is missing");
                    return;
                }

                let url = `${BASE_URL}/admin/dashboard/view-graph`;

                if (selectedMonth !== "All") {
                    const startMonth = months.indexOf(selectedMonth);
                    if (selectedMonth === "All") {
                        url = `${BASE_URL}/admin/dashboard/view-graph`; // No query params
                    } else if (startMonth > 0) {
                        url += `?startMonth=${startMonth}&endMonth=${startMonth}`;
                    }
                }

                console.log("Fetching data from:", url);

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data?.data?.length) {
                    const formattedDatas = response.data.data.map((item) => ({
                        x: item?.monthName,
                        y: item?.totalRevenue,
                    }));
                    setGraphData(formattedDatas);
                }
                //  else {
                //     setGraphData([]);
                // }
            } catch (error) {
                console.error("Error fetching graph data:", error.response?.data || error.message);
                console.log(error);

            }
        };

        // Only fetch data if selectedMonth has changed from the default
        if (selectedMonth !== "Month") {
            fetchGraphMonth();
        }
    }, [selectedMonth, BASE_URL, setGraphData]);



    return (
        <Menu placement='bottom-end' closeOnClick={false}>
            <MenuHandler>
                <Button className="cursor-pointer flex items-center justify-between !w-64 font-custom bg-transparent text-gray-700 capitalize text-base font-normal
                border-gray-400 border-[1px] shadow-none rounded-md p-2 focus:shadow-none focus:outline-none hover:shadow-none outline-none"
                    style={{ width: 'fit-content', maxWidth: '150px' }}>
                    <div className="flex gap-1 whitespace-nowrap">
                        {selectedMonth}
                    </div>
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className="h-3.5 w-3.5 transition-transform"
                    />
                </Button>
            </MenuHandler>
            <MenuList
                className="rounded-2xl p-0 max-h-40 overflow-y-scroll"
                style={{ width: "fit-content" }}
            >
                {months.map((month, index) => (
                    <MenuItem className='font-custom text-sm' key={index} onClick={(e) => {
                        handleMonthSelect(month);
                        handleClickInside(e);
                    }}>
                        {month}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

export default MonthMenu