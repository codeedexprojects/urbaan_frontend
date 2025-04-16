import React from 'react'
import { Button, Card, CardFooter, IconButton } from '@material-tailwind/react';
import { DeleteModal } from '../../DeleteModal/DeleteModal';
import { useContext } from 'react';
import { AppContext } from '../../../../StoreContext/StoreContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import AppLoader from '../../../../Loader';
import toast from 'react-hot-toast';

const AddedCarousel = ({ createEditCarousel, handleEditCarousel, adminCarousel, setAdminCarousel }) => {
    const { open, handleOpen, BASE_URL, modalType } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCarouselId, setSelectedCarouselId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);

    //fetch carousel
    const fetchAdminCarousel = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/slider`);
            setAdminCarousel(response.data || []);
            setIsLoading(false)
            console.log(response.data);
        } catch (error) {
            console.log("error fetching data:", error);
        }
    }
    useEffect(() => {
        fetchAdminCarousel();
    }, [BASE_URL])

    // handle delete

    const handleCarouselDelete = async (carouselId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/admin/slider/${carouselId}`, { headers });
            console.log(response.data);
            handleOpen()
            toast.success("Carousel is deleted")
            fetchAdminCarousel();
        } catch (error) {
            console.log(error, "error deleting carousel");
            alert('Carousel is not deleted')
        }
    }

    // Get current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAdminCarousel = adminCarousel.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next and prev page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(adminCarousel.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <>
            {
                isLoading ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>

                ) : adminCarousel.length === 0 ? (
                    <p className='col-span-2 flex justify-center items-center h-[50vh]'>No carousel found</p>
                ) : (
                    <>
                        {Array.isArray(currentAdminCarousel) && currentAdminCarousel.map((carousel) => (
                            <Card className="p-5 relative" key={carousel._id}>
                                <div className='w-full h-72'>
                                    <img
                                        src={carousel?.image}
                                        alt={carousel.title}
                                        className='w-full h-full object-cover rounded-lg'
                                    />
                                </div>

                                <div className='flex justify-between items-end'>
                                    <ul className="mt-5 space-y-2">
                                        <li className="flex items-center text-secondary">
                                            <span className="font-semibold w-24">Label:</span>
                                            <span className='capitalize'>{carousel?.label || 'null'}</span>
                                        </li>
                                        <li className="flex items-center text-secondary">
                                            <span className="font-semibold w-24">Title:</span>
                                            <span className='capitalize'>{carousel.title}</span>
                                        </li>
                                    </ul>
                                    <div className="flex gap-2 text-sm">
                                        {carousel?.isActive === true ? (
                                            <Button className="bg-green-500 text-white text-sm font-custom capitalize font-normal py-1 px-3 rounded-3xl">
                                                Active
                                            </Button>
                                        ) : (
                                            <Button className="bg-red-500 text-white text-sm font-custom capitalize font-normal py-1 px-3 rounded-3xl">
                                                Inactive
                                            </Button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setSelectedCarouselId(carousel._id)
                                                handleEditCarousel(carousel)
                                            }}
                                            className={`text-buttonBg bg-editBg w-14 h-7 flex justify-center items-center rounded-md hover:bg-buttonBg 
                                    hover:text-editBg ${createEditCarousel === "editcarousel" && selectedCarouselId === carousel._id ? "!bg-buttonBg text-editBg" : ""}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCarouselId(carousel._id);
                                                handleOpen('deleteModal');
                                            }

                                            }
                                            className="text-deleteBg bg-primary/20 w-14 h-7 flex justify-center items-center rounded-md hover:bg-primary hover:text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                            <Button
                                variant="outlined"
                                size="sm"
                                className='font-custom border-gray-300 font-normal capitalize text-sm cursor-pointer hover:bg-black hover:text-white'
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                Prev. page
                            </Button>

                            <div className="flex items-center gap-2">
                                {[...Array(Math.ceil(adminCarousel.length / itemsPerPage))].map((_, index) => (
                                    <IconButton key={index} variant="text" size="sm" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </IconButton>
                                ))}
                            </div>

                            <Button
                                variant="outlined"
                                size="sm"
                                className='font-custom border-gray-300 font-normal capitalize text-sm cursor-pointer hover:bg-black hover:text-white'
                                onClick={handleNextPage}
                                disabled={currentPage === Math.ceil(adminCarousel.length / itemsPerPage)}
                            >
                                Next page
                            </Button>
                        </CardFooter>
                    </>
                )
            }

            <DeleteModal
                open={open === "deleteModal"}
                handleOpen={handleOpen}
                title="Are you sure ?"
                description="Do you really want to delete this Carousel? This action cannot be undone."
                handleDelete={handleCarouselDelete}
                carouselId={selectedCarouselId}
                modalType={"carousel"}
            />
        </>
    )
}

export default AddedCarousel
