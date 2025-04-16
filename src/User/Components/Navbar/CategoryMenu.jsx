import React, { useState, useEffect, useContext } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import AppLoader from "../../../Loader";
import { AppContext } from "../../../StoreContext/StoreContext";
import { Link } from "react-router-dom";

export function CategoryMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const { BASE_URL } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/category/get`);
                setCategories(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                console.log("Category data could not be fetched.");
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [BASE_URL]);

    // Divide categories into two columns
    const midIndex = Math.ceil(categories.length / 2);
    const column1 = categories.slice(0, midIndex);
    const column2 = categories.slice(midIndex);

    const handleItemClick = () => {
        setIsMenuOpen(false);  // Close the menu on item click
    };

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} size="lg">
            <MenuHandler>
                <Typography
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 font-medium font-custom flex items-center gap-1 text-base text-secondary cursor-pointer"
                >
                    Categories
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`hidden h-3 w-3 transition-transform lg:block ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </Typography>
            </MenuHandler>
            <MenuList className="grid grid-cols-2 gap-5 max-h-72 overflow-y-auto">
                {isLoading || categories.length === 0 ? (
                    <div className="col-span-2 flex justify-center items-center h-[50vh]">
                        <AppLoader />
                    </div>
                ) : (
                    <>
                        {/* First column */}
                        <div className="outline-none">
                            {column1.map((category) => (
                                <MenuItem
                                    key={category.id}
                                    className='capitalize'
                                    onClick={handleItemClick}>
                                    <Link to={{
                                        pathname: "/all-category",
                                    }}
                                        state={{ category }}>
                                        {category.name}
                                    </Link>
                                </MenuItem>
                            ))}
                        </div>
                        {/* Second column */}
                        <div className="outline-none">
                            {column2.map((category) => (
                                <MenuItem
                                    key={category.id}
                                    className='capitalize'
                                    onClick={handleItemClick}>
                                    <Link to={{
                                        pathname: "/all-category",
                                    }}
                                        state={{ category }}>
                                        {category.name}
                                    </Link>
                                </MenuItem>
                            ))}
                        </div>
                    </>
                )}
            </MenuList>
        </Menu>
    );
}
