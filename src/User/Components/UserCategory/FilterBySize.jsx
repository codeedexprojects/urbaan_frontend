import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import { IoIosArrowDown } from 'react-icons/io';
import { useContext } from 'react';
import { AppContext } from '../../../StoreContext/StoreContext';


const FilterBySize = ({ handleSizeFilter }) => {
    const { BASE_URL } = useContext(AppContext);
    const [selectedSize, setSelectedSize] = useState("");
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchAllProductSize = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/products/view-products`);
                const allProducts = response.data;

                // Extract sizes from products
                const extractedSizes = allProducts.flatMap(product =>
                    product.colors.flatMap(color =>
                        color.sizes.map(size => size.size)
                    )
                );

                // Remove duplicates and sort sizes
                const uniqueSizes = Array.from(new Set(extractedSizes)).sort();
                setSizes(uniqueSizes);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchAllProductSize();
    }, []);

    const handleSizeSelection = (size) => {
        setSelectedSize(size);
        handleSizeFilter(size);
    };

    return (
        <Menu>
            <MenuHandler>
                <Button
                    variant="outlined"
                    className="w-full shadow-none font-custom flex justify-between items-center py-2 px-3 
                         border-gray-800 text-gray-800 font-medium rounded-3xl focus:outline-none"
                >
                    Filter by size
                    <span className="text-xs uppercase bg-primary ml-5 px-2 text-white rounded-md">
                        {selectedSize}
                    </span>
                    <IoIosArrowDown className="text-lg text-gray-800" />
                </Button>
            </MenuHandler>
            <MenuList className="w-72 max-h-64 rounded-xl hide-scrollbar">
                {sizes.length > 0 ? (
                    sizes.map((size, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => handleSizeSelection(size)}
                            className="uppercase font-medium font-custom text-gray-600 cursor-pointer border-2 rounded-full w-20 h-10
                                    flex justify-center items-center mb-1"
                        >
                            {size}
                        </MenuItem>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-2">No sizes available</div>
                )}
            </MenuList>
        </Menu>
    );
};

export default FilterBySize;
