import React, { useContext, useState, useEffect } from 'react';
import { Card, Typography, CardFooter, Button, IconButton, CardBody } from "@material-tailwind/react";
import { AppContext } from "../../../../StoreContext/StoreContext";
import { DeleteModal } from '../../DeleteModal/DeleteModal';
import axios from 'axios';
import AppLoader from '../../../../Loader';
import toast from 'react-hot-toast';

const TABLE_HEAD = ["Sub Category", "Category", "Status", "Action"];

const AddedSubCategories = ({ createEditSub, handleEditCategory, subCategory, setSubCategory }) => {
    const { open, handleOpen, modalType, BASE_URL } = useContext(AppContext);
    const [selectedCatId, setSelectedCatId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // fetch sub category
    const fetchSubCategory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/Subcategory/get`);
            setSubCategory(response.data);
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchSubCategory();
    }, []);

    const handleSubCategoryDelete = async (subCategoryId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.delete(`${BASE_URL}/admin/Subcategory/delete/${subCategoryId}`, { headers });
            console.log(response.data);
            handleOpen();
            toast.success('Subcategory is deleted');
            fetchSubCategory();
        } catch (error) {
            console.log(error);
            alert("Sub category is not deleted");
        }
    };

    // Get current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSubCategories = subCategory.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next and prev page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(subCategory.length / itemsPerPage)) {
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
                isLoading || subCategory.length === 0 ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : (
                    <Card className="w-full shadow-sm bg-white border-[1px] rounded-xl">
                        <CardBody>
                            <table className="w-full table-auto text-left border-collapse">
                                <thead>
                                    <tr className='bg-quaternary'>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-gray-300 p-4 text-center">
                                                <Typography variant="small" className="font-semibold uppercase font-custom text-base leading-none text-secondary">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='bg-transparent'>
                                    {currentSubCategories.map((subCat, index) => {
                                        const isLast = index === currentSubCategories.length - 1;
                                        const classes = isLast ? "p-4 text-center" : "p-4 border-b border-gray-300 text-center";
                                        return (
                                            <tr key={subCat?._id} className="bg-transparent">
                                                <td className={classes}>
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className='w-[60px] h-[60px] rounded-md'>
                                                            <img src={subCat.image} alt={subCat.title} className='w-full h-full object-cover rounded-md' />
                                                        </div>
                                                        <Typography variant="small" className="font-normal capitalize font-custom text-sm">
                                                            {subCat.title}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" className="font-normal capitalize font-custom text-sm">
                                                        {subCat.category?.name}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    {subCat?.isActive === true ? (
                                                        <Button className="bg-green-500 text-white text-sm font-custom capitalize font-normal py-1 px-3 rounded-3xl">
                                                            Active
                                                        </Button>
                                                    ) : (
                                                        <Button className="bg-red-500 text-white text-sm font-custom capitalize font-normal py-1 px-3 rounded-3xl">
                                                            Inactive
                                                        </Button>
                                                    )}
                                                </td>

                                                <td className={classes}>
                                                    <div className="flex justify-center gap-2 text-sm">
                                                        <button onClick={() => { handleEditCategory(subCat); setSelectedCatId(subCat._id); }} className={`text-buttonBg bg-editBg w-14 h-7 flex justify-center items-center rounded-md hover:bg-buttonBg hover:text-editBg ${createEditSub === "editSub" && selectedCatId === subCat._id ? "!bg-buttonBg text-editBg" : ""}`}>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => { handleOpen("deleteModal"); setSelectedCatId(subCat._id); }} className="text-deleteBg bg-primary/20 w-14 h-7 flex justify-center items-center rounded-md hover:bg-primary hover:text-white">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardBody>
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
                                {[...Array(Math.ceil(subCategory.length / itemsPerPage))].map((_, index) => (
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
                                disabled={currentPage === Math.ceil(subCategory.length / itemsPerPage)}
                            >
                                Next page
                            </Button>
                        </CardFooter>
                    </Card>
                )
            }

            <DeleteModal
                open={open === "deleteModal"} // Distinguish by modalType
                handleOpen={handleOpen}
                title="Are you sure?"
                description="Do you really want to delete this item? This action cannot be undone."
                handleDelete={handleSubCategoryDelete}
                SubCatId={selectedCatId}
                modalType="subcategories"
            />
        </>
    );
};

export default AddedSubCategories;
