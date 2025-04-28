import { Button, Checkbox, Typography } from '@material-tailwind/react';
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6';
import { IoIosArrowBack, IoMdCloudUpload } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useContext } from 'react';
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiMiniXMark } from 'react-icons/hi2';


const AddProduct = () => {
    const { BASE_URL } = useContext(AppContext) //BASE URL
    const navigate = useNavigate()
    const [attributeFields, setAttributeFields] = useState([{ color: "", sizes: [{ size: "", stock: "" }] }]);
    const [productTitle, setProductTitle] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productSubCategory, setProductSubCategory] = useState('')
    const [productCode, setProductCode] = useState('')
    const [productActualPrice, setProductActualPrice] = useState('')
    const [productDiscount, setProductDiscount] = useState('')
    const [productOfferPrice, setProductOfferPrice] = useState('')
    const [lastChanged, setLastChanged] = useState('');
    const [sizeChartOptions, setSizeChartOptions] = useState([]);
    const [selectedSizeChartRefs, setSelectedSizeChartRefs] = useState([]);
    const [imageError, setImageError] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
        axios.get(`${BASE_URL}/admin/sizechart/get`)
            .then(res => {
                console.log('API response:', res.data);
                setSizeChartOptions(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        console.log('Selected charts:', selectedSizeChartRefs);
    }, [selectedSizeChartRefs]);

    const [checkboxes, setCheckboxes] = useState({
        latest: false,
        offer: false,
        featured: false,
    });
    const [specifications, setSpecifications] = useState({
        netWeight: '',
        fit: '',
        sleevesType: '',
        Length: '',
        occasion: '',
        innerLining: '',
        material: '',
        pocket:''
    });

    const [productDescription, setProductDescription] = useState('')
    const [productImage, setProductImage] = useState([])
    const [productManuName, setProductManuName] = useState('')
    const [productManuBrand, setProductManuBrand] = useState('')
    const [productManuAddress, setProductManuAddress] = useState('')
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [filteredSubCategories, setFilteredSubCategories] = useState([]); //for getting subcategory having same catgeory id

    // handle image
    const handleProductImageUpload = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to array
        setProductImage((prevImages) => [...prevImages, ...files]); // Append new files
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
    const handleSpecificationChange = (e, key) => {
        setSpecifications(prev => ({
            ...prev,
            [key]: e.target.value
        }));
    };

    // Handler for checkbox change
    const handleCheckboxChange = (e, checkboxName) => {
        setCheckboxes({ ...checkboxes, [checkboxName]: e.target.checked });
    };

    // fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/category/get`);
                setCategories(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error, ": Error fetching data");
            }
        }
        fetchCategories();
    }, [BASE_URL])


    // price computation
    useEffect(() => {
        const actual = parseFloat(productActualPrice);
        const discount = parseFloat(productDiscount);
        const offer = parseFloat(productOfferPrice);

        if (lastChanged === 'discount' && actual && discount >= 0) {
            const newOffer = actual - (actual * (discount / 100));
            setProductOfferPrice(newOffer.toFixed(2));
        }

        if (lastChanged === 'offerPrice' && actual && offer >= 0) {
            const newDiscount = ((actual - offer) / actual) * 100;
            setProductDiscount(newDiscount.toFixed(2));
        }

        // optional: if actualPrice is changed and both discount/offer exist, you can update accordingly.
    }, [productActualPrice, productDiscount, productOfferPrice, lastChanged]);



    // subcategory display based on category id
    useEffect(() => {
        if (productCategory) {
            const filtered = subCategories.filter(
                (subcategory) => subcategory.category._id === productCategory
            );
            setFilteredSubCategories(filtered);
        } else {
            setFilteredSubCategories([]);
        }
    }, [productCategory, subCategories]);

    // fetch Sub categories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/Subcategory/get`);
                setSubCategories(response.data)
                console.log(response.data);
            } catch (error) {
                console.log(error, ": error fetching sub categories");
            }
        }
        fetchSubCategories();
    }, [])

    // form submission
    const handleCreateProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authorization is missing");
                return;
            }
            if (productImage.length === 0) {
                setImageError(true);
                toast.error("Please upload at least one product image");
                return;
              } else {
                setImageError(false);
              }
              let hasValidationErrors = false;
  
              const validatedAttributes = attributeFields.map(field => {
                // Validate color
                if (!field.color.trim()) {
                  hasValidationErrors = true;
                  toast.error("Please fill in all color fields");
                  return;
                }
            
                // Validate sizes
                const validatedSizes = field.sizes.map(size => {
                  if (!size.size.trim()) {
                    hasValidationErrors = true;
                    toast.error("Please select a size for all options");
                  }
                  if (size.stock === "" || isNaN(Number(size.stock))) {
                    hasValidationErrors = true;
                    toast.error("Please enter a valid stock quantity");
                  }
                  return size;
                });
            
                return {
                  color: field.color.trim(),
                  sizes: validatedSizes
                };
              });

            // Validate inputs
            if (!productTitle.trim() || !productCategory.trim()) {
                alert("Product title and category are required");
                return;
            }

            const productFormData = new FormData();
            productFormData.append('folder', 'Products');
            productFormData.append('title', productTitle);
            productFormData.append('category', productCategory);
            productFormData.append('subcategory', productSubCategory);
            productFormData.append('product_Code', productCode);
            productFormData.append('actualPrice', productActualPrice);
            productFormData.append('discount', productDiscount);
            // Calculate offer price
            const calculatedOfferPrice = productActualPrice - (productActualPrice * (productDiscount / 100));
            productFormData.append('offerPrice', calculatedOfferPrice.toFixed(2));
            productFormData.append('isLatestProduct', checkboxes.latest);
            productFormData.append('isOfferProduct', checkboxes.offer);
            productFormData.append('isFeaturedProduct', checkboxes.featured);
            productFormData.append('description', productDescription);
            // Append specifications to features
            Object.entries(specifications).forEach(([key, value]) => {
                productFormData.append(`features[${key}]`, value || null);
            });
            // Append images
            productImage.forEach((image) => {
                productFormData.append('images', image);
            });
            //append color size and stock
            const colors = attributeFields.reduce((acc, field) => {
                if (field.color.trim()) {
                    const validSizes = field.sizes
                        .filter(size =>
                            size.size.trim() &&
                            size.stock !== '' &&
                            !isNaN(Number(size.stock))
                        )
                        .map(size => ({
                            size: size.size.trim(),
                            stock: Number(size.stock)
                        }));

                    if (validSizes.length > 0) {
                        acc.push({
                            color: field.color.trim(),
                            sizes: validSizes
                        });
                    }
                }
                return acc;
            }, []);

            // Ensure colors are added correctly
            if (colors.length > 0) {
                productFormData.append('colors', JSON.stringify(colors));
            }
            // Append manufacturer details
            productFormData.append('manufacturerName', productManuName);
            productFormData.append('manufacturerBrand', productManuBrand);
            productFormData.append('manufacturerAddress', productManuAddress);
            if (selectedSizeChartRefs.length > 0) {
                selectedSizeChartRefs.forEach((id) => {
                    productFormData.append('sizeChartRefs', id); // Append each ID individually
                });
            }
            

            // Debugging: Log the FormData
            for (const [key, value] of productFormData.entries()) {
                console.log(key, value);
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const response = await axios.post(`${BASE_URL}/admin/products/create-product`, productFormData, { headers });
            console.log(response.data);
            toast.success("Product is created");
            navigate(-1)
            // Reset form
            setProductTitle('');
            setProductCategory('');
            setProductSubCategory('');
            setProductCode('');
            setProductOfferPrice(null);
            setProductActualPrice('');
            setProductDiscount('');
            setCheckboxes({ latest: false, offer: false, featured: false });
            setSpecifications({ netWeight: "", fit: "", sleevesType: "", Length: "", occasion: "", innerLining: "", material: "",pocket:"" })
            setAttributeFields([{ color: "", sizes: [{ size: "", stock: "" }] }]);
            setProductDescription('');
            setProductImage([]);
            setProductManuName('');
            setProductManuBrand('');
            setProductManuAddress('');
            setSelectedSizeChartRefs([]); 
        } catch (error) {
            console.error("Error in form submission:", error?.response?.data || error.message);
            alert(error?.response?.data?.message || "Product is not created");
            if (error.response) {
                if (error.response.status === 413) {
                    toast.error("File size is too large. Please upload a smaller file.");
                } else {
                    toast.error(error.response.data?.message || "Something went wrong!");
                }
            }
            else {
                toast.error("Network error. Please try again.");
            }
        }
    };


    const handleAddColorField = () => {
        setAttributeFields([...attributeFields, { color: "", sizes: [{ size: "", stock: "" }] }]);
    };

    const handleDeleteColorField = (index) => {
        if (attributeFields.length > 1) {
            setAttributeFields(attributeFields.filter((_, i) => i !== index));
        }
        else {
            toast.error("Atleast one attribute field is required");
        }
    };


    const handleAddSizeField = (colorIndex) => {
        const updatedFields = [...attributeFields];
        updatedFields[colorIndex].sizes.push({ size: "", stock: "" });
        setAttributeFields(updatedFields);
    };


    const handleDeleteSizeField = (colorIndex, sizeIndex) => {
        const updatedFields = [...attributeFields];

        if (updatedFields[colorIndex]?.sizes && updatedFields[colorIndex].sizes.length > 1) {
            updatedFields[colorIndex].sizes = updatedFields[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
        } else {
            toast.error("Sizes and Stock is required");
        }

        setAttributeFields(updatedFields);
    };


    const handleSizeFieldChange = (colorIndex, sizeIndex, key, value) => {
        const updatedFields = [...attributeFields];

        // Check if 'sizes' exists and is an array
        if (updatedFields[colorIndex]?.sizes) {
            updatedFields[colorIndex].sizes[sizeIndex][key] = value;
        }
        setAttributeFields(updatedFields);
    };

    // Handle input changes
    const handleAttributeInputChange = (index, key, value) => {
        const updatedFields = [...attributeFields];
        updatedFields[index][key] = value;
        setAttributeFields(updatedFields);
    };


    return (
        <>
            <p onClick={() => navigate(-1)} className='flex items-center cursor-pointer hover:text-primary'>
                <IoIosArrowBack /> Back</p>
            <h1 className='text-2xl lg:text-3xl font-semibold'>Create Product</h1>
            <form action='' className="grid lg:grid-cols-2 gap-10 mt-5" onSubmit={handleCreateProductSubmit}>
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
                                value={productTitle}
                                onChange={(e) => setProductTitle(e.target.value)}
                                id=""
                                placeholder='Enter Product title'
                                className='border-[1px] 
                                    bg-gray-100/50 p-2 capitalize rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                        </div>

                        {/* category */}
                        <div className='flex justify-between items-center gap-2'>
                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-normal text-base'>Product Category</label>
                                <select
                                    name="selectField"
                                    value={productCategory}
                                    onChange={(e) => setProductCategory(e.target.value)}
                                    className="w-full capitalize text-sm text-secondary font-light bg-gray-100/50 border p-2 rounded focus:outline-none focus:cursor-pointer"
                                >
                                    <option value="Option 1">Select Category</option>
                                    {
                                        categories.map((category) => (
                                            <option key={category.id} value={category.id} className='capitalize'>{category.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* subcategory */}
                            <div className='flex flex-col gap-1 w-full'>
                                <label className='font-normal text-base'>Sub Category</label>
                                <select
                                    name="selectField"
                                    value={productSubCategory}
                                    onChange={(e) => setProductSubCategory(e.target.value)}
                                    className="w-full capitalize text-sm text-secondary font-light bg-gray-100/50 border p-2 rounded focus:outline-none focus:cursor-pointer"
                                >
                                    <option value="Option 1">Select SubCategory</option>
                                    {
                                        filteredSubCategories.map((subcategory) => (
                                            <option key={subcategory._id} value={subcategory._id} className='capitalize'>{subcategory.title}</option>
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
                                    value={productCode}
                                    onChange={(e) => setProductCode(e.target.value)}
                                    id=""
                                    placeholder='Enter Product code'
                                    className='border-[1px] w-full
                                    bg-gray-100/50 p-2 uppercase rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none placeholder:capitalize'/>
                            </div>
                        </div>
                        {/* price */}
                        <div className='flex justify-between items-center gap-2'>
                            <div className='flex flex-col gap-1 w-1/3'>
                                <label className='font-normal text-base'>Actual Price</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productActualPrice}
                                    onChange={(e) => {
                                        setProductActualPrice(e.target.value);
                                        setLastChanged('actualPrice');
                                    }}
                                    id=""
                                    placeholder='Actual Price'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                            </div>
                            <div className='flex flex-col gap-1 w-1/3'>
                                <label className='font-normal text-base'>Discount (%)</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productDiscount}
                                    onChange={(e) => {
                                        setProductDiscount(e.target.value);
                                        setLastChanged('discount');
                                    }}
                                    id=""
                                    placeholder='Discount'
                                    className='border-[1px] w-full
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                            </div>
                            {/* offer price */}
                            <div className='flex flex-col gap-1 w-1/3'>
                                <label htmlFor="" className='font-normal text-base'>Offer Price</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productOfferPrice}
                                    onChange={(e) => {
                                        setProductOfferPrice(e.target.value);
                                        setLastChanged('offerPrice');
                                    }}
                                    id=""
                                    placeholder='Offer price'
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
                                value={checkboxes.latest}
                                onChange={(e) => handleCheckboxChange(e, 'latest')}
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                            <Checkbox label={
                                <Typography className='font-custom text-secondary text-base font-normal'>Offer Products</Typography>}
                                color='pink'
                                value={checkboxes.offer}
                                onChange={(e) => handleCheckboxChange(e, 'offer')}
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                            <Checkbox label={
                                <Typography className='font-custom text-secondary text-base font-normal'>Featured Products</Typography>}
                                color='pink'
                                value={checkboxes.featured}
                                onChange={(e) => handleCheckboxChange(e, 'featured')}
                                className='border-2 border-primary rounded-sm w-4 h-4'
                            />
                        </div>

                        {/* specifications */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Specifications</label>
                            <div className='flex items-center gap-1 mt-4'>
                                <label htmlFor="" className='font-normal text-sm w-32'>NetWeight</label>
                                <p>:</p>
                                <input
                                    type="text"
                                    name="value"
                                    value={specifications.netWeight}
                                    onChange={(e) => handleSpecificationChange(e, 'netWeight')}
                                    placeholder='value'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                    focus:outline-none'
                                />
                            </div>
                            <div className='flex items-center gap-1'>
                                <label htmlFor="" className='font-normal text-sm w-32'>Fit</label>
                                <p>:</p>
                                <input
                                    type="text"
                                    name="value"
                                    value={specifications.fit}
                                    onChange={(e) => handleSpecificationChange(e, 'fit')}
                                    placeholder='value'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                    focus:outline-none'
                                />
                            </div>
                            <div className='flex items-center gap-1'>
                                <label htmlFor="" className='font-normal text-sm w-32'>Sleeves Type</label>
                                <p>:</p>
                                <input
                                    type="text"
                                    name="value"
                                    value={specifications.sleevesType}
                                    onChange={(e) => handleSpecificationChange(e, 'sleevesType')}
                                    placeholder='value'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                    focus:outline-none'
                                />
                            </div>
                            <div className='flex items-center gap-1'>
                                <label htmlFor="" className='font-normal text-sm w-32'>Length</label>
                                <p>:</p>
                                <input
                                    type="text"
                                    name="value"
                                    value={specifications.Length}
                                    onChange={(e) => handleSpecificationChange(e, 'Length')}
                                    placeholder='value'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                    focus:outline-none'
                                />
                            </div>
                            <div className='flex items-center gap-1'>
                                <label htmlFor="" className='font-normal text-sm w-32'>Occassion</label>
                                <p>:</p>
                                <input
                                    type="text"
                                    name="value"
                                    value={specifications.occasion}
                                    onChange={(e) => handleSpecificationChange(e, 'occasion')}
                                    placeholder='value'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                    focus:outline-none'
                                />
                            </div>
                            <div className='flex items-center gap-1'>
                                <label htmlFor="" className='font-normal text-sm w-32'>Inner Lining</label>
                                <p>:</p>
                                <input
                                    type="text"
                                    name="value"
                                    value={specifications.innerLining}
                                    onChange={(e) => handleSpecificationChange(e, 'innerLining')}
                                    placeholder='value'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                    focus:outline-none'
                                />
                            </div>
                            <div className="flex items-center gap-1">
      <label htmlFor="material" className="font-normal text-sm w-32">Material</label>
      <p>:</p>
      <select
        id="material"
        name="material"
        value={specifications.material} // Bind the selected value to the state
        onChange={handleMaterialSelect} // Handle selection change
        className="border-[1px] w-full bg-gray-100/50 p-2 rounded-md focus:outline-none"
        disabled={isLoading} // Disable the dropdown while loading
      >
        <option value="">Select Material</option> {/* Default option */}
        {!isLoading ? (
          materials.map((material) => (
            <option key={material._id} value={material.materialName}>
              {material.materialName} {/* Show material name in dropdown */}
            </option>
          ))
        ) : (
          <option>Loading...</option> // Loading message
        )}
      </select>
    </div>
                            <div className='flex items-center gap-1'>
                                <label htmlFor="" className='font-normal text-sm w-32'>Pocket</label>
                                <p>:</p>
                                <input
                                    type="text"
                                    name="value"
                                    value={specifications.pocket}
                                    onChange={(e) => handleSpecificationChange(e, 'pocket')}
                                    placeholder='value'
                                    className='border-[1px] w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                    focus:outline-none'
                                />
                            </div>
                        </div>


                        {/* description */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Product Description</label>
                            <textarea
                                name="description"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                rows="10"
                                className="w-full border-[1px] bg-gray-100/50 p-2 rounded resize-none overflow-y-scroll focus:outline-none
                                        placeholder:text-sm placeholder:font-light placeholder:text-gray-500 hide-scrollbar"
                                placeholder="Enter your description here..."
                                style={{ maxHeight: '100px' }}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* second col */}
                {/* photo upload */}
                <div className='bg-white rounded-xl shadow-md p-5 space-y-6 h-fit'>
                <div className='grid grid-cols-5 gap-2'>
  <div className="col-span-3 flex flex-col justify-center items-center h-56 border-4 border-dashed border-primary rounded-xl">
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
    {imageError && (
      <p className="text-red-500 text-xs mt-2">At least one image is required</p>
    )}
  </div>
                        <div className='col-span-2'>
                            <ul className="flex flex-row gap-2 overflow-y-auto hide-scrollbar">
                                {productImage.length === 0 ? (
                                    <p className="text-xs text-gray-600 font-normal flex justify-center items-center h-[30vh]">
                                        Your selected images display here
                                    </p>
                                ) : (
                                    productImage.map((image, index) => (
                                        <li key={index} className="relative w-full">
                                            <div className="w-full h-[120px]">
                                                <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover rounded-md" />
                                            </div>
                                            <MdDelete
                                                onClick={() => setProductImage((prevImages) => prevImages.filter((_, imgIndex) => imgIndex !== index))}
                                                className="absolute top-1 right-1 text-deleteBg text-lg cursor-pointer hover:text-primary"
                                            />
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* manufacter name */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className='font-normal text-base'>Manufacturer Name</label>
                        <input
                            type="text"
                            name="name"
                            value={productManuName}
                            onChange={(e) => setProductManuName(e.target.value)}
                            id=""
                            placeholder='Enter Name'
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
                            value={productManuBrand}
                            onChange={(e) => setProductManuBrand(e.target.value)}
                            id=""
                            placeholder='Enter Brand'
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
                            value={productManuAddress}
                            onChange={(e) => setProductManuAddress(e.target.value)}
                            id=""
                            placeholder='Enter Address'
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
                        {attributeFields.map((field, colorIndex) => (
                            <div key={colorIndex} className="flex flex-col gap-2">
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
        className={`w-full p-2 text-center bg-gray-100/50 border rounded-md text-sm uppercase placeholder:capitalize focus:outline-none ${getContrastYIQ(field.color)}`}
        style={{ backgroundColor: field.color }}
        required
      />
      {!field.color && (
        <p className="text-red-500 text-xs mt-1">Color is required</p>
      )}
    </div>
  </div>
  <MdDelete
    className="text-xl text-primary cursor-pointer"
    onClick={() => handleDeleteColorField(colorIndex)}
  />
</div>

<div className='flex flex-col gap-2'>
  {Array.isArray(field.sizes) && field.sizes.map((sizeField, sizeIndex) => (
    <div key={sizeIndex} className="flex items-center justify-between gap-2">
      <Button
        onClick={() => handleAddSizeField(colorIndex)}
        className='bg-gray-100/50 border border-gray-300 text-secondary shadow-none rounded-3xl w-11 h-10 p-2 flex items-center justify-center 
          font-custom font-normal capitalize text-sm hover:shadow-none'
      >
        <FaPlus />
      </Button>
      <div className='flex items-center gap-2 w-full'>
        <div className="w-full">
          <select
            value={sizeField.size}
            onChange={(e) => handleSizeFieldChange(colorIndex, sizeIndex, "size", e.target.value)}
            className="border w-full bg-gray-100/50 p-2 rounded-md uppercase placeholder:text-sm focus:outline-none placeholder:capitalize"
            required
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
          {!sizeField.size && (
            <p className="text-red-500 text-xs mt-1">Size is required</p>
          )}
        </div>
        <div className="w-full">
          <input
            type="number"
            value={sizeField.stock}
            placeholder="Enter stock quantity"
            onChange={(e) => handleSizeFieldChange(colorIndex, sizeIndex, "stock", e.target.value)}
            className="border w-full bg-gray-100/50 p-2 rounded-md placeholder:text-sm focus:outline-none placeholder:capitalize"
            required
            min="0"
          />
          {(!sizeField.stock && sizeField.stock !== 0) && (
            <p className="text-red-500 text-xs mt-1">Stock is required</p>
          )}
        </div>
      </div>
      <HiMiniXMark
        className="text-2xl text-primary cursor-pointer"
        onClick={() => handleDeleteSizeField(colorIndex, sizeIndex)}
      />
    </div>
  ))}
</div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-sm font-medium">Select Size Charts</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {sizeChartOptions.map((chart) => {
                                            const isChecked = selectedSizeChartRefs.includes(chart._id); // Use chart._id, not chart.id

                                            return (
                                                <label
                                                    key={chart._id} // Also update key to use _id
                                                    className="flex items-center gap-2 bg-gray-100/50 p-2 rounded-md border cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            if (isChecked) {
                                                                setSelectedSizeChartRefs((prev) => prev.filter(id => id !== chart._id)); // Use _id
                                                            } else {
                                                                setSelectedSizeChartRefs((prev) => [...prev, chart._id]); // Use _id
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

export default AddProduct