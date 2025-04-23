import { Button, Card, CardBody, CardFooter, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react'
import React, { useContext } from 'react';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AppContext } from "../../../../StoreContext/StoreContext"
import { DeleteModal } from '../../DeleteModal/DeleteModal';
import AppLoader from '../../../../Loader';
import { useState } from 'react';

const TABLE_HEAD = ["Product Name", "Description", "Stock", "Price", "Orders", "Publish", "Action"];

const ListView = ({ products, isLoading, selectedProductId, setSelectedProductId, handleDeleteProduct }) => {
    const { open, handleOpen, modalType } = useContext(AppContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Get current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next and prev page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(products.length / itemsPerPage)) {
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
            <div>
                {
                    isLoading ? (
                        <div className="col-span-2 flex justify-center items-center h-[50vh]">
                            <AppLoader />
                        </div>
                    ) : currentProducts.length === 0 ? (
                        <>
                            <p className='col-span-5 flex items-center justify-center h-[50vh]'>No products available</p>
                        </>
                    ) : (
                        <>
                            <Card className="w-full shadow-sm rounded-xl bg-white border-[1px]">
                                <CardBody>
                                    <table className="w-full table-auto text-left border-collapse">
                                        <thead>
                                            <tr className='bg-quaternary'>
                                                {TABLE_HEAD.map((head) => (
                                                    <th
                                                        key={head}
                                                        className="border-b border-gray-300 p-3 text-center"
                                                    >
                                                        <Typography
                                                            variant="small"
                                                            className="font-semibold uppercase text-secondary text-base leading-none font-custom"
                                                        >
                                                            {head}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProducts.map((product, index) => {
                                                const isLast = index === currentProducts.length - 1;
                                                const classes = isLast
                                                    ? "p-4 text-center"
                                                    : "p-4 border-b border-gray-300 text-center";
                                                return (
                                                    <tr key={product._id}>
                                                        <td className={classes}>
                                                            <div className='flex flex-col items-center gap-2'>
                                                                <div className='w-[60px] h-[60px] rounded-md'>
                                                                    <img src={product.images[0]} alt={product.title} className='text-xs w-full h-full object-cover rounded-md' />
                                                                </div>
                                                                <Typography
                                                                    variant="small"
                                                                    className="font-normal font-custom text-sm capitalize"
                                                                >
                                                                     {product.title.length > 20 ? `${product.title.slice(0, 20)}...` : product.title}
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal font-custom text-sm capitalize truncate overflow-hidden whitespace-nowrap w-32"
                                                            >
                                                                {product.description}
                                                            </Typography>


                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal font-custom text-sm"
                                                            >
                                                                {product.totalStock}
                                                            </Typography>
                                                        </td>
                                                        {/* <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal font-custom text-xs flex items-center gap-1"
                                                            >
                                                                <FaStar className='text-ratingBg' />{product.rating}
                                                            </Typography>
                                                        </td> */}
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal font-custom text-sm"
                                                            >
                                                              ₹{product.offerPrice % 1 >= 0.9 ? Math.ceil(product.offerPrice) : Math.floor(product.offerPrice)}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal font-custom text-sm"
                                                            >
                                                                {product.orderCount}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal font-custom text-sm"
                                                            >
                                                                {new Date(product.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Menu>
                                                                <MenuHandler>
                                                                    <IconButton variant="text">
                                                                        <HiOutlineDotsHorizontal className='text-primary text-2xl cursor-pointer' />
                                                                    </IconButton>
                                                                </MenuHandler>
                                                                <MenuList>
                                                                    <Link
                                                                        to={{
                                                                            pathname: '/adminHome/editProduct',
                                                                        }}
                                                                        state={{ product }}
                                                                    >
                                                                        <MenuItem className='font-custom text-buttonBg hover:!text-buttonBg active:border-none'>
                                                                            Edit
                                                                        </MenuItem>
                                                                    </Link>
                                                                    <MenuItem
                                                                        onClick={() => {
                                                                            handleOpen("deleteProductModal");
                                                                            setSelectedProductId(product._id);
                                                                        }}
                                                                        className='font-custom text-primary hover:!text-primary'
                                                                    >
                                                                        Delete
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>

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
                                        {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, index) => (
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
                                        disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                                    >
                                        Next page
                                    </Button>
                                </CardFooter>
                            </Card>
                            {/* </div> */}
                        </>
                    )
                }

            </div>

            <DeleteModal
                open={open === "deleteProductModal"}
                handleOpen={handleOpen}
                handleDelete={handleDeleteProduct}
                productId={selectedProductId}
                title="Are you sure ?"
                modalType="products"
                description="Are you sure you want to remove this product item ?" />
        </>
    )
}

export default ListView
