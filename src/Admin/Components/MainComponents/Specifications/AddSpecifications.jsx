import React, { useState, useEffect, useContext } from "react";
import { Button, Dialog, DialogBody, Input, IconButton, Typography, Select, Option } from "@material-tailwind/react";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../../../StoreContext/StoreContext";

const specificationTypes = [
  { value: 'material', label: 'Material' },
  { value: 'netWeight', label: 'Net Weight' },
  { value: 'fit', label: 'Fit' },
  { value: 'sleevesType', label: 'Sleeves Type' },
  { value: 'length', label: 'Length' },
  { value: 'occasion', label: 'Occasion' },
  { value: 'innerLining', label: 'Inner Lining' },
  { value: 'pocket', label: 'Pocket' },
  { value: 'other', label: 'Other' }
];

const ProductSpecifications = () => {
  const [specifications, setSpecifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState("");
  const [selectedType, setSelectedType] = useState("material");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const { BASE_URL } = useContext(AppContext);

  // Fetch specifications on component mount or when filter changes
  useEffect(() => {
    const fetchSpecifications = async () => {
      try {
        let url = `${BASE_URL}/admin/specification/all`;
        if (filterType !== "all") {
          url += `/type/${filterType}`;
        }

        const response = await axios.get(url);
        console.log("API Response:", response.data);
        
        setSpecifications(response.data.specifications || []);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error fetching specifications");
      }
    };
    fetchSpecifications();
  }, [BASE_URL, filterType]);

  // Handle specification addition
  const handleAddSpecification = async () => {
    if (!newSpecName.trim()) {
      toast.error("Specification name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/admin/specification/add`, { 
        name: newSpecName,
        type: selectedType
      });
      
      const newSpec = response.data.specification;
      setSpecifications(prev => [newSpec, ...prev]);
      toast.success(`${specificationTypes.find(t => t.value === selectedType)?.label} added successfully!`);
      setNewSpecName("");
      setOpen(false);
    } catch (error) {
      console.error("Add error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding specification");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle specification deletion
  const handleDeleteSpecification = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/admin/specification/delete/${id}`);
      setSpecifications(prev => prev.filter(spec => spec._id !== id));
      toast.success("Specification deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Error deleting specification");
    }
  };

  // Toggle specification active status
  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.patch(`${BASE_URL}/admin/specification/toggle-status/${id}`);
      const updatedSpec = response.data.specification;
      setSpecifications(prev => 
        prev.map(spec => 
          spec._id === id ? updatedSpec : spec
        )
      );
      toast.success(`Status updated for ${updatedSpec.name}`);
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Product Specifications</Typography>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-1 bg-buttonBg text-white">
          <IoIosAdd className="text-lg" />
          <span>Add Specification</span>
        </Button>
      </div>

      {/* Filter by type */}
      <div className="mb-6 w-64">
        <Select 
          label="Filter by Type" 
          value={filterType}
          onChange={(value) => setFilterType(value)}
        >
          <Option value="all">All Types</Option>
          {specificationTypes.map(type => (
            <Option key={type.value} value={type.value}>{type.label}</Option>
          ))}
        </Select>
      </div>

      {/* Specifications Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {specifications.map((spec) => (
              <tr key={spec._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Typography variant="small">{spec.name}</Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {specificationTypes.find(t => t.value === spec.type)?.label || spec.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="outlined"
                    size="sm"
                    color={spec.isActive ? "green" : "red"}
                    onClick={() => handleToggleStatus(spec._id)}
                  >
                    {spec.isActive ? "Active" : "Inactive"}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <IconButton 
                    onClick={() => handleDeleteSpecification(spec._id)} 
                    variant="text" 
                    color="red"
                  >
                    <MdDeleteOutline size={20} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {specifications.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No specifications found
          </div>
        )}
      </div>

      {/* Add Specification Modal */}
      <Dialog open={open} handler={() => setOpen(false)} size="sm" className="rounded-lg">
        <DialogBody>
          <Typography variant="h5" className="text-center mb-5">Add New Specification</Typography>
          
          <div className="mb-5">
            <Select
              label="Specification Type"
              value={selectedType}
              onChange={(value) => setSelectedType(value)}
            >
              {specificationTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </div>
          
          <Input
            label="Specification Name"
            value={newSpecName}
            onChange={(e) => setNewSpecName(e.target.value)}
            className="mb-5"
            required
          />
          
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setOpen(false)}
              className="bg-gray-200 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSpecification}
              className="bg-buttonBg text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Specification"}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default ProductSpecifications;