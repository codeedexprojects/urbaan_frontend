import { Button } from '@material-tailwind/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AppContext } from '../../../../StoreContext/StoreContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const CreateCategories = ({ setAdminCategory }) => {
    const { BASE_URL } = useContext(AppContext)
    const [createCategoryForm, setCreateCategoryForm] = useState({
        name: '',
        image: null,
        description: '',
    });

    const handleCategoryInputChange = (e) => {
        const { name, value } = e.target;
        setCreateCategoryForm({ ...createCategoryForm, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCreateCategoryForm({ ...createCategoryForm, image: file });
        }
    };

    //fetch category
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

    const handleCategoryFormSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check for authentication token
            const token = localStorage.getItem("token");
            console.log(localStorage.getItem("token"));
            if (!token) {
                alert("Authentication token is missing");
                return;
            }

            // Prepare FormData
            const formData = new FormData();
            formData.append('folder', 'Categories');
            formData.append('name', createCategoryForm.name);
            formData.append('description', createCategoryForm.description);
            formData.append('image', createCategoryForm.image);

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const response = await axios.post(`${BASE_URL}/admin/category/create`, formData, { headers });
            console.log('Category created:', response.data);
            toast.success("Category is Created")
            fetchCategory();
            // Reset form
            setCreateCategoryForm({ name: '', image: null, description: '' });
        } catch (error) {
            console.error('Error creating category:', error.response ? error.response.data : error.message);
            alert('Failed to create category. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md sticky top-5 transition-all duration-300 ease-in-out">
            <div className="p-5">
                <h2 className="text-xl font-medium mb-3 lg:mb-0 text-secondary">Create Categories</h2>
            </div>
            <hr />
            <div className="p-5">
                <form className="space-y-5" onSubmit={handleCategoryFormSubmit}>
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="font-normal text-base">Category Title</label>
                        <input
                            value={createCategoryForm.name}
                            onChange={handleCategoryInputChange}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Other Accessories"
                            className="border-[1px] bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <div className='flex items-center justify-between'>
                            <label htmlFor="" className='font-normal text-base'>Image</label>
                            <RiDeleteBin5Line onClick={() => setCreateCategoryForm((prev) => ({ ...prev, image: null }))} className='text-deleteBg text-xl hover:text-primary cursor-pointer' />
                        </div>
                        <div className="w-full h-48 flex justify-center items-center border-2 rounded-xl mt-2">
                            {!createCategoryForm.image ? (
                                <>
                                    <input
                                        type="file"
                                        id="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <label htmlFor="file" className="flex flex-col items-center cursor-pointer">
                                        <img src="/imgupload.png" alt="" className="w-16" />
                                        <p className="text-secondary text-xs">Browse files to upload</p>
                                        <p className='text-secondary text-xs'>Max image size 5MB</p>
                                        <p className='text-secondary text-xs'>We can read: JPG, JPEG</p>
                                    </label>
                                </>
                            ) : (
                                <img
                                    src={URL.createObjectURL(createCategoryForm.image)}
                                    alt="Uploaded"
                                    className="w-full h-full rounded-lg"
                                />
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="font-normal text-base">Product Description</label>
                        <textarea
                            name="description"
                            value={createCategoryForm.description}
                            onChange={handleCategoryInputChange}
                            rows="5"
                            className="w-full border-[1px] bg-gray-100/50 p-2 rounded resize-none overflow-y-scroll focus:outline-none placeholder:text-sm placeholder:font-light placeholder:text-gray-500"
                            placeholder="Enter your description here..."
                            style={{ maxHeight: '150px' }}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-buttonBg font-normal tracking-wider font-custom text-sm">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategories;
