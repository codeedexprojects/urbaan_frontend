import React, { useState, useEffect, useContext } from 'react';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import { IoIosArrowDown } from 'react-icons/io';
import axios from 'axios';
import { AppContext } from '../../../StoreContext/StoreContext';
import { Link } from 'react-router-dom';

const FilterByCategory = ({ handleCategoryFilter }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const { BASE_URL } = useContext(AppContext);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/category/get`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [BASE_URL]);

    const handleCategorySelection = (category) => {
        setSelectedCategory(category._id);
        setSelectedCategoryName(category.name);
        handleCategoryFilter(category._id);
        setIsMenuOpen(false); // Close menu after selection
    };

    const handleItemClick = () => {
        setIsMenuOpen(false); // Close the menu on item click (for navigation)
    };

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen}>
            <MenuHandler>
                <Button
                    variant="outlined"
                    className="w-full shadow-none font-custom flex justify-between items-center py-2 px-3
                        border-gray-800 text-gray-800 font-medium rounded-3xl focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Filter by category
                    {selectedCategoryName && (
                        <span className="text-xs capitalize bg-primary ml-5 px-2 text-white rounded-md">
                            {selectedCategoryName}
                        </span>
                    )}
                    <IoIosArrowDown className="text-lg text-gray-800" />
                </Button>
            </MenuHandler>
            <MenuList className="w-72 max-h-64 rounded-xl hide-scrollbar">
                {categories.length > 0 ? (
                    <>
                        {/* Filter option */}
                        {/* {categories.map((category) => (
                            <MenuItem
                                key={category._id}
                                onClick={() => handleCategorySelection(category)}
                                className="capitalize font-medium font-custom text-gray-600 cursor-pointer"
                            >
                                {category.name}
                            </MenuItem>
                        ))} */}
                        
                        
                        
                        {/* Navigation options */}
                        {categories.map((category) => (
                            <MenuItem
                                key={`nav-${category._id}`}
                                className="capitalize font-medium font-custom text-primary cursor-pointer"
                                onClick={handleItemClick}
                            >
                                <Link 
                                    to="/all-category"
                                    state={{ category }}
                                    className="w-full block"
                                >
                                  {category.name}
                                </Link>
                            </MenuItem>
                        ))}
                    </>
                ) : (
                    <div className="text-center text-gray-500 py-2">No categories available</div>
                )}
            </MenuList>
        </Menu>
    );
};

export default FilterByCategory;