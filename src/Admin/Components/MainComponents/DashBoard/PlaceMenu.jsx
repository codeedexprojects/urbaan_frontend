import React, { useState, useEffect, useContext } from 'react';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';

const places = [
    "All",
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod"
];

const PlaceMenu = ({ setGraphData }) => {
    const [selectedPlace, setSelectedPlace] = useState("Place"); // Default to "All"
    const { BASE_URL } = useContext(AppContext);

    const handleMenuItemClick = (place) => {
        setSelectedPlace(place); // Update selected place
    };

    useEffect(() => {
        const fetchGraphPlace = async () => {
            try {
                const token = localStorage.getItem("token");
                const url =
                    selectedPlace === "All"
                        ? `${BASE_URL}/admin/dashboard/view-graph`
                        : `${BASE_URL}/admin/dashboard/view-graph?place=${selectedPlace}`;

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data?.data?.length) {
                    const formattedData = response.data.data.map((item) => ({
                        x: item?.monthName || "N/A",
                        y: item?.totalRevenue || 0,
                    }));
                    setGraphData(formattedData);
                } 
                // else {
                //     setGraphData([]); // Handle empty data
                // }
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };

        fetchGraphPlace();
    }, [selectedPlace, BASE_URL, setGraphData]);

    return (
        <Menu placement="bottom-end">
            <MenuHandler>
                <Button className="cursor-pointer flex items-center justify-between !w-64 font-custom bg-transparent text-gray-700 capitalize text-base font-normal
                border-gray-400 border-[1px] shadow-none rounded-md p-2 focus:shadow-none focus:outline-none hover:shadow-none outline-none"
                    style={{ width: 'fit-content', maxWidth: '150px' }}
                >
                    {selectedPlace} {/* Display selected place */}
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
                {places.map((place, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleMenuItemClick(place)}
                        className="font-custom text-sm"
                    >
                        {place}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

export default PlaceMenu
