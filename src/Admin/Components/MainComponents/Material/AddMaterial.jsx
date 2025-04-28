import React, { useState, useEffect, useContext } from "react";
import { Button, Dialog, DialogBody, Input, IconButton, Typography } from "@material-tailwind/react";
import { IoIosAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../../../StoreContext/StoreContext";

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { BASE_URL } = useContext(AppContext);

  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/material/view`);
        console.log("API Response:", response.data); // Debug log
        
        // Handle both array response and object with materials property
        const materialsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.materials || [];
        
        setMaterials(materialsData);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error fetching materials");
      }
    };
    fetchMaterials();
  }, [BASE_URL]);

  // Handle material addition
  const handleAddMaterial = async () => {
    if (!newMaterialName.trim()) {
      toast.error("Material name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/admin/material/add`, { 
        materialName: newMaterialName 
      });
      console.log("Add response:", response.data); // Debug log
      
      // Ensure the response contains the expected structure
      const newMaterial = response.data?.material || response.data;
      
      if (!newMaterial.materialName && newMaterial.name) {
        // Handle case where backend uses 'name' instead of 'materialName'
        newMaterial.materialName = newMaterial.name;
      }
      
      setMaterials(prev => [newMaterial, ...prev]);
      toast.success("Material added successfully!");
      setNewMaterialName("");
      setOpen(false);
    } catch (error) {
      console.error("Add error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding material");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle material deletion
  const handleDeleteMaterial = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/admin/material/delete/${id}`);
      setMaterials(prev => prev.filter(material => material._id !== id));
      toast.success("Material deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Error deleting material");
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-1 bg-buttonBg text-white">
        <IoIosAdd className="text-lg" />
        <span>Add Material</span>
      </Button>

      <div className="mt-5">
        <Typography variant="h6">Materials List</Typography>
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left border-b">Material Name</th>
                <th className="py-2 px-4 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material._id}>
                  <td className="py-2 px-4 border-b">
                    {material.materialName || material.name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <IconButton 
                      onClick={() => handleDeleteMaterial(material._id)} 
                      className="text-red-500"
                    >
                      <MdDeleteOutline />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Material Modal */}
      <Dialog open={open} handler={() => setOpen(false)} size="sm" className="rounded-none">
        <DialogBody>
          <Typography variant="h5" className="text-center mb-5">Add Material</Typography>
          <Input
            label="Material Name"
            value={newMaterialName}
            onChange={(e) => setNewMaterialName(e.target.value)}
            className="mb-5"
            required
          />
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setOpen(false)}
              className="bg-primary/20 text-primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMaterial}
              className="bg-buttonBg text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Material"}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default MaterialsList;