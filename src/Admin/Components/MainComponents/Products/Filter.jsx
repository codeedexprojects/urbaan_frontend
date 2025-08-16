import { Checkbox, Typography } from '@material-tailwind/react';
import React, { useContext, useEffect, useState } from 'react';
import { FaRegRectangleList } from "react-icons/fa6";
import { LuLayoutGrid } from "react-icons/lu";
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';
import AppLoader from '../../../../Loader';

const Filter = ({ view, setView, categoryFilter, setCategoryFilter, setProducts }) => {
    const [categories, setCategories] = useState([]);
    const { BASE_URL } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/category/get`);
                setCategories(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [BASE_URL]);

    // Handle filter submission
    const handleFilter = async () => {
        try {
            let response;
            if (categoryFilter.length === 0) {
                // Fetch all products if no category is selected
                response = await axios.get(`${BASE_URL}/admin/products/view-products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data)
            } else {
                // Filter products by selected categories
                const filterPayload = { categoryIds: categoryFilter };
                response = await axios.post(
                    `${BASE_URL}/admin/products/filter`,
                    filterPayload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // Update the product list based on the response
                setProducts(response.data.products);
            }

        } catch (error) {
            console.error("Error filtering products:", error);
        } finally {
            setIsLoading(false);  // End loading
        }
    };

    useEffect(() => {
        handleFilter();
    }, [categoryFilter, BASE_URL, token]);  // Re-run when categoryFilter changes


    const handleCategoryChange = (categoryId) => {
        setCategoryFilter((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };


    return (
        <div className='bg-white shadow-sm border-[1px] rounded-xl p-5'>
            <ul className='flex items-center justify-between gap-2'>
                <li
                    onClick={() => setView("list")}
                    className={`text-secondary text-base font-normal bg-gray-100 rounded-md flex items-center justify-center gap-1 py-2 w-full transition-all duration-300 ease-in-out cursor-pointer ${view === 'list' ? '!bg-primary/30 py-2 px-2 rounded-md !text-primary' : ""}`}
                >
                    <FaRegRectangleList /> List View
                </li>
                <li
                    onClick={() => setView("grid")}
                    className={`text-secondary text-base font-normal bg-gray-100 rounded-md flex items-center justify-center gap-1 py-2 w-full transition-all duration-300 ease-in-out cursor-pointer ${view === 'grid' ? '!bg-primary/30 py-2 px-2 rounded-md !text-primary' : ""}`}
                >
                    <LuLayoutGrid /> Grid View
                </li>
            </ul>
            <div className='mt-5'>
                <h2 className='text-secondary font-medium'>Filters</h2>
                <div className='flex flex-col'>
                    {isLoading || categories.length === 0 ? (
                        <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                            <AppLoader />
                        </div>
                    ) : (
                        categories.map((category) => (
                            <Checkbox
                                key={category.id}
                                value={category.id}
                                checked={categoryFilter.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                                label={
                                    <Typography className='font-custom text-secondary text-base font-normal capitalize'>
                                        {category.name}
                                    </Typography>
                                }
                                color='pink'
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Filter;