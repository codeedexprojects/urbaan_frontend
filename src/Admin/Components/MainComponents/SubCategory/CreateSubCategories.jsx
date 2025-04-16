import { Button } from '@material-tailwind/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AppContext } from '../../../../StoreContext/StoreContext';
import toast from 'react-hot-toast';

const CreateSubCategories = ({ setSubCategory }) => {
    const { BASE_URL } = useContext(AppContext)
    const [createSubCategoryTitle, setCreateSubCategoryTitle] = useState('');
    const [createSubCategorySelect, setCreateSubCategorySelect] = useState('');
    const [createSubCategoryImage, setCreateSubCategoryImage] = useState(null);
    const [createSubCategoryIsActive, setCreateSubCategoryIsActive] = useState(true)
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Authorization is missing");
                    return;
                }

                // const status = createSubCategoryIsActive ? 'active' : 'expired';

                const response = await axios.get(`${BASE_URL}/admin/category/get`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error.response || error.message);
                alert("Failed to load categories.");
            }
        };

        fetchCategories();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCreateSubCategoryImage(file);
        }
    };

    // fetch sub category
    const fetchSubCategory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/Subcategory/get`);
            setSubCategory(response.data);
            // console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSubCategory();
    }, []);

    const handleSubCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authorization is missing");
                return;
            }

            const subCategoryFormData = new FormData();
            subCategoryFormData.append('folder', 'SubCategories');
            subCategoryFormData.append('title', createSubCategoryTitle);
            subCategoryFormData.append('category', createSubCategorySelect);
            subCategoryFormData.append('image', createSubCategoryImage);
            subCategoryFormData.append('isActive', createSubCategoryIsActive)

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const response = await axios.post(`${BASE_URL}/admin/Subcategory/create`, subCategoryFormData, { headers });
            console.log(response.data);
            toast.success("Subcategory is created");
            fetchSubCategory();
            setCreateSubCategoryTitle('');
            setCreateSubCategorySelect('');
            setCreateSubCategoryImage(null);
            setCreateSubCategoryIsActive(true)
        } catch (error) {
            alert("Sub Category is not created");
            console.error("Error:", error.response || error.message);
            alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
        }
    };

    return (
        <>
            <div className='bg-white rounded-xl'>
                <div className='p-5'>
                    <h2 className="text-xl font-medium mb-3 lg:mb-0 text-secondary">Create Sub Categories</h2>
                </div>
                <hr />
                <div className='p-5'>
                    <form onSubmit={handleSubCategorySubmit} className='space-y-5'>
                        {/* title */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="title" className='font-normal text-base'>Sub Category title</label>
                            <input
                                type="text"
                                name="title"
                                value={createSubCategoryTitle}
                                onChange={(e) => setCreateSubCategoryTitle(e.target.value)}
                                placeholder='Sub category title'
                                className='border-[1px] bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none'
                            />
                        </div>

                        {/* category */}
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='font-normal text-base'>Category</label>
                            <select
                                name="selectField"
                                value={createSubCategorySelect}
                                onChange={(e) => setCreateSubCategorySelect(e.target.value)}
                                className="w-full text-sm text-secondary font-light bg-gray-100/50 border p-2 rounded focus:outline-none focus:cursor-pointer"
                            >
                                <option value="" >Select Category</option>
                                {categories?.length > 0 &&
                                    categories.map((category) => (
                                        <option className='text-gray-500 capitalize' key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* image upload */}
                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="image" className='font-normal text-base'>Image</label>
                                <RiDeleteBin5Line onClick={() => setCreateSubCategoryImage(null)} className='text-deleteBg text-xl hover:text-primary cursor-pointer' />
                            </div>
                            <div className='w-full h-48 flex justify-center items-center border-2 rounded-xl mt-2'>
                                {createSubCategoryImage ? (
                                    <img src={URL.createObjectURL(createSubCategoryImage)} alt="Uploaded" className="w-full h-full rounded-lg" />
                                ) : (
                                    <label htmlFor="file" className="flex flex-col items-center cursor-pointer">
                                        <img src="/imgupload.png" alt="" className='w-16' />
                                        <p className="text-secondary text-xs">Browse files to upload</p>
                                        <p className='text-secondary text-xs'>Max image size 5MB</p>
                                        <p className='text-secondary text-xs'>We can read: JPG, JPEG</p>
                                    </label>
                                )}
                                <input
                                    type="file"
                                    id="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        {/* button */}
                        <div className='flex justify-end'>
                            <Button type='submit' className='bg-buttonBg font-normal tracking-wider font-custom text-sm'>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateSubCategories;
