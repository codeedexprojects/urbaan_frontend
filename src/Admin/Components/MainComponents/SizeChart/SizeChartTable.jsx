import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    IconButton,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Typography
} from "@material-tailwind/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { EditSizeChartModal } from "./EditSizeChart";
import { Dialog } from "@material-tailwind/react";


const SizeChartTable = () => {
    const [adminSizeCharts, setAdminSizeCharts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentSizeChart, setCurrentSizeChart] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [chartToDelete, setChartToDelete] = useState(null);


    const handleEditClick = (sizeChart) => {
        setCurrentSizeChart(sizeChart);
        setEditModalOpen(true);
    };

    useEffect(() => {
        const fetchSizeCharts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Authorization is missing");
                    setIsLoading(false);
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.get("https://urbaan.in/api/admin/sizechart/get", { headers });
                setAdminSizeCharts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching size charts:", error);
                toast.error("Failed to load size charts");
                setIsLoading(false);
            }
        };

        fetchSizeCharts();
    }, []);

    const confirmDelete = async () => {
        if (!chartToDelete) return;
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authorization is missing");
                return;
            }
    
            const headers = {
                Authorization: `Bearer ${token}`
            };
    
            const response = await axios.delete(
                `https://urbaan.in/api/admin/sizechart/delete/${chartToDelete._id}`,
                { headers }
            );
    
            if (response.status === 200 || response.status === 204) {
                toast.success("Size chart deleted successfully");
                setAdminSizeCharts(prev => prev.filter(chart => chart._id !== chartToDelete._id));
                setDeleteModalOpen(false);
                setChartToDelete(null);
            } else {
                toast.error("Failed to delete size chart");
            }
        } catch (error) {
            console.error("Error deleting size chart:", error);
            toast.error("Failed to delete size chart");
        }
    };
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCharts = adminSizeCharts.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading size charts...</div>;
    }

    if (adminSizeCharts.length === 0) {
        return <div className="flex justify-center items-center h-64">No size charts found</div>;
    }

    return (
        <Card className="w-full shadow-sm rounded-xl bg-white border">
            <CardBody>
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="bg-quaternary">
                            <th className="p-3 text-center text-sm font-semibold text-secondary uppercase">Title</th>
                            <th className="p-3 text-center text-sm font-semibold text-secondary uppercase">Sizes & Measurements</th>
                            <th className="p-3 text-center text-sm font-semibold text-secondary uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCharts.map((chart) => (
                            <tr key={chart._id} className="border-t border-gray-200">
                                <td className="p-4 text-center align-top font-medium">{chart.title}</td>
                                <td className="p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {chart.sizes.map((sizeObj, index) => (
                                            <div key={index} className="bg-gray-50 border rounded-lg p-2">
                                                <Typography className="font-semibold text-sm text-center mb-2 uppercase text-primary">
                                                    {sizeObj.size}
                                                </Typography>
                                                <div className="text-sm space-y-1">
                                                    {Object.entries(sizeObj.measurements || {}).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="text-gray-700">{key}</span>
                                                            <span className="font-medium">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-center align-top">
                                    <Menu>
                                        <MenuHandler>
                                            <IconButton variant="text">
                                                <HiOutlineDotsHorizontal className="text-primary text-2xl cursor-pointer" />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem onClick={() => handleEditClick(chart)}>Edit</MenuItem>
                                            <MenuItem onClick={() => {
    setChartToDelete(chart);
    setDeleteModalOpen(true);
}}>Delete</MenuItem>

                                        </MenuList>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </Button>
                <div className="flex items-center gap-2">
                    {[...Array(Math.ceil(adminSizeCharts.length / itemsPerPage))].map((_, index) => (
                        <IconButton
                            key={index}
                            variant={currentPage === index + 1 ? "filled" : "text"}
                            size="sm"
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </IconButton>
                    ))}
                </div>
                <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === Math.ceil(adminSizeCharts.length / itemsPerPage)}
                >
                    Next
                </Button>
            </CardFooter>

            <EditSizeChartModal
                open={editModalOpen}
                handleOpen={() => setEditModalOpen(!editModalOpen)}
                setAdminSizeCharts={setAdminSizeCharts}
                sizeChartId={currentSizeChart?._id}
                initialData={currentSizeChart}
            />
            <Dialog open={deleteModalOpen} handler={() => setDeleteModalOpen(false)}>
    <div className="p-6">
        <Typography variant="h6" className="mb-4 text-center text-red-600">
            Are you sure you want to delete this size chart?
        </Typography>
        <div className="flex justify-center gap-4 mt-4">
            <Button
                color="red"
                onClick={confirmDelete}
            >
                Yes, Delete
            </Button>
            <Button
                variant="text"
                onClick={() => {
                    setDeleteModalOpen(false);
                    setChartToDelete(null);
                }}
            >
                Cancel
            </Button>
        </div>
    </div>
</Dialog>

        </Card>
    );
};

export default SizeChartTable;
