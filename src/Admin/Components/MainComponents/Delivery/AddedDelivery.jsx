import { Button, Card, CardBody, CardFooter, IconButton, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../../../StoreContext/StoreContext";
import { DeleteModal } from "../../DeleteModal/DeleteModal";
import toast from "react-hot-toast";
import AppLoader from "../../../../Loader";

const TABLE_HEAD = ["Quantity", "Delivery Charge", "Action"];

export default function AddedDelivery({ createEditDelivery, handleEditDelivery, deliveryFees, setDeliveryFees, }) {
    const { BASE_URL, open, handleOpen, modalType, } = useContext(AppContext)
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // fetch delivery fees
    const fetchDeliveryFees = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/delivery-fee/view`)
            setDeliveryFees(response.data.data)
            setIsLoading(false)
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchDeliveryFees()
    }, [])

    // handle delete
    const handleDeleteDelivery = async (deliveryId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.delete(`${BASE_URL}/admin/delivery-fee/delete/${deliveryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
            handleOpen()
            toast.success('Delivery fee is deleted')
            fetchDeliveryFees();
        } catch (error) {
            console.log(error);
        }
    }

    // Get current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDeliveryFees = deliveryFees.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next and prev page
    const handleNextPage = () => {
        if (currentPage < Math.ceil(deliveryFees.length / itemsPerPage)) {
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
            {
                isLoading || deliveryFees === 0 ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : (
                    <>
                        <Card className="w-full shadow-sm rounded-xl bg-white border-[1px]">
                            <CardBody>
                                <table className="w-full table-auto text-left border-collapse">
                                    <thead>
                                        <tr className="bg-quaternary">
                                            {TABLE_HEAD.map((head) => (
                                                <th
                                                    key={head}
                                                    className="border-b border-blue-gray-100 p-4 text-center"
                                                >
                                                    <Typography
                                                        variant="small"
                                                        className="font-semibold font-custom text-secondary leading-none text-base uppercase"
                                                    >
                                                        {head}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDeliveryFees.map((delivery, index) => {
                                            const isLast = index === currentDeliveryFees.length - 1;
                                            const classes = isLast ?
                                                "p-4 text-center"
                                                : "p-4 border-b border-gray-300 text-center";

                                            return (
                                                <tr key={delivery._id}>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm"
                                                        >
                                                            {delivery.quantity}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            className="font-normal font-custom text-sm"
                                                        >
                                                            {delivery.deliveryFee}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex justify-center gap-2 text-sm">
                                                            <button
                                                                onClick={() => { handleEditDelivery(delivery); setSelectedDeliveryId(delivery._id) }}
                                                                className={`text-buttonBg bg-editBg w-14 h-7 flex justify-center items-center rounded-md hover:bg-buttonBg 
                                            hover:text-editBg ${createEditDelivery === "edit" && selectedDeliveryId === delivery._id ? "!bg-buttonBg text-editBg" : ""}`}>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => { handleOpen('deleteModal'); setSelectedDeliveryId(delivery._id) }}
                                                                className="text-deleteBg bg-primary/20 w-14 h-7 flex justify-center items-center rounded-md
                                        hover:bg-primary hover:text-white">
                                                                Delete
                                                            </button>
                                                        </div>
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
                                    {[...Array(Math.ceil(deliveryFees.length / itemsPerPage))].map((_, index) => (
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
                                    disabled={currentPage === Math.ceil(deliveryFees.length / itemsPerPage)}
                                >
                                    Next page
                                </Button>
                            </CardFooter>
                        </Card>
                    </>
                )
            }
            <DeleteModal
                open={open === "deleteModal"} // Distinguish by modalType
                handleOpen={handleOpen}
                title="Are you sure?"
                description="Do you really want to delete this delivery fee? This action cannot be undone."
                handleDelete={handleDeleteDelivery}
                deliveryId={selectedDeliveryId}
                modalType="delivery"
            />
        </>
    );
}