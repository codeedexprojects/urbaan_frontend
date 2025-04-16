import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import { AppContext } from "../../../../StoreContext/StoreContext";
import { DeleteModal } from '../../DeleteModal/DeleteModal';
import { ReadMoreModal } from '../../ReadMoreModal/ReadMoreModal';
import axios from 'axios';
import { Card } from '@material-tailwind/react';
import AppLoader from '../../../../Loader';
import toast from 'react-hot-toast';

const AddedCategories = ({ createEdit, handleEditCategory, adminCategory, setAdminCategory }) => {
    const { open, handleOpen, modalType, BASE_URL } = useContext(AppContext);
    const [readMoreDetails, setReadMoreDetails] = useState(null);
    const [selectedCatId, setSelectedCatId] = useState(null); // Track selected category ID for deletion
    const [isLoading, setIsLoading] = useState(true)

    const handleReadmore = (cat) => {
        setReadMoreDetails(cat);
        handleOpen("readMoreModal");
    }

    //fetch category
    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/category/get`);
            setAdminCategory(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleDeleteCategory = async (catId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication token is missing");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin/category/delete/${catId}`, { headers });
            console.log(response.data);
            handleOpen(); // Close modal after deletion
            toast.success("Category is deleted")
            fetchCategory();
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category.");
        }
    }

    return (
        <>

            {
                isLoading || adminCategory.length === 0 ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : (
                    <>
                        {adminCategory.map((category) => (
                            <Card className="p-5 space-y-6 relative" key={category.id}>
                                <div className='w-full h-72'>
                                    <img src={category.imageUrl} alt={category.name} className='h-full w-full object-cover rounded-lg' />
                                </div>
                                <div>
                                    <h2 className="font-bold text-2xl text-secondary capitalize">{category.name}</h2>
                                    <h2 className="font-normal text-gray-600 text-sm capitalize truncate">{category.description}</h2>
                                </div>
                                <div className="flex items-center justify-between">
                                    {/* Read More Link */}
                                    <Link
                                        onClick={() => handleReadmore(category)}
                                        className="text-buttonBg text-sm flex items-center gap-2 hover:text-blue-900"
                                    >
                                        <p>Read more</p> <FaArrowRight />
                                    </Link>

                                    {/* Buttons */}
                                    <div className="flex gap-2 text-sm">
                                        <button
                                            onClick={() => {
                                                setSelectedCatId(category.id); // Set the currently editing category ID
                                                handleEditCategory(category);
                                            }}
                                            className={`text-buttonBg bg-editBg w-14 h-7 flex justify-center items-center rounded-md
                                        ${createEdit === "edit" && selectedCatId === category.id ? "!bg-buttonBg text-editBg" : ""}`}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCatId(category.id); // Set the selected category ID
                                                handleOpen('deleteModal');
                                            }}
                                            className="text-deleteBg bg-primary/20 w-14 h-7 flex justify-center items-center rounded-md hover:bg-primary hover:text-white">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                        }
                    </>
                )
            }

            <DeleteModal
                open={open === "deleteModal"} // Distinguish by modalType
                handleOpen={handleOpen}
                title="Are you sure?"
                description="Do you really want to delete this item? This action cannot be undone."
                handleDelete={handleDeleteCategory}
                catId={selectedCatId}
                modalType="categories"
            />

            <ReadMoreModal
                open={open === "readMoreModal"}
                handleOpen={handleOpen}
                category={readMoreDetails}
            />
        </>
    );
};

export default AddedCategories;
