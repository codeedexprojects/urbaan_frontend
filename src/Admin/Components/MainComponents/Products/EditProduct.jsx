import { Button, Checkbox, Typography } from '@material-tailwind/react';
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6';
import { IoIosArrowBack, IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useContext } from 'react';
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiMiniXMark } from "react-icons/hi2";


const EditProduct = () => {
    const { BASE_URL } = useContext(AppContext)
    const navigate = useNavigate()
    const location = useLocation();
    const initialProducts = location.state?.product || {};
    const [editAttributeFields, setEditAttributeFields] = useState([{ color: "", sizes: [{ size: "", stock: "" }] }]);
    const [editProdTitle, setEditProdTitle] = useState('')
    const [editProdCategory, setEditProdCategory] = useState('')
    const [editProdSubCategory, setEditProdSubCategory] = useState('')
    const [editProdCode, setEditProdCode] = useState('')
    const [editProdActualPrice, setEditProdActualPrice] = useState('')
    const [editProdDiscount, setEditProdDiscount] = useState('')
    const [editProdOfferPrice, setEditProdOfferPrice] = useState('')
    const [editProdCheckboxes, setEditProdCheckboxes] = useState({
        latest: false,
        offer: false,
        featured: false,
        freeDelivery: false
    });
    const [editSpecifications, setEditSpecifications] = useState({
        netWeight: '',
        fit: '',
        sleevesType: '',
        Length: '',
        occasion: '',
        innerLining: '',
        material: '',
        pocket: '',
        neck:''
    });
    const [editProdDescription, setEditProdDescription] = useState('')
    const [editProdImage, setEditProdImage] = useState([])
    const [newImage, setNewImage] = useState([])
    const [editProdManuName, setEditProdManuName] = useState('')
    const [editProdManuBrand, setEditProdManuBrand] = useState('')
    const [editProdManuAddress, setEditProdManuAddress] = useState('')
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [lastChanged, setLastChanged] = useState('');
    const [sizeChartOptions, setSizeChartOptions] = useState([]);
    const [selectedSizeChartRefs, setSelectedSizeChartRefs] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [specificationOptions, setSpecificationOptions] = useState({
        netWeight: [],
        fit: [],
        sleevesType: [],
        length: [],
        occasion: [],
        innerLining: [],
        material: [],
        pocket: [],
        neck:[]
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecifications = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/specification/all`);
                const specs = response.data.specifications;

                // Organize specifications by their type
                const organizedSpecs = {
                    netWeight: [],
                    fit: [],
                    sleevesType: [],
                    length: [],
                    occasion: [],
                    innerLining: [],
                    material: [],
                    pocket: [],
                    neck:[]
                };

                specs.forEach(spec => {
                    if (organizedSpecs.hasOwnProperty(spec.type)) {
                        organizedSpecs[spec.type].push({
                            id: spec._id,
                            name: spec.name
                        });
                    }
                });

                setSpecificationOptions(organizedSpecs);
            } catch (error) {
                console.error('Error fetching specifications:', error);
                toast.error('Failed to load specifications');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecifications();
    }, []);
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/material/view`);

                // Ensure the response contains the 'materials' key and is an array
                if (Array.isArray(response.data.materials)) {
                    setMaterials(response.data.materials); // Set the materials data
                } else {
                    console.error("Unexpected response format for materials.");
                }
            } catch (error) {
                console.error("Error fetching materials:", error);
            } finally {
                setIsLoading(false); // Stop loading when API call finishes
            }
        };
        fetchMaterials();
    }, [BASE_URL]);

    // Handle when a material is selected
    const handleMaterialSelect = (e) => {
        handleSpecificationChange(e, "material"); // Update parent component state via the handler
    };
    // Fetch size charts
    useEffect(() => {
        const fetchSizeCharts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/sizechart/get`);
                setSizeChartOptions(response.data);
            } catch (error) {
                console.log(error, ": Error fetching size charts");
            }
        };
        fetchSizeCharts();
    }, []);
    useEffect(() => {
        const actual = parseFloat(editProdActualPrice);
        const discount = parseFloat(editProdDiscount);
        const offer = parseFloat(editProdOfferPrice);

        if (lastChanged === 'discount' && actual && discount >= 0) {
            const newOffer = actual - (actual * (discount / 100));
            setEditProdOfferPrice(newOffer.toFixed(2));
        }

        if (lastChanged === 'offerPrice' && actual && offer >= 0) {
            const newDiscount = ((actual - offer) / actual) * 100;
            setEditProdDiscount(newDiscount.toFixed(2));
        }

        // Optional: if actualPrice is changed and either discount or offer exists, you can update accordingly
        if (lastChanged === 'actualPrice') {
            if (discount >= 0) {
                const newOffer = actual - (actual * (discount / 100));
                setEditProdOfferPrice(newOffer.toFixed(2));
            } else if (offer >= 0) {
                const newDiscount = ((actual - offer) / actual) * 100;
                setEditProdDiscount(newDiscount.toFixed(2));
            }
        }
    }, [editProdActualPrice, editProdDiscount, editProdOfferPrice, lastChanged]);


    useEffect(() => {
        if (initialProducts) {
            setEditProdTitle(initialProducts.title);
            setEditProdCategory(initialProducts.category._id);
            setEditProdSubCategory(initialProducts.subcategory?._id);
            setEditProdCode(initialProducts.product_Code);
            setEditProdActualPrice(initialProducts.actualPrice);
            setEditProdDiscount(initialProducts.discount);
            setEditProdOfferPrice(initialProducts.offerPrice);
            setEditProdCheckboxes({
                latest: initialProducts.isLatestProduct || false,
                offer: initialProducts.isOfferProduct || false,
                featured: initialProducts.isFeaturedProduct || false,
                freeDelivery: initialProducts.freeDelivery || false,
            });

            // Set specifications from features
            setEditSpecifications({
                netWeight: initialProducts.features.netWeight || '',
                fit: initialProducts.features.fit || '',
                sleevesType: initialProducts.features.sleevesType || '',
                Length: initialProducts.features.Length || '',
                occasion: initialProducts.features.occasion || '',
                innerLining: initialProducts.features.innerLining || '',
                material: initialProducts.features.material || '',
                pocket: initialProducts.features.pocket || '',
                neck:initialProducts.features.neck || '',
            });

            const formattedAttributes = initialProducts.colors.map((color) => ({
                color: color.color,
                sizes: color.sizes.map((size) => ({
                    size: size.size,
                    stock: size.stock,
                })),
            }));
            setEditAttributeFields(formattedAttributes);
            setEditProdDescription(initialProducts.description);
            setEditProdImage(initialProducts.images || []);
            setEditProdManuName(initialProducts.manufacturerName);
            setEditProdManuBrand(initialProducts.manufacturerBrand);
            setEditProdManuAddress(initialProducts.manufacturerAddress);
            setSelectedSizeChartRefs(initialProducts.sizeChartRefs?.map(id => id.toString()) || []);
        }
    }, [initialProducts]);




    // handle image
    const handleProductImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewImage((prevImages) => [...prevImages, ...files]);
    };

    // manage text color based ob bg-color
    const getContrastYIQ = (color) => {
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) return 'text-black'; // Default to black for invalid or empty colors
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? 'text-black' : 'text-white';
    };

    // handle input change of specifications
    const handleSpecificationChange = (e, field) => {
        setEditSpecifications({
            ...editSpecifications,
            [field]: e.target.value
        });
    };



    // Handler for checkbox change
    const handleCheckboxChange = (e, checkboxName) => {
        setEditProdCheckboxes({ ...editProdCheckboxes, [checkboxName]: e.target.checked });
    };



    // // price computation
    // useEffect(() => {
    //     if (editProdActualPrice && editProdDiscount) {
    //         // Convert discount percentage to decimal and calculate offer price
    //         const discountValue = parseFloat(editProdDiscount) / 100;
    //         const calculatedOfferPrice = editProdActualPrice - (editProdActualPrice * discountValue);
    //         setEditProdOfferPrice(calculatedOfferPrice.toFixed(2)); // Limit to 2 decimal places
    //     }
    // }, [editProdActualPrice, editProdDiscount]);


    // subcategory display based on category id
    useEffect(() => {
        if (editProdCategory) {
            const filtered = subCategories.filter(
                (subcategory) => subcategory.category._id === editProdCategory
            );
            setFilteredSubCategories(filtered);
        } else {
            setFilteredSubCategories([]);
        }
    }, [editProdCategory, subCategories]);



    // fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/category/get`);
                setCategories(response.data);
            } catch (error) {
                console.log(error, ": Error fetching data");
            }
        }
        fetchCategories();
    }, [])

    // fetch Sub categories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/Subcategory/get`);
                setSubCategories(response.data)
            } catch (error) {
                console.log(error, ": error fetching sub categories");
            }
        }
        fetchSubCategories();
    }, [])

    // form submission
    const handleEditProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
                return;
            }

            // Validate required inputs
            if (!editProdTitle.trim() || !editProdCategory.trim()) {
                alert("Product title and category are required");
                return;
            }

            // Initialize FormData
            const editproductFormData = new FormData();
            editproductFormData.append('folder', 'Products');
            editproductFormData.append('title', editProdTitle);
            editproductFormData.append('category', editProdCategory);
            editproductFormData.append('subcategory', editProdSubCategory);
            editproductFormData.append('product_Code', editProdCode);
            editproductFormData.append('actualPrice', editProdActualPrice);
            editproductFormData.append('discount', editProdDiscount);
            // Calculate offer price
            const calculatedOfferPrice = editProdActualPrice - (editProdActualPrice * (editProdDiscount / 100));
            editproductFormData.append('offerPrice', calculatedOfferPrice.toFixed(2));
            editproductFormData.append('isLatestProduct', editProdCheckboxes.latest);
            editproductFormData.append('isOfferProduct', editProdCheckboxes.offer);
            editproductFormData.append('isFeaturedProduct', editProdCheckboxes.featured);
            editproductFormData.append('freeDelivery', editProdCheckboxes.freeDelivery);
            editproductFormData.append('description', editProdDescription);

            // Handle colors and sizes
            const colors = editAttributeFields.reduce((acc, field) => {
                if (field.color.trim()) {
                    const validSizes = field.sizes
                        .filter(size =>
                            size.size.trim() &&
                            size.stock !== '' &&
                            !isNaN(Number(size.stock))
                        )
                        .map(size => ({
                            size: size.size.trim(),
                            stock: Number(size.stock),
                        }));

                    if (validSizes.length > 0) {
                        acc.push({
                            color: field.color.trim(),
                            sizes: validSizes,
                        });
                    }
                }
                return acc;
            }, []);

            // Append colors as a JSON string
            if (colors.length > 0) {
                editproductFormData.append('colors', JSON.stringify(colors)); // Appends as a plain JSON string
            }
            // Append specifications to features
            Object.entries(editSpecifications).forEach(([key, value]) => {
                editproductFormData.append(`features[${key}]`, value || null);
            });
            // Append images
            newImage.forEach((image) => editproductFormData.append("images", image));
            // Append manufacturer details
            editproductFormData.append('manufacturerName', editProdManuName);
            editproductFormData.append('manufacturerBrand', editProdManuBrand);
            editproductFormData.append('manufacturerAddress', editProdManuAddress);
            editproductFormData.append('sizeChartRefs', JSON.stringify(selectedSizeChartRefs));

            // Debugging FormData
            for (const [key, value] of editproductFormData.entries()) {
                console.log(key, value);
            }

            // API Request
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const response = await axios.patch(
                `${BASE_URL}/admin/products/update-product/${initialProducts._id}`,
                editproductFormData,
                { headers }
            );
            console.log(response.data);

            toast.success("Product is updated");
            navigate(-1)
            // Reset form fields
            setEditProdTitle('');
            setEditProdCategory('');
            setEditProdSubCategory('');
            setEditProdCode('');
            setEditProdActualPrice('');
            setEditProdDiscount('');
            setEditProdOfferPrice('');
            setEditProdCheckboxes({ latest: false, offer: false, featured: false, freeDelivery: false });
            setEditSpecifications({ netWeight: "", fit: "", sleevesType: "", Length: "", occasion: "", innerLining: "", material: "", pocket: "",neck:"" })
            setEditAttributeFields([{ color: "", sizes: [{ size: "", stock: "" }] }]);
            setEditProdDescription('');
            setEditProdImage([]);
            setNewImage([])
            setEditProdManuName('');
            setEditProdManuBrand('');
            setEditProdManuAddress('');
            setSelectedSizeChartRefs([]);
        } catch (error) {
            console.error("Error in form submission:", error);
            console.error(error.response?.data || "No additional error details");
            alert("Product is not updated");
        }
    };



    const handleAddColorField = () => {
        setEditAttributeFields([...editAttributeFields, { color: "", sizes: [{ size: "", stock: "" }] }]);
    };

    const handleDeleteColorField = (index) => {
        if (editAttributeFields.length > 1) {
            setEditAttributeFields(editAttributeFields.filter((_, i) => i !== index));
        }
        else {
            toast.error("Atleast one attribute field is required");
        }
    };

    const handleAddSizeField = (colorIndex) => {
        const updatedFields = [...editAttributeFields];
        updatedFields[colorIndex].sizes.push({ size: "", stock: "" });
        setEditAttributeFields(updatedFields);
    };

    const handleDeleteSizeField = (colorIndex, sizeIndex) => {
        const updatedFields = [...editAttributeFields];

        // Ensure 'sizes' exists
        if (updatedFields[colorIndex]?.sizes && updatedFields[colorIndex].sizes.length > 1) {
            updatedFields[colorIndex].sizes = updatedFields[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
        } else {
            toast.error("Sizes and Stock is required");
        }

        setEditAttributeFields(updatedFields);
        console.log(updatedFields);
    };


    const handleSizeFieldChange = (colorIndex, sizeIndex, key, value) => {
        const updatedFields = [...editAttributeFields];

        // Check if 'sizes' exists and is an array
        if (updatedFields[colorIndex]?.sizes) {
            updatedFields[colorIndex].sizes[sizeIndex][key] = value;
        }
        setEditAttributeFields(updatedFields);
    };

    // Handle input changes
    const handleAttributeInputChange = (index, key, value) => {
        const updatedFields = [...editAttributeFields];
        updatedFields[index][key] = value;
        setEditAttributeFields(updatedFields);
    };

    // handleDeleteImg
    const handleDeleteImg = async (image) => {
        if (editProdImage.length === 1) {
            toast.error("At least one image must be present. Cannot delete the last image.");
            return;
        }
        try {
            setEditProdImage((prevImages) => prevImages.filter((img) => img !== image)); // Optimistic update

            const token = localStorage.getItem("token");
            const imagePayload = { imageName: image };

            const response = await axios.post(
                `${BASE_URL}/admin/products/delete-product-image/${initialProducts?._id}`,
                imagePayload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Server Response:", response.data);

            // Handle success based on the actual response
            if (response.data.message === "Image deleted successfully") {
                toast.success("Product image is deleted");
                // Update the images if the backend returns them
                // setEditProdImage(initialProducts.images || []);
            } else {
                console.error("Failed to delete the image on the server.");
                toast.error("Failed to delete the image on the server.");
            }
        } catch (error) {
            console.error("Error during deletion:", error);
            toast.error("An error occurred while deleting the image.");
        }
    };


    return (
        <>
            <p onClick={() => navigate(-1)} className='flex items-center cursor-pointer hover:text-primary'>
                <IoIosArrowBack /> Back</p>
            <h1 className='text-2xl lg:text-3xl font-semibold'>Edit Product</h1>
            <form action='' className="grid lg:grid-cols-2 gap-10 mt-5" onSubmit={handleEditProductSubmit}>
                <div className='bg-white rounded-xl shadow-md h-fit'>
                    <div className='p-5'>
                        <h2 className="text-xl font-medium mb-3 lg:mb-0 text-secondary">Product Information</h2>
                    </div>
                    <hr />
                    <div className='p-5 space-y-6'>
                        {/* title */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Product title</label>
                            <input
                                type="text"
                                name="name"
                                value={editProdTitle}
                                onChange={(e) => setEditProdTitle(e.target.value)}
                                id=""
                                placeholder='Enter Product title'
                                className='border-[1px] capitalize
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                        </div>

                        {/* category */}
                        <div className='flex justify-between items-center gap-2'>
                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-normal text-base'>Product Category</label>
                                <select
                                    name="selectField"
                                    value={editProdCategory}
                                    onChange={(e) => setEditProdCategory(e.target.value)}
                                    className="w-full capitalize text-sm text-secondary font-light bg-gray-100/50 border p-2 rounded focus:outline-none focus:cursor-pointer"
                                >
                                    <option value="Option 1" >Select Category</option>
                                    {
                                        categories.map((category) => (
                                            <option className='text-gray-500 capitalize' key={category.id} value={category.id}>{category.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* subcategory */}
                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-normal text-base'>Sub Category</label>
                                <select
                                    name="selectField"
                                    value={editProdSubCategory}
                                    onChange={(e) => setEditProdSubCategory(e.target.value)}
                                    className="w-full capitalize text-sm text-secondary font-light bg-gray-100/50 border p-2 rounded focus:outline-none focus:cursor-pointer"
                                >
                                    <option value="Option 1">Select SubCategory</option>
                                    {
                                        filteredSubCategories.map((subcategory) => (
                                            <option className='text-gray-500 capitalize' key={subcategory._id} value={subcategory._id}>{subcategory.title}</option>
                                        ))
                                    }

                                </select>
                            </div>
                            {/* product code */}
                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor="" className='font-normal text-base'>Product code</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editProdCode}
                                    onChange={(e) => setEditProdCode(e.target.value)}
                                    id=""
                                    placeholder='Enter Product title'
                                    className='border-[1px] uppercase w-full
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none placeholder:capitalize'/>
                            </div>
                        </div>

                        {/* price , disvcount, offer price */}
                        <div className='flex justify-between items-center gap-2'>
                            <div className='flex flex-col gap-1 w-1/3'>
                                <label className='font-normal text-base'>Actual Price</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editProdActualPrice}
                                    onChange={(e) => {
                                        setEditProdActualPrice(e.target.value);
                                        setLastChanged('actualPrice');
                                    }}
                                    id=""
                                    placeholder='Actual Price'
                                    className='border-[1px] w-full
                                  bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                               focus:outline-none'/>
                            </div>
                            
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="" className='font-normal text-base'>Offer Price</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editProdOfferPrice}
                                    onChange={(e) => {
                                        setEditProdOfferPrice(e.target.value);
                                        setLastChanged('offerPrice');
                                    }}
                                    id=""
                                    placeholder='Offer price'
                                    className='border-[1px] w-full
                                     bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                   focus:outline-none'/>
                            </div>
                            <div className='flex flex-col gap-1 w-1/3'>
                                <label className='font-normal text-base'>Discount (%)</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editProdDiscount}
                                    onChange={(e) => {
                                        setEditProdDiscount(e.target.value);
                                        setLastChanged('discount');
                                    }}
                                    id=""
                                    placeholder='Discount'
                                    className='border-[1px] w-full 
                                        bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                       focus:outline-none'/>
                            </div>
                        </div>
                        {/* checkboxes eg:latest, featured, offer */}
                        <div className='flex items-center justify-between'>
                            <Checkbox label={
                                <Typography className='font-custom text-secondary text-base font-normal'>Latest Products</Typography>}
                                color='pink'
                                checked={editProdCheckboxes.latest}
                                onChange={(e) => handleCheckboxChange(e, 'latest')}
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                            <Checkbox label={
                                <Typography className='font-custom text-secondary text-base font-normal'>Offer Products</Typography>}
                                color='pink'
                                checked={editProdCheckboxes.offer}
                                onChange={(e) => handleCheckboxChange(e, 'offer')}
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                            <Checkbox label={
                                <Typography className='font-custom text-secondary text-base font-normal'>Featured Products</Typography>}
                                color='pink'
                                checked={editProdCheckboxes.featured}
                                onChange={(e) => handleCheckboxChange(e, 'featured')}
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                            <Checkbox label={
                                <Typography className='font-custom text-secondary text-base font-normal'>Free Delivery</Typography>}
                                color='pink'
                                checked={editProdCheckboxes.freeDelivery}
                                onChange={(e) => handleCheckboxChange(e, 'freeDelivery')}
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                        </div>

                        {/* specifications */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Specifications</label>

                            {/* Net Weight */}
                            <div className='flex items-center gap-1 mt-4'>
                                <label htmlFor="netWeight" className='font-normal text-sm w-32'>NetWeight</label>
                                <p>:</p>
                                <select
                                    id="netWeight"
                                    name="netWeight"
                                    value={editSpecifications.netWeight}
                                    onChange={(e) => handleSpecificationChange(e, 'netWeight')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Net Weight</option>
                                    {specificationOptions.netWeight.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Fit */}
                            <div className='flex items-center gap-1'>
                                <label htmlFor="fit" className='font-normal text-sm w-32'>Fit</label>
                                <p>:</p>
                                <select
                                    id="fit"
                                    name="fit"
                                    value={editSpecifications.fit}
                                    onChange={(e) => handleSpecificationChange(e, 'fit')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Fit</option>
                                    {specificationOptions.fit.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sleeves Type */}
                            <div className='flex items-center gap-1'>
                                <label htmlFor="sleevesType" className='font-normal text-sm w-32'>Sleeves Type</label>
                                <p>:</p>
                                <select
                                    id="sleevesType"
                                    name="sleevesType"
                                    value={editSpecifications.sleevesType}
                                    onChange={(e) => handleSpecificationChange(e, 'sleevesType')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Sleeves Type</option>
                                    {specificationOptions.sleevesType.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Length */}
                            <div className='flex items-center gap-1'>
                                <label htmlFor="length" className='font-normal text-sm w-32'>Length</label>
                                <p>:</p>
                                <select
                                    id="length"
                                    name="length"
                                    value={editSpecifications.Length} // Note: keeping original casing for consistency
                                    onChange={(e) => handleSpecificationChange(e, 'Length')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Length</option>
                                    {specificationOptions.length.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Occasion */}
                            <div className='flex items-center gap-1'>
                                <label htmlFor="occasion" className='font-normal text-sm w-32'>Occasion</label>
                                <p>:</p>
                                <select
                                    id="occasion"
                                    name="occasion"
                                    value={editSpecifications.occasion}
                                    onChange={(e) => handleSpecificationChange(e, 'occasion')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Occasion</option>
                                    {specificationOptions.occasion.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Inner Lining */}
                            <div className='flex items-center gap-1'>
                                <label htmlFor="innerLining" className='font-normal text-sm w-32'>Inner Lining</label>
                                <p>:</p>
                                <select
                                    id="innerLining"
                                    name="innerLining"
                                    value={editSpecifications.innerLining}
                                    onChange={(e) => handleSpecificationChange(e, 'innerLining')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Inner Lining</option>
                                    {specificationOptions.innerLining.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Material */}
                            <div className="flex items-center gap-1">
                                <label htmlFor="material" className="font-normal text-sm w-32">Material</label>
                                <p>:</p>
                                <select
                                    id="material"
                                    name="material"
                                    value={editSpecifications.material}
                                    onChange={(e) => handleSpecificationChange(e, 'material')}
                                    className="border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none"
                                    disabled={loading}
                                >
                                    <option value="">Select Material</option>
                                    {specificationOptions.material.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pocket */}
                            <div className='flex items-center gap-1'>
                                <label htmlFor="pocket" className='font-normal text-sm w-32'>Pocket</label>
                                <p>:</p>
                                <select
                                    id="pocket"
                                    name="pocket"
                                    value={editSpecifications.pocket}
                                    onChange={(e) => handleSpecificationChange(e, 'pocket')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Pocket</option>
                                    {specificationOptions.pocket.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex items-center gap-1'>
                                <label htmlFor="neck" className='font-normal text-sm w-32'>Neck</label>
                                <p>:</p>
                                <select
                                    id="neck"
                                    name="neck"
                                    value={editSpecifications.neck}
                                    onChange={(e) => handleSpecificationChange(e, 'neck')}
                                    className='border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none'
                                    disabled={loading}
                                >
                                    <option value="">Select Neck</option>
                                    {specificationOptions.neck.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            {loading && (
                                <div className="text-center text-gray-500 py-2">
                                    Loading specifications...
                                </div>
                            )}
                        </div>


                        {/* description */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Product Description</label>
                            <textarea
                                name="description"
                                value={editProdDescription}
                                onChange={(e) => setEditProdDescription(e.target.value)}
                                rows="10"
                                className="w-full border-[1px] bg-gray-100/50 p-2 rounded resize-none overflow-y-scroll hide-scrollbar focus:outline-none
                                        placeholder:text-sm placeholder:font-light placeholder:text-gray-500"
                                placeholder="Enter your description here..."
                                style={{ maxHeight: '100px' }}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* second col */}

                {/* photo upload */}
                <div className='bg-white rounded-xl shadow-md p-5 space-y-6 h-fit'>
                    <div className='flex items-center gap-2'>
                        {editProdImage.length > 0 ? (
                            editProdImage.map((image, index) => (
                                <div key={index} className="w-32 h-32 relative">
                                    <img
                                        src={image}
                                        alt=''
                                        className="w-full h-full rounded-md"
                                    />
                                    <MdDelete
                                        onClick={() => handleDeleteImg(image)}
                                        className="absolute top-0 right-0 text-deleteBg text-lg cursor-pointer hover:text-primary"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No images available</p> // Meaningful fallback
                        )}
                    </div>
                    <div className='flex gap-5'>
                        <div className="flex flex-col justify-center items-center w-72 h-56 border-4 border-dashed border-primary rounded-xl">
                            <input
                                type="file"
                                id="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleProductImageUpload}
                            />
                            <label htmlFor="file" className="flex flex-col items-center cursor-pointer">
                                <IoMdCloudUpload className="text-primary text-5xl" />
                                <p className="text-secondary text-xs">Browse files to upload</p>
                                <p className='text-secondary text-xs'>Max image size 5MB</p>
                                <p className='text-secondary text-xs'>We can read: JPG, JPEG</p>
                            </label>
                        </div>

                        <ul className="flex-1 space-y-2 h-56 overflow-y-auto hide-scrollbar">
                            {newImage.length === 0 ? (
                                <p className="text-xs text-gray-600 font-normal flex justify-center items-center h-full">
                                    Your selected images display here
                                </p>
                            ) : (
                                newImage.map((image, index) => {
                                    if (image instanceof File) {
                                        return (
                                            <li
                                                key={index}
                                                className="flex items-start justify-between bg-primary/15 rounded-md p-2"
                                            >
                                                <div className="flex gap-3 items-start">
                                                    <div className="w-[60px] h-[60px]">
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`Image ${index}`}
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                                <MdDelete
                                                    onClick={() =>
                                                        setNewImage((prevImages) =>
                                                            prevImages.filter((_, imgIndex) => imgIndex !== index)
                                                        )
                                                    }
                                                    className="text-deleteBg text-lg cursor-pointer hover:text-primary"
                                                />
                                            </li>
                                        );
                                    }
                                    return null;
                                })
                            )}
                        </ul>
                    </div>

                    {/* manufacter name */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className='font-normal text-base'>Manufacturer Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editProdManuName}
                            onChange={(e) => setEditProdManuName(e.target.value)}
                            id=""
                            placeholder='Enter Manufacturer Name'
                            className='border-[1px] capitalize
                        bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                            focus:outline-none'/>
                    </div>

                    {/* manufacter brand */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className='font-normal text-base'>Manufacturer Brand</label>
                        <input
                            type="text"
                            name="name"
                            value={editProdManuBrand}
                            onChange={(e) => setEditProdManuBrand(e.target.value)}
                            id=""
                            placeholder='Enter Manufacturer Brand'
                            className='border-[1px] capitalize 
                        bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                            focus:outline-none'/>
                    </div>

                    {/* manufacter address */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className='font-normal text-base'>Manufacturer Address</label>
                        <input
                            type="text"
                            name="name"
                            value={editProdManuAddress}
                            onChange={(e) => setEditProdManuAddress(e.target.value)}
                            id=""
                            placeholder='Enter Manufacturer Address'
                            className='border-[1px] capitalize 
                        bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                            focus:outline-none'/>
                    </div>

                    {/* color size stock */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="">Set Product Attributes</label>
                            <FaPlus
                                className="text-2xl text-primary cursor-pointer"
                                onClick={handleAddColorField}
                            />
                        </div>

                        {editAttributeFields.map((field, colorIndex) => (
                            <div
                                key={colorIndex}
                                className="flex flex-col gap-2">
                                {/* Color Picker and Header */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 w-full">
                                        <div className="w-64 bg-primary text-white rounded-md font-custom tracking-wider flex items-center justify-center gap-2 p-2 cursor-pointer relative">
                                            <input
                                                type="color"
                                                value={field.color}
                                                onChange={(e) => handleAttributeInputChange(colorIndex, "color", e.target.value)}
                                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <p className='text-sm flex items-center gap-2'><FaPlus className="text-base" />Add Color</p>
                                        </div>
                                        <div className='w-full'>
                                            <input
                                                type="text"
                                                value={field.color}
                                                placeholder="Enter color name or color code"
                                                onChange={(e) => handleAttributeInputChange(colorIndex, "color", e.target.value)}
                                                className={`w-full p-2 text-center bg-gray-100/50 border rounded-md text-sm uppercase placeholder:capitalize 
                                focus:outline-none ${getContrastYIQ(field.color)}`}
                                                style={{ backgroundColor: field.color }}
                                            />
                                        </div>
                                    </div>
                                    <MdDelete
                                        className="text-xl text-primary cursor-pointer"
                                        onClick={() => handleDeleteColorField(colorIndex)}
                                    />
                                </div>

                                {/* Sizes and Stock Table */}
                                <div className='flex flex-col gap-2'>
                                    {Array.isArray(field.sizes) && field.sizes.map((sizeField, sizeIndex) => (
                                        <div key={sizeIndex} className="flex items-center justify-between gap-2">
                                            <Button
                                                onClick={() => handleAddSizeField(colorIndex)}
                                                className='bg-gray-100/50 border border-gray-300 text-secondary shadow-none rounded-3xl w-11 h-10 p-2 flex items-center justify-center 
                                   font-custom font-normal capitalize text-sm hover:shadow-none'
                                            ><FaPlus /></Button>
                                            <div className='flex items-center gap-2 w-full'>
                                                <select
                                                    value={sizeField.size}
                                                    onChange={(e) => handleSizeFieldChange(colorIndex, sizeIndex, "size", e.target.value)}
                                                    className="border w-full bg-gray-100/50 p-2 rounded-md uppercase placeholder:text-sm focus:outline-none placeholder:capitalize"
                                                >
                                                    <option value="">Select Size</option>
                                                    <optgroup label="Kurthi Sizes">
                                                        <option value="XS (34)">XS (34)</option>
                                                        <option value="S (36)">S (36)</option>
                                                        <option value="M (38)">M (38)</option>
                                                        <option value="L (40)">L (40)</option>
                                                        <option value="XL (42)">XL (42)</option>
                                                        <option value="2XL (44)">2XL (44)</option>
                                                        <option value="3XL (46)">3XL (46)</option>
                                                        <option value="4XL (48)">4XL (48)</option>
                                                        <option value="5XL (50)">5XL (50)</option>
                                                    </optgroup>
                                                    <optgroup label="Bottom Sizes">
                                                        <option value="S">S</option>
                                                        <option value="M">M</option>
                                                        <option value="L">L</option>
                                                        <option value="XL">XL</option>
                                                        <option value="2XL">2XL</option>
                                                        <option value="3XL">3XL</option>
                                                    </optgroup>
                                                    <option value="Free">Free</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    value={sizeField.stock}
                                                    placeholder="Enter stock quantity"
                                                    onChange={(e) => handleSizeFieldChange(colorIndex, sizeIndex, "stock", e.target.value)}
                                                    className="border w-full bg-gray-100/50 p-2 rounded-md placeholder:text-sm focus:outline-none placeholder:capitalize"
                                                />
                                            </div>
                                            <HiMiniXMark
                                                className="text-2xl text-primary cursor-pointer"
                                                onClick={() => handleDeleteSizeField(colorIndex, sizeIndex)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {/* Size Chart Selection */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-sm font-medium">Select Size Charts</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {sizeChartOptions.map((chart) => {
                                            const isChecked = selectedSizeChartRefs.includes(chart._id);

                                            return (
                                                <label
                                                    key={chart._id}
                                                    className="flex items-center gap-2 bg-gray-100/50 p-2 rounded-md border cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            if (isChecked) {
                                                                setSelectedSizeChartRefs(prev => prev.filter(id => id !== chart._id));
                                                            } else {
                                                                setSelectedSizeChartRefs(prev => [...prev, chart._id]);
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm">{chart.title}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* button */}
                    <div className='flex justify-center items-center !mt-5'>
                        <Button type='submit' className='bg-buttonBg font-custom font-normal tracking-wider'>submit product</Button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default EditProduct
