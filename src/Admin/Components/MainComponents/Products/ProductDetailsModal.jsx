import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Button,
    Badge,
    Card,
    CardBody,
    IconButton,
    Chip
} from '@material-tailwind/react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AppLoader from '../../../../Loader';
import namer from 'color-namer';


export const ProductDetailsModal = ({ open, handleOpen, productId }) => {
    const [productDetails, setProductDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [error, setError] = useState(null);

    const fetchProductDetails = async (id) => {
        if (!id) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://urbaan.in/api/admin/products/product/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProductDetails(data);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Failed to load product details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open && productId) {
            fetchProductDetails(productId);
        }
    }, [open, productId]);

    const handleClose = () => {
        handleOpen();
        setProductDetails(null);
        setCurrentImageIndex(0);
        setError(null);
    };

    const nextImage = () => {
        if (productDetails?.images) {
            setCurrentImageIndex((prev) => 
                prev === productDetails.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (productDetails?.images) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? productDetails.images.length - 1 : prev - 1
            );
        }
    };

    const formatPrice = (price) => {
        return price % 1 >= 0.9 ? Math.ceil(price) : Math.floor(price);
    };

    const getNamedColor = (colorCode) => {
        try {
            const namedColors = namer(colorCode);
            return namedColors.pantone[0].name || "Unknown Color";
        } catch (error) {
            console.error("Invalid color code:", error);
            return "Invalid Color";
        }
    };

    return (
        <Dialog
            open={open}
            handler={handleClose}
            size="xl"
            className="max-h-[90vh] overflow-y-auto"
        >
            <DialogHeader className="flex items-center justify-between border-b pb-4">
                <Typography variant="h5" className="font-custom text-secondary">
                    Product Details
                </Typography>
                <IconButton
                    variant="text"
                    onClick={handleClose}
                    className="!absolute !top-4 !right-4"
                >
                    <XMarkIcon className="h-5 w-5" />
                </IconButton>
            </DialogHeader>

            <DialogBody className="p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <AppLoader />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <Typography color="red" className="text-center">
                            {error}
                        </Typography>
                    </div>
                ) : productDetails ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                                    <img
                                        src={productDetails.images[currentImageIndex]}
                                        alt={productDetails.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {productDetails.images.length > 1 && (
                                    <>
                                        <IconButton
                                            variant="filled"
                                            size="sm"
                                            className="!absolute top-1/2 left-2 transform -translate-y-1/2"
                                            onClick={prevImage}
                                        >
                                            <ChevronLeftIcon className="h-4 w-4" />
                                        </IconButton>
                                        <IconButton
                                            variant="filled"
                                            size="sm"
                                            className="!absolute top-1/2 right-2 transform -translate-y-1/2"
                                            onClick={nextImage}
                                        >
                                            <ChevronRightIcon className="h-4 w-4" />
                                        </IconButton>
                                    </>
                                )}
                            </div>
                            
                            {/* Image Thumbnails */}
                            {productDetails.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {productDetails.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                                                index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                                            }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        >
                                            <img
                                                src={image}
                                                alt={`${productDetails.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-3">
                                <Typography variant="h4" className="font-custom font-semibold text-secondary">
                                    {productDetails.title}
                                </Typography>
                                
                                <div className="flex items-center gap-2">
                                    <Typography className="text-sm text-gray-600 font-custom">
                                        Product Code:
                                    </Typography>
                                    <Badge content={productDetails.product_Code} className="bg-blue-100 text-blue-800" />
                                </div>

                                <Typography className="text-gray-700 font-custom">
                                    {productDetails.description}
                                </Typography>
                            </div>

                            {/* Category Info */}
                            <Card className="bg-gray-50">
                                <CardBody className="p-4">
                                    <Typography variant="h6" className="font-custom mb-2">
                                        Category Information
                                    </Typography>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Typography className="text-sm font-semibold">Category:</Typography>
                                            <Typography className="text-sm">{productDetails.category?.name}</Typography>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Typography className="text-sm font-semibold">Subcategory:</Typography>
                                            <Typography className="text-sm">{productDetails.subcategory?.title}</Typography>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Pricing */}
                            <Card className="bg-green-50">
                                <CardBody className="p-4">
                                    <Typography variant="h6" className="font-custom mb-2">
                                        Pricing
                                    </Typography>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Typography className="text-2xl font-bold text-green-600">
                                                ₹{formatPrice(productDetails.offerPrice)}
                                            </Typography>
                                            <Typography className="text-lg text-gray-500 line-through">
                                                ₹{productDetails.actualPrice}
                                            </Typography>
                                        </div>
                                        <Chip 
                                            value={`${productDetails.discount.toFixed(1)}% OFF`} 
                                            className="bg-red-100 text-red-800"
                                        />
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Stock & Orders */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardBody className="p-4 text-center">
                                        <Typography variant="h4" className="font-bold text-blue-600">
                                            {productDetails.totalStock}
                                        </Typography>
                                        <Typography className="text-sm text-gray-600">
                                            Total Stock
                                        </Typography>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody className="p-4 text-center">
                                        <Typography variant="h4" className="font-bold text-orange-600">
                                            {productDetails.orderCount}
                                        </Typography>
                                        <Typography className="text-sm text-gray-600">
                                            Orders
                                        </Typography>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Features */}
                            <Card>
                                <CardBody className="p-4">
                                    <Typography variant="h6" className="font-custom mb-3">
                                        Features
                                    </Typography>
                                    <div className="grid grid-cols-1 gap-2">
                                        {Object.entries(productDetails.features || {}).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center py-1">
                                                <Typography className="text-sm font-semibold capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                </Typography>
                                                <Typography className="text-sm text-gray-700">
                                                    {value === 'null' || value === null ? 'N/A' : value}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Colors and Sizes */}
                            <Card>
    <CardBody className="p-4">
        <Typography variant="h6" className="font-custom mb-3">
            Available Colors & Sizes
        </Typography>
        {productDetails.colors?.map((colorItem, index) => (
            <div key={index} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                    <Typography className="text-sm font-semibold">
                        Color: {getNamedColor(colorItem.color)}
                    </Typography>
                </div>
                <div className="flex flex-wrap gap-2">
                    {colorItem.sizes?.map((sizeItem, sizeIndex) => (
                        <div key={sizeIndex} className="flex items-center gap-1">
                            <Chip
                                value={`${sizeItem.size}: ${sizeItem.stock} pcs`}
                                className={
                                    sizeItem.stock > 0 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-red-100 text-red-800"
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </CardBody>
</Card>

                            {/* Manufacturer Info */}
                            <Card>
                                <CardBody className="p-4">
                                    <Typography variant="h6" className="font-custom mb-3">
                                        Manufacturer Information
                                    </Typography>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Typography className="text-sm font-semibold">Name:</Typography>
                                            <Typography className="text-sm">{productDetails.manufacturerName}</Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography className="text-sm font-semibold">Brand:</Typography>
                                            <Typography className="text-sm">{productDetails.manufacturerBrand}</Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography className="text-sm font-semibold">Address:</Typography>
                                            <Typography className="text-sm">{productDetails.manufacturerAddress}</Typography>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Product Flags */}
                            <div className="flex flex-wrap gap-2">
                                {productDetails.isLatestProduct && (
                                    <Chip value="Latest Product" className="bg-purple-100 text-purple-800" />
                                )}
                                {productDetails.isOfferProduct && (
                                    <Chip value="Offer Product" className="bg-orange-100 text-orange-800" />
                                )}
                                {productDetails.isFeaturedProduct && (
                                    <Chip value="Featured Product" className="bg-yellow-100 text-yellow-800" />
                                )}
                                {productDetails.freeDelivery && (
                                    <Chip value="Free Delivery" className="bg-green-100 text-green-800" />
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </DialogBody>

            <DialogFooter className="border-t pt-4">
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    className="font-custom"
                >
                    Close
                </Button>
            </DialogFooter>
        </Dialog>
    );
};