import React, { useState, useContext, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogBody,
    Typography,
    IconButton,
    Input
} from "@material-tailwind/react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { AppContext } from "../../../../StoreContext/StoreContext";
import toast from 'react-hot-toast';

export function EditSizeChartModal({ 
    open, 
    handleOpen, 
    setAdminSizeCharts, 
    sizeChartId, 
    initialData 
}) {
    const { BASE_URL } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [sizes, setSizes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [measurementFields, setMeasurementFields] = useState([]);
    const [newMeasurementField, setNewMeasurementField] = useState('');

    // Load initial data when modal opens or initialData changes
    useEffect(() => {
        if (open && initialData) {
            setTitle(initialData.title || '');
            
            // Set sizes from initial data
            if (initialData.sizes && initialData.sizes.length > 0) {
                setSizes(initialData.sizes);
            } else {
                setSizes([{ 
                    size: '', 
                    measurements: {} 
                }]);
            }
            
            // Extract all measurement fields from sizes
            const allFields = new Set();
            initialData.sizes?.forEach(size => {
                Object.keys(size.measurements || {}).forEach(field => {
                    allFields.add(field);
                });
            });
            setMeasurementFields(Array.from(allFields));
        }
    }, [open, initialData]);

    // Add new size row
    const addSizeRow = () => {
        setSizes([
            ...sizes,
            {
                size: '',
                measurements: measurementFields && Array.isArray(measurementFields)
                    ? Object.fromEntries(measurementFields.map(field => [field, '']))
                    : {} // Fallback to an empty object if measurementFields is not an array
            }
        ]);
    };
    

    // Remove size row
    const removeSizeRow = (index) => {
        if (sizes.length > 1) {
            const newSizes = [...sizes];
            newSizes.splice(index, 1);
            setSizes(newSizes);
        }
    };

    // Handle size field changes
    const handleSizeChange = (index, field, value) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    // Handle measurement changes
    const handleMeasurementChange = (sizeIndex, field, value) => {
        const newSizes = [...sizes];
        if (!newSizes[sizeIndex].measurements) {
            newSizes[sizeIndex].measurements = {};
        }
        newSizes[sizeIndex].measurements[field] = value;
        setSizes(newSizes);
    };

    // Add new measurement field
    const addMeasurementField = () => {
        const trimmed = newMeasurementField.trim();
        if (trimmed && !measurementFields.includes(trimmed)) {
            setMeasurementFields([...measurementFields, trimmed]);
            // Add the new field to all existing sizes
            setSizes(sizes.map(size => ({
                ...size,
                measurements: {
                    ...(size.measurements || {}),
                    [trimmed]: ''
                }
            })));
            setNewMeasurementField('');
        }
    };

    // Remove measurement field
    const removeMeasurementField = (field) => {
        // Remove field from measurementFields
        const updatedFields = measurementFields.filter(f => f !== field);
        setMeasurementFields(updatedFields);

        // Remove field from each size's measurements
        setSizes(sizes.map(size => {
            const { [field]: _, ...restMeasurements } = size.measurements || {};
            return {
                ...size,
                measurements: restMeasurements
            };
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authorization is missing");
                return;
            }

            // Prepare the data in required format
            const sizeChartData = {
                title,
                sizes: sizes.map(size => ({
                    size: size.size,
                    measurements: Object.fromEntries(
                        Object.entries(size.measurements || {})
                            .filter(([_, value]) => value !== '')
                            .map(([field, value]) => [field, parseFloat(value) || 0])
                    )
                })).filter(size => size.size) // Filter out empty rows
            };

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // API call to update size chart
            const response = await axios.patch(
                `${BASE_URL}/admin/sizechart/update/${sizeChartId}`,
                sizeChartData,
                { headers }
            );

            // Success message
            toast.success('Size chart updated successfully!');
            
            // Close modal
            handleOpen();
            
            // Refresh size charts list
            if (setAdminSizeCharts) {
                const fetchResponse = await axios.get(`${BASE_URL}/admin/sizechart/get`, { headers });
                setAdminSizeCharts(fetchResponse.data);
            }

        } catch (error) {
            console.error("Error updating size chart:", error);
            toast.error(error.response?.data?.message || 'Failed to update size chart');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="lg" className="rounded-none">
            <DialogBody className="max-h-[80vh] overflow-y-auto">
                <div className="p-5">
                    <Typography variant="h4" className="font-custom font-semibold mb-0 text-secondary">
                        Edit Size Chart
                    </Typography>

                    <form className="space-y-5 mt-10" onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="flex flex-col gap-1">
                            <label className="font-normal text-base">Size Chart Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Women's Dresses"
                                className="border-[1px] text-sm bg-gray-100/50 p-2 rounded-md 
                                placeholder:text-sm placeholder:font-light 
                                placeholder:text-gray-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Measurement Fields */}
                        <div className="space-y-2">
                            <Typography className="font-normal text-base">Measurements:</Typography>
                            <div className="flex flex-wrap gap-2">
                                {measurementFields.map((field, idx) => (
                                    <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                                        <span>{field}</span>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => removeMeasurementField(field)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Measurement Field Input */}
                            <div className="flex gap-2 items-center mt-2">
                                <input
                                    type="text"
                                    placeholder="New Measurement (e.g. Sleeve)"
                                    className="border-[1px] text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none w-full max-w-xs"
                                    value={newMeasurementField}
                                    onChange={(e) => setNewMeasurementField(e.target.value)}
                                />
                                <Button
                                    size="sm"
                                    className="bg-buttonBg text-white"
                                    onClick={addMeasurementField}
                                >
                                    Add Field
                                </Button>
                            </div>
                        </div>

                        {/* Size Chart Table */}
                        <div className="space-y-3">
                            <label className="font-normal text-base">Size Measurements</label>

                            {sizes.map((size, index) => (
                                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                                    {/* Size */}
                                    <div>
                                        <input
                                            type="text"
                                            value={size.size}
                                            onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                            placeholder="Size (e.g. S, M, L)"
                                            className="border-[1px] text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Dynamic Measurement Fields */}
                                    {measurementFields.map(field => (
                                        <div key={field}>
                                            <input
                                                type="number"
                                                value={size.measurements?.[field] || ''}
                                                onChange={(e) => handleMeasurementChange(index, field, e.target.value)}
                                                placeholder={`${field} (in)`}
                                                className="border-[1px] text-sm bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                                                min="0"
                                                step="0.1"
                                            />
                                        </div>
                                    ))}

                                    {/* Remove Button */}
                                    <div className="flex justify-center">
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            onClick={() => removeSizeRow(index)}
                                            disabled={sizes.length <= 1}
                                        >
                                            <MdDeleteOutline className="text-xl" />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}

                            {/* Add Row Button */}
                            <div className="flex justify-start">
                                <Button
                                    type="button"
                                    variant="outlined"
                                    size="sm"
                                    className="flex items-center gap-1 border-buttonBg text-buttonBg"
                                    onClick={addSizeRow}
                                >
                                    <IoIosAdd className="text-lg" />
                                    <span>Add Size</span>
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center items-center mt-8 gap-4">
                            <Button
                                type="button"
                                onClick={handleOpen}
                                className="capitalize bg-primary/20 text-primary font-normal text-sm w-52"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="capitalize bg-buttonBg font-normal text-sm w-52"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Size Chart'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogBody>
        </Dialog>
    );
}