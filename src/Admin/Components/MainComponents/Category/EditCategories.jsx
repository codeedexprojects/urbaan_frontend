import { Button } from '@material-tailwind/react'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { RiDeleteBin5Line } from "react-icons/ri";
import { AppContext } from '../../../../StoreContext/StoreContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const EditCategories = ({ initialData, setAdminCategory }) => {
    const { BASE_URL } = useContext(AppContext)
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const [categoryDescription, setCategoryDescription] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        if (initialData) {
            setCategoryName(initialData.name);
            setCategoryImage(initialData.imageUrl);
            setCategoryDescription(initialData.description);
        }
    }, [initialData]); // Update form fields when initialData changes

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategoryImage({ image: file });
        }
    }

    // fetch categories
    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/category/get`);
            setAdminCategory(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    useEffect(() => {
        fetchCategory();
    }, []);

    const handleEditCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication token is missing");
                return;
            }

            const editFormData = new FormData();
            editFormData.append('folder', 'Categories');
            editFormData.append('name', categoryName);
            editFormData.append('description', categoryDescription);
            if (categoryImage && categoryImage.image) {
                editFormData.append('image', categoryImage.image);
            } else {
                editFormData.append('image', categoryImage); // Existing image URL
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-type': 'multipart/form-data'
            };

            const response = await axios.patch(`${BASE_URL}/admin/category/update/${initialData.id}`, editFormData, { headers });
            console.log("Category is updated", response.data);
            toast.success("Category is Updated!")
            fetchCategory();
            setCategoryName('')
            setCategoryImage(null)
            setCategoryDescription('')
        } catch (error) {
            console.log("Error:", error.response ? error.response.data : error.message);
            alert("category is not updated")
        }
    }
    return (
        <>
            <p onClick={() => navigate(-1)} className='flex items-center cursor-pointer hover:text-primary mb-2'>
                <IoIosArrowBack /> Back</p>
            <div className='bg-white rounded-xl shadow-md sticky top-5 transition-all duration-300 ease-in-out'>
                <div className='p-5'>
                    <h2 className="text-xl font-medium mb-3 lg:mb-0 text-secondary">Edit Categories</h2>
                </div>
                <hr />
                <div className='p-5'>
                    <form action="" className='space-y-5' onSubmit={handleEditCategorySubmit}>
                        {/* title */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Category Title</label>
                            <input
                                type="text"
                                name="name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                id=""
                                placeholder='Other Accessories'
                                className='border-[1px] 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                        </div>

                        {/* image upload */}
                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="" className='font-normal text-base'>Image</label>
                                <RiDeleteBin5Line onClick={() => setCategoryImage(null)} className='text-deleteBg text-xl hover:text-primary cursor-pointer' />
                            </div>
                            <div className='w-full h-60 flex justify-center items-center border-2 rounded-xl mt-2'>
                                {categoryImage ? (
                                    <>
                                        <img
                                            src={categoryImage.image ? URL.createObjectURL(categoryImage.image) : categoryImage}
                                            alt="Uploaded"
                                            className="w-full h-full rounded-lg"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            id="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <label
                                            htmlFor="file"
                                            className="flex flex-col items-center cursor-pointer"
                                        >
                                            <img src="/imgupload.png" alt="" className='w-16' />
                                            <p className="text-secondary text-xs">Browse files to upload</p>
                                            <p className='text-secondary text-xs'>Max image size 5MB</p>
                                            <p className='text-secondary text-xs'>We can read: JPG, JPEG</p>
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* description */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Product Description</label>
                            <textarea
                                name="description"
                                rows="5"
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                className="w-full border-[1px] bg-gray-100/50 p-2 rounded resize-none overflow-y-scroll focus:outline-none
                                placeholder:text-sm placeholder:font-light placeholder:text-gray-500"
                                placeholder="Enter your description here..."
                                style={{ maxHeight: '150px' }}
                            ></textarea>
                        </div>

                        {/* button */}
                        <div className='flex justify-end'>
                            <Button type='submit' className='bg-buttonBg font-normal tracking-wider font-custom text-sm'>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditCategories
