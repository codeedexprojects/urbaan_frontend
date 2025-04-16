import React, { useContext, useState, useEffect } from "react";
import {
    Drawer,
    Button,
    Typography,
    Checkbox,
} from "@material-tailwind/react";
import { AppContext } from "../../../StoreContext/StoreContext";
import axios from "axios";

const priceRanges = [
    "Under ₹100",
    "₹100 - ₹250",
    "₹250 - ₹500",
    "₹500 - ₹750",
    "₹750 - ₹1000",
    "₹1000 - ₹1500",
    "₹1500 - ₹2000",
    "₹2000 - ₹3000",
];

export function ViewCategoryDrawer({ setFilteredProducts, allProducts, setNoProductsFound, selectedFilters, setSelectedFilters }) {
    const { openBottomDrawer, handleCloseBottomDrawer, BASE_URL } = useContext(AppContext);
    const [filterBy, setFilterBy] = useState("Price");
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [materials, setMaterials] = useState([])

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/category/get`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error.response || error.message);
                alert("Failed to load categories.");
            }
        };

        fetchCategories();
    }, [BASE_URL]);

    // Fetch sizes from API
    useEffect(() => {
        const fetchAllProductSize = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/products/view-products`);
                const allProducts = response.data;

                const extractedSizes = allProducts.flatMap(product =>
                    product.colors.flatMap(color =>
                        color.sizes.map(size => size.size)
                    )
                );

                const uniqueSizes = Array.from(new Set(extractedSizes)).sort();
                setSizes(uniqueSizes);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchAllProductSize();
    }, [BASE_URL]);

    useEffect(() => {
        const fetchAllMaterials = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/products/view-products`);
                const products = response.data; // Assuming this contains the product data

                // Extract materials and get unique values
                const extractedMaterials = [
                    ...new Set(products.map((product) => product.features.material))
                ];

                setMaterials(extractedMaterials);
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        }
        fetchAllMaterials()
    }, [BASE_URL])

    // Handle Checkbox Changes
    const handleFilterChange = (type, value) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            const filterArray = updatedFilters[type];

            if (filterArray.includes(value)) {
                updatedFilters[type] = filterArray.filter(item => item !== value);
            } else {
                updatedFilters[type] = [...filterArray, value];
            }
            return updatedFilters;
        });
    };


    const checkPriceRange = (price, range) => {
        // Handle "Under ₹X" case
        if (range.startsWith("Under")) {
            const upperLimit = parseInt(range.replace("Under ₹", ""));
            console.log(`Checking if ${price} is under ${upperLimit}`);
            return price <= upperLimit;
        }

        // Handle regular range case "₹X - ₹Y"
        const [min, max] = range.split(" - ").map(val => parseInt(val.replace("₹", "")));
        console.log(`Checking if ${price} is between ${min} and ${max}`);
        return price >= min && price <= max;
    };

    const applyFilters = () => {
        const filtered = allProducts.filter((product) => {
            const priceMatch = selectedFilters.price.length > 0
                ? selectedFilters.price.some((range) => {
                    const matches = checkPriceRange(product.offerPrice, range);
                    console.log(`Price ${product.offerPrice} in range ${range}: ${matches}`);
                    return matches;
                })
                : true;

            const categoryMatch = selectedFilters.category.length > 0
                ? selectedFilters.category.includes(product.category.name)
                : true;

            const sizeMatch = selectedFilters.size.length > 0
                ? product.colors.some((color) =>
                    color.sizes.some((s) => selectedFilters.size.includes(s.size))
                )
                : true;

            const materialMatch = selectedFilters.material.length > 0
                ? selectedFilters.material.includes(product.features.material)
                : true;

            return priceMatch && categoryMatch && sizeMatch && materialMatch;

        });
        console.log("Filtered Products:", filtered);
        setFilteredProducts(filtered);
        handleCloseBottomDrawer()
        setNoProductsFound(filtered?.length === 0);
    };

    const clearAll = () => {
        setSelectedFilters({ price: [], category: [], size: [], material: [] });
        handleCloseBottomDrawer()
        setFilteredProducts(allProducts);
    };

    return (
        <Drawer
            open={openBottomDrawer}
            onClose={handleCloseBottomDrawer}
            className="rounded-t-3xl overflow-auto"
            placement="bottom"
            size={550}
        >
            <div className="grid grid-flow-col h-full">
                <div className="col-span-1 bg-white shadow-lg flex flex-col p-4 rounded-tl-3xl">
                    <Typography className="font-custom text-lg font-medium">
                        Filters
                    </Typography>
                    <ul className="mt-5 space-y-3">
                        {["Price", "Category", "Size", "Material"].map((label) => (
                            <li
                                key={label}
                                onClick={() => setFilterBy(label)}
                                className={`text-sm cursor-pointer ${filterBy === label ? "text-secondary font-medium" : "text-gray-600"
                                    }`}
                            >
                                Filter by {label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-span-2 bg-gray-100 flex flex-col p-4 rounded-tr-3xl overflow-y-scroll pb-20">
                    <ul className="space-y-0">
                        {filterBy === "Price" && priceRanges.map((item, index) => (
                            <li key={index}
                                className='capitalize text-sm'>
                                <Checkbox
                                    checked={selectedFilters.price.includes(item)}
                                    onChange={() => handleFilterChange("price", item)}
                                    label={item}
                                    color='pink'
                                    className='rounded-sm'
                                />
                            </li>
                        ))}
                        {filterBy === "Category" && categories.map((category) => (
                            <li key={category._id}
                                className='capitalize text-sm'>
                                <Checkbox
                                    checked={selectedFilters.category.includes(category.name)}
                                    onChange={() => handleFilterChange("category", category.name)}
                                    label={category.name}
                                    color='pink'
                                    className='rounded-sm'
                                />
                            </li>
                        ))}
                        {filterBy === "Size" && sizes.map((size, index) => (
                            <li key={index}
                                className='uppercase text-sm'>
                                <Checkbox
                                    checked={selectedFilters.size.includes(size)}
                                    onChange={() => handleFilterChange("size", size)}
                                    label={size}
                                    color='pink'
                                    className='rounded-sm'
                                />
                            </li>
                        ))}
                        {filterBy === "Material" && materials.map((material, index) => (
                            <li key={index}
                                className='capitalize text-sm'>
                                <Checkbox
                                    checked={selectedFilters?.material?.includes(material)}
                                    onChange={() => handleFilterChange("material", material)}
                                    label={material}
                                    color='pink'
                                    className='rounded-sm'
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="fixed bottom-0 w-full bg-white shadow-2xl p-4">
                <div className="flex justify-center items-center gap-3">
                    <Button
                        className='bg-secondary w-full font-custom capitalize text-sm font-normal'
                        onClick={clearAll}
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={applyFilters}
                        className='bg-primary w-full font-custom capitalize text-sm font-normal'>
                        Apply filter</Button>
                </div>
            </div>
        </Drawer>
    );
}
