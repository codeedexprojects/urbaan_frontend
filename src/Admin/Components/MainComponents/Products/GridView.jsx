import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Menu,
    MenuHandler,
    IconButton,
    MenuList,
    MenuItem
} from '@material-tailwind/react'
import React, { useContext } from 'react'
import { FaPlus, FaStar } from 'react-icons/fa6'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { DeleteModal } from '../../DeleteModal/DeleteModal'
import { AppContext } from "../../../../StoreContext/StoreContext"
import AppLoader from '../../../../Loader'

const GridView = ({ products, isLoading, selectedProductId, setSelectedProductId, handleDeleteProduct }) => {
    const { open, handleOpen, modalType } = useContext(AppContext)

    return (
        <>
            <div>
                {
                    isLoading ? (
                        <div className="col-span-2 flex justify-center items-center h-[50vh]">
                            <AppLoader />
                        </div>
                    ) : products.length === 0 ? (
                        <>
                            <p className='col-span-5 flex items-center justify-center h-[50vh]'>No products available</p>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                                {
                                    products.map((product) => (
                                        <Card className="w-full cursor-default group" key={product._id}>
                                            <CardHeader shadow={false} floated={false} className="h-64 overflow-hidden relative">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover rounded-xl transition transform scale-100 duration-500 ease-in-out
                                            group-hover:scale-110"
                                                />
                                                <div className='absolute top-2 right-2'>
                                                    <Menu>
                                                        <MenuHandler>
                                                            <IconButton variant="text" className='bg-white h-4 rounded-md hover:bg-white focus:bg-white'>
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
                                                                <MenuItem className='font-custom text-buttonBg hover:!text-buttonBg'>Edit</MenuItem>
                                                            </Link>
                                                            <MenuItem
                                                                onClick={() => {
                                                                    handleOpen("deleteProductModal");
                                                                    setSelectedProductId(product._id);
                                                                }}
                                                                className='font-custom text-primary hover:!text-primary'
                                                            >
                                                                Delete</MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </div>
                                            </CardHeader>
                                            <CardBody className='p-4'>
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div>
                                                        <Typography color="blue-gray" className="font-semibold font-custom text-secondary capitalize">
                                                        {product.title.length > 20 ? `${product.title.slice(0, 20)}...` : product.title}
                                                        </Typography>
                                                        <Typography color="blue-gray" className="font-semibold font-custom text-primary">
                                                            ₹{product.offerPrice}
                                                        </Typography>
                                                    </div>
                                                    <Typography color="blue-gray" className="flex items-center justify-center gap-1 font-normal font-custom text-secondary">
                                                        {product.rating}<FaStar className='text-ratingBg' />
                                                    </Typography>
                                                </div>
                                                <div className='space-y-1'>
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-custom text-base text-secondary font-semibold"
                                                    >
                                                        {product.product}
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-custom text-sm capitalize font-normal truncate overflow-hidden 
                                                        whitespace-nowrap w-60"
                                                    >
                                                        {product.description.length > 20 ? `${product.description.slice(0, 20)}...` : product.description}
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-custom text-sm capitalize font-normal text-buttonBg"
                                                    >
                                                        Published on {new Date(product.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </Typography>
                                                </div>
                                                <div className='mt-5'>
                                                    <ul className='flex items-center gap-10'>
                                                        <li className='flex flex-col items-center'>
                                                            <span className='text-lg text-secondary font-semibold'>{product.totalStock}</span>
                                                            <span className='font-normal capitalize text-sm'>stocks</span>
                                                        </li>
                                                        <li className='flex flex-col items-center'>
                                                            <span className='text-lg text-secondary font-semibold'>{product.orderCount}</span>
                                                            <span className='font-normal capitalize text-sm'>orders</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))
                                }
                            </div>
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

export default GridView
