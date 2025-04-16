import { Button, Radio } from '@material-tailwind/react'
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';
import { RiDeleteBin5Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const EditCarousel = ({ initialEditCarouselData, setAdminCarousel }) => {
    const { BASE_URL } = useContext(AppContext)
    const [editCarouselImage, setEditCarouselImage] = useState(null);
    const [editCarouselIsActive, setEditCarouselIsActive] = useState(true);
    const [editCarouselLabel, setEditCarouselLabel] = useState('')
    const [editCarouselTitle, setEditCarouselTitle] = useState('')
    const [editCarouselLink, setEditCarouselLink] = useState('')
    const [editCarouselCategory, setEditCarouselCategory] = useState('')
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()

    const handleCarouselUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditCarouselImage({ image: file }); // Updates the state with the new file
        } else {
            console.error("No file selected.");
        }
    };

    const handleCarouselStatusChange = (status) => {
        setEditCarouselIsActive(status === 'active')
    }

    useEffect(() => {
        if (initialEditCarouselData) {
            setEditCarouselImage(initialEditCarouselData.image ? initialEditCarouselData.image : null);
            setEditCarouselIsActive(initialEditCarouselData.isActive)
            setEditCarouselLabel(initialEditCarouselData.label)
            setEditCarouselTitle(initialEditCarouselData.title)
            setEditCarouselLink(initialEditCarouselData.link)
            setEditCarouselCategory(initialEditCarouselData.category)
        }
    }, [initialEditCarouselData])


    // category fetching
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Authorization is missing");
                    return;
                }

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


    //fetch carousel
    const fetchAdminCarousel = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/slider`);
            setAdminCarousel(response.data || []);
        } catch (error) {
            console.log("error fetching data:", error);
        }
    }
    useEffect(() => {
        fetchAdminCarousel();
    }, [BASE_URL])

    // form submission
    const handleEditCarouselSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
            }

            const editCarouselFormData = new FormData();
            editCarouselFormData.append('folder', 'sliders');
            if (editCarouselImage && editCarouselImage.image) {
                editCarouselFormData.append('image', editCarouselImage.image);
            } else {
                editCarouselFormData.append('image', editCarouselImage)
            }
            editCarouselFormData.append('isActive', editCarouselIsActive);
            editCarouselFormData.append('label', editCarouselLabel);
            editCarouselFormData.append('title', editCarouselTitle);
            editCarouselFormData.append('link', editCarouselLink);
            editCarouselFormData.append('category', editCarouselCategory);

            // Log FormData to verify its content
            console.log('FormData content:');
            for (let pair of editCarouselFormData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-type': 'multipart/form-data'
            }

            const response = await axios.patch(`${BASE_URL}/admin/slider/${initialEditCarouselData._id}`, editCarouselFormData, { headers })
            console.log(response.data);
            toast.success('Carousel is updated!');
            fetchAdminCarousel();
            setEditCarouselImage(null)
            setEditCarouselIsActive(true)
            setEditCarouselLabel('')
            setEditCarouselTitle('')
            setEditCarouselLink('')
            setEditCarouselCategory('')
        } catch (error) {
            console.log(error);
            alert('Carousel is not updated !')
        }
    }
    return (
        <>
            <p onClick={() => navigate(-1)} className='flex items-center cursor-pointer hover:text-primary mb-2'>
                <IoIosArrowBack /> Back</p>
            <div className='bg-white rounded-xl'>
                <div className='p-5'>
                    <h2 className="text-xl font-medium mb-3 lg:mb-0 text-secondary">Edit Carousel</h2>
                </div>
                <hr />
                <div className='p-5'>
                    <form action="" className='space-y-5' onSubmit={handleEditCarouselSubmit}>
                        {/* image upload */}
                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor="" className='font-normal text-base'>Carousel Image</label>
                                <RiDeleteBin5Line onClick={() => setEditCarouselImage(null)} className='text-deleteBg text-xl hover:text-primary cursor-pointer' />
                            </div>
                            <div className='w-full h-48 flex justify-center items-center border-2 rounded-xl mt-2'>
                                {editCarouselImage ? (
                                    <>
                                        <img
                                            src={editCarouselImage.image ? URL.createObjectURL(editCarouselImage.image) : editCarouselImage}
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
                                            onChange={handleCarouselUpload}
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

                        {/* Status */}
                        <div className='flex flex-col gap-1 w-full'>
                            <label className='font-normal text-base'>Status</label>
                            <div className="flex gap-10">
                                <Radio
                                    name="status"
                                    color='green'
                                    label="Enable"
                                    checked={editCarouselIsActive}
                                    onChange={() => handleCarouselStatusChange('active')}
                                />
                                <Radio
                                    name="status"
                                    color='pink'
                                    label="Disable"
                                    checked={!editCarouselIsActive}
                                    onChange={() => handleCarouselStatusChange('inactive')}
                                />
                            </div>
                        </div>

                        {/* label */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Carousel Label</label>
                            <input
                                type="text"
                                name="name"
                                value={editCarouselLabel}
                                onChange={(e) => setEditCarouselLabel(e.target.value)}
                                id=""
                                placeholder='Enter label'
                                className='border-[1px] text-sm
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                        </div>

                        {/* title */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Carousel Title</label>
                            <input
                                type="text"
                                name="name"
                                value={editCarouselTitle}
                                onChange={(e) => setEditCarouselTitle(e.target.value)}
                                id=""
                                placeholder='Enter title'
                                className='border-[1px] text-sm 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                        </div>

                        {/* Link */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Carousel Link</label>
                            <input
                                type="text"
                                value={editCarouselLink}
                                onChange={(e) => setEditCarouselLink(e.target.value)}
                                onBlur={(e) => {
                                    const value = e.target.value.trim();
                                    if (value && !/^https?:\/\//i.test(value)) {
                                        setEditCarouselLink(`https://${value}`);
                                    }
                                }}
                                placeholder='Enter URL starts with https:'
                                className='border-[1px] text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none'
                            />
                        </div>


                        {/* category */}
                        <div className='flex flex-col gap-1'>
                            <label className='font-normal text-base'>Category</label>
                            <select
                                value={editCarouselCategory}
                                onChange={(e) => setEditCarouselCategory(e.target.value)}
                                className="w-full capitalize text-sm text-secondary font-light bg-gray-100/50 border p-2 rounded focus:outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option className='text-gray-500' key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
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

export default EditCarousel
