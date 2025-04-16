import React, { useState } from 'react';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import { IoIosArrowDown } from 'react-icons/io';
import Slider from '@mui/material/Slider';

const FilterByPrice = ({ handlePriceFilter }) => {
    const [priceRange, setPriceRange] = useState([300, 1500]); // Ensure consistent min/max values

    const handlePriceChange = (event, newValue) => {
        // Update range only if values are valid
        setPriceRange(newValue);
    };

    const handleClickInside = (event) => {
        event.stopPropagation();
    };

    return (
        <Menu>
            <MenuHandler>
                <Button
                    variant="outlined"
                    className="w-full shadow-none font-custom flex justify-between items-center py-2 px-3 
                    border-gray-800 text-gray-800 font-medium rounded-3xl focus:outline-none"
                >
                    Filter by price
                    <IoIosArrowDown className="text-lg text-gray-800" />
                </Button>
            </MenuHandler>
            <MenuList className="w-72 max-h-64 rounded-xl p-4">
                <MenuItem className="p-2 hover:!bg-transparent focus:!bg-transparent">
                    <div className="text-gray-800 font-medium mb-4">Price Range</div>
                    <Slider
                        size="small"
                        value={priceRange}
                        onChange={handlePriceChange}
                        onClick={handleClickInside}
                        valueLabelDisplay="auto"
                        min={300}
                        max={1500}
                        valueLabelFormat={(value) => `₹${value}`}
                    />
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-800 mt-2">
                            Selected: ₹{priceRange[0]} - ₹{priceRange[1]}
                        </div>
                        <Button
                            className="bg-primary text-white font-custom text-sm capitalize font-normal py-1 px-5 opacity-100 shadow-none"
                            onClick={() => handlePriceFilter(priceRange)}
                        >
                            Filter
                        </Button>
                    </div>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

export default FilterByPrice
