import React from "react";
import { Button, Card, CardFooter, Chip, IconButton, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../../../StoreContext/StoreContext";
import { useEffect } from "react";
import AppLoader from "../../../../Loader";
import axios from "axios";

const TABLE_HEAD = ["Product", "Product Code", "Payment", "Status", "Price"];


const UserOrdersTable = ({ user }) => {
  const { BASE_URL } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const token = localStorage.getItem('token')
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const userGetAllOrders = user?.id || user?._id
  console.log(userGetAllOrders);


  //fetch order list
  const fetchUserOrderList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/orderlist/user/orders/${userGetAllOrders}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserOrders(response.data || []);
      console.log(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };

  useEffect(() => {
    fetchUserOrderList()
  }, [])

  // Status colors
  const statusColors = {
    Delivered: "text-shippedBg bg-shippedBg/20",
    Cancelled: "text-cancelBg bg-cancelBg/20",
    Pending: "text-pendingBg bg-pendingBg/20",
    Processing: 'text-processingBg bg-processingBg/20',
    default: "text-gray-100 bg-gray-500",
    "In-Transist": "text-intransistBg bg-intransistBg/20",
  };

  // Get current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrderList = (userOrders || []).slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next and prev page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(userOrders.length / itemsPerPage)) {
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
      <h2 className="text-lg font-medium mb-5 text-secondary">Orders</h2>
      {isLoading ? (
        <div className="col-span-2 flex justify-center items-center h-[50vh]">
          <AppLoader />
        </div>
      ) : userOrders.length === 0 ? (
        <>
        <p className='flex justify-center items-center h-[30vh]'>No orders still yet</p>
        </>
      ): (
        <>
          <Card className="w-full shadow-none bg-white">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="bg-quaternary">
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-gray-300 p-4 text-center"
                    >
                      <Typography
                        variant="small"
                        className="font-semibold font-custom text-secondary text-sm uppercase"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentOrderList.map((item, index) => {
                  const isLast = index === currentOrderList.length - 1;
                  const classes = isLast
                    ? "p-4 text-center"
                    : "p-4 border-b border-gray-300 text-center";

                  return (
                    <tr key={item._id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal font-custom text-sm"
                        >
                          {item.products[0].productId?.title || 'product'}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal font-custom text-sm"
                        >
                          {item.products[0].productId?.product_Code || 'code'}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal font-custom text-sm"
                        >
                          {item.paymentMethod}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          className={`capitalize text-sm text-center font-normal ${statusColors[item.status] || statusColors.default}`}
                          value={item.status === 'In-Transist' ? 'dispatched' : item.status}
                        />
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal font-custom text-sm"
                        >
                          ₹{item.finalPayableAmount}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-10">
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
                {[...Array(Math.ceil(userOrders.length / itemsPerPage))].map((_, index) => (
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
                disabled={currentPage === Math.ceil(userOrders.length / itemsPerPage)}
              >
                Next page
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
};

export default UserOrdersTable;
