import React, { useState, useEffect, useContext } from 'react';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import { IoIosArrowDown } from 'react-icons/io';
import axios from 'axios';
import { AppContext } from '../../../StoreContext/StoreContext';

const FilterByMaterial = ({ handleMaterialFilter }) => {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const { BASE_URL } = useContext(AppContext);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/products/view-products`);
                const products = response.data; // Assuming this contains the product data

                // Extract materials and get unique values
                const extractedMaterials = [
                    ...new Set(products.map((product) => product.features.material))
                ];

                setMaterials(extractedMaterials);
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        };

        fetchMaterials();
    }, [BASE_URL]);

    const handleMaterialSelection = (material) => {
        setSelectedMaterial(material);
        handleMaterialFilter(material);
    };

    return (
        <Menu>
            <MenuHandler>
                <Button variant="outlined" className="w-full shadow-none font-custom flex justify-between items-center py-2 px-3 
                    border-gray-800 text-gray-800 font-medium rounded-3xl focus:outline-none">
                    Filter by material
                    <span className="text-xs capitalize bg-primary ml-5 px-2 text-white rounded-md">
                        {selectedMaterial}
                    </span>
                    <IoIosArrowDown className="text-lg text-gray-800" />
                </Button>
            </MenuHandler>
            <MenuList className="w-72 max-h-64 rounded-xl hide-scrollbar">
                {materials.map((material, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => handleMaterialSelection(material)}
                        className="capitalize font-medium font-custom text-gray-600 cursor-pointer"
                    >
                        {material}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default FilterByMaterial;
