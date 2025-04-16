import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, CardBody, CardFooter, Checkbox, Chip, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';
import AppLoader from '../../../../Loader';
import toast from 'react-hot-toast';
import { OrderStatusModal } from './OrderStatusModal';
import { ViewOrdersModal } from './ViewOrdersModal';
import { TrackIdModal } from './TrackIdModal';
import EditTrackIdModal from './EditTrackIdModal'
import * as XLSX from 'xlsx';

const TABLE_HEAD = ["ID", "Customer", "Address", "Order Date", "Payment", "Total Price", "Status", "Orders", "Track ID"];

const OrderTable = ({ orderList, setOrderList }) => {
  const { BASE_URL } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openOrderStatus, setOpenOrderStatus] = useState(false);
  const [selectOrder, setSelectOrder] = useState([])
  const [editStatusBtn, setEditStatusBtn] = useState(false)
  const [openViewOrders, setOpenViewOrders] = useState(false);
  const [getUserOrders, setGetUserOrders] = useState([])
  const [trackId, setTrackId] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [editTrackId, setEditTrackId] = useState(false)
  const [initialTrackId, setInitialTrackId] = useState(null);

  const handleEditTrackId = (trackId) => {
    setInitialTrackId(trackId)
  }


  //handle for set track id
  const handleOpenTrackId = (orderId) => {
    setTrackId(!trackId);
    setSelectedOrderId(orderId)
    console.log(orderId);
  };

  //handle for edit set track id
  const handleOpenEditTrackIdModal = (orderId) => {
    setEditTrackId(!editTrackId);
    setSelectedOrderId(orderId);
    console.log(orderId);
  };


  //handle user order modal
  const handleOpenViewOrders = (orderProducts) => {
    setOpenViewOrders(!openViewOrders);
    setGetUserOrders(orderProducts)
    console.log(orderProducts);

  }

  //handle order status
  const handleOpenOrderStatus = () => setOpenOrderStatus(!openOrderStatus);

  // Status colors
  const statusColors = {
    Delivered: "text-shippedBg bg-shippedBg/20",
    Cancelled: "text-cancelBg bg-cancelBg/20",
    Pending: "text-pendingBg bg-pendingBg/20",
    Processing: 'text-processingBg bg-processingBg/20',
    default: "text-gray-100 bg-gray-500",
    "In-Transist": "text-intransistBg bg-intransistBg/20",
  };

  const token = localStorage.getItem('token')

  //fetch order list
  const fetchOrderList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/orderlist/get`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrderList(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, [BASE_URL]);


  // Handle individual checkbox click
  const handleCheckboxClick = (orderId) => {
    setSelectOrder((prevSelected) => {
      if (prevSelected.includes(orderId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== orderId);
      } else {
        // If not selected, add to array
        return [...prevSelected, orderId];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectOrder.length === orderList.length) {
      setSelectOrder([]);
    } else {
      const allOrderIds = orderList.map((order) => order._id);
      setSelectOrder(allOrderIds);
      console.log(allOrderIds);
    }
  };


  // Get current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrderList = (orderList || []).slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next and prev page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(orderList.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Add the new title conditionally when `editStatusBtn` is true
  const tableHead = editStatusBtn ? ["", ...TABLE_HEAD] : TABLE_HEAD;

  //download in excel format
  const downloadOrderList = () => {
    if (!orderList || orderList.length === 0) {
      toast.error("No orders to download");
      return;
    }

    // Format data for Excel
    const formattedData = orderList.map(order => ({
      Order_ID: order.orderId,
      Customer_Name: order.userId?.name || 'N/A',
      Address: order.addressId?.address || 'N/A',
      Order_Date: new Date(order.createdAt).toLocaleDateString(),
      Payment_Method: order.paymentMethod,
      Status: order.status,
    }));

    // Create a new workbook and add a worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order List");

    // Save the Excel file
    XLSX.writeFile(wb, `order_list_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success("Order list downloaded successfully");
  };

  return (
    <>
      {isLoading ? (
        <div className="col-span-2 flex justify-center items-center h-[50vh]">
          <AppLoader />
        </div>
      ) : orderList.length === 0 ? (
        <>
          <p className='col-span-5 text-sm text-secondary flex justify-center items-center h-[50vh]'>No Orders match the selected filters.</p>
        </>
      ) : (
        <>
          <div className='relative'>
            {!editStatusBtn ? (
              <>
              </>
            ) : (
              <div className='flex items-center absolute left-0'>
                <Checkbox
                  checked={selectOrder.length === orderList.length}
                  onChange={handleSelectAll}
                />
                Select All
              </div>
            )}
            <div className='flex items-center gap-5 justify-end'>
              <a href=""
                onClick={downloadOrderList}
                className='underline underline-offset-2 text-sm text-shippedBg cursor-pointer'
              >Download as an Excel file</a>
              {!editStatusBtn ? (
                <>
                  <Button
                    onClick={() => setEditStatusBtn(!editStatusBtn)}
                    className='bg-buttonBg capitalize text-sm font-normal font-custom'>Edit Status</Button>
                </>
              ) : (
                <>
                  <p
                    onClick={() => setEditStatusBtn(!editStatusBtn)}
                    className='text-secondary underline underline-offset-2 text-lg cursor-pointer font-normal font-custom'>Back</p>
                </>
              )}
            </div>
          </div>

          <Card className="w-full shadow-sm rounded-xl bg-white border-[1px] mt-3">
            <CardBody>
              <table className="w-full table-auto text-left border-collapse">
                <thead>
                  <tr className='bg-quaternary'>
                    {tableHead.map((head) => (
                      <th key={head} className="border-b border-blue-gray-100 p-3 text-center w-[300px] whitespace-nowrap">
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
                  {currentOrderList.map((order, index) => {
                    const isLast = index === currentOrderList.length - 1;
                    const classes = isLast
                      ? "p-4 text-center"
                      : "p-4 border-b border-gray-300 text-center";

                    return (
                      <tr key={order._id}>
                        {!editStatusBtn ? (
                          <></>
                        ) : (
                          <>
                            <td className={classes}>
                              <Checkbox
                                checked={selectOrder.includes(order._id)}
                                onChange={() => handleCheckboxClick(order._id)}
                              />
                            </td>
                          </>
                        )}
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm">
                            {order?.orderId}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                            {order.userId?.name || ""}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize w-40">
                            {order?.addressId?.address}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                            {order?.paymentMethod}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal font-custom text-sm capitalize">
                          ₹{order?.finalPayableAmount}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Chip
                            className={`capitalize text-sm text-center font-normal ${statusColors[order.status] || statusColors.default}`}
                            value={order?.status === 'In-Transist' ? 'dispatched' : order.status === 'invoice_generated' ? 'Invoice Generated' : order.status}
                          />
                        </td>
                        <td className={classes}>
                          <Button
                            onClick={() => handleOpenViewOrders(order.products)}
                            className='bg-transparent shadow-none text-secondary font-custom capitalize font-normal
                          text-sm border border-gray-700 rounded-3xl px-4 py-2 hover:shadow-none'>View</Button>
                        </td>
                        <td className={classes}>
                          {order?.TrackId ? (
                            <span
                              onClick={() => {
                                handleOpenEditTrackIdModal(order._id);
                                handleEditTrackId(order.TrackId);
                              }}
                              className="text-buttonBg font-medium tracking-wider cursor-pointer hover:underline"
                            >
                              {order?.TrackId}
                            </span>
                          ) : (
                            <Button
                              variant="gradient"
                              onClick={() => handleOpenTrackId(order._id)}
                              className="bg-secondary shadow-none text-white font-custom capitalize font-normal 
                                text-xs border border-gray-700 rounded-3xl px-3 py-2 hover:shadow-none"
                            >
                              Set Track ID
                            </Button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>

            {!editStatusBtn ? (
              <></>
            ) : (
              <div className='flex items-center justify-center'>
                <Button onClick={handleOpenOrderStatus} className='bg-buttonBg font-custom capitalize font-normal text-sm'>Change Status</Button>
              </div>
            )}

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
                {[...Array(Math.ceil(orderList.length / itemsPerPage))].map((_, index) => (
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
                disabled={currentPage === Math.ceil(orderList.length / itemsPerPage)}
              >
                Next page
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      <OrderStatusModal
        open={openOrderStatus}
        handleOpen={handleOpenOrderStatus}
        selectOrder={selectOrder}
        setOrderList={setOrderList}
        orderList={orderList}
        setSelectOrder={setSelectOrder}
      />

      <ViewOrdersModal
        handleOpen={handleOpenViewOrders}
        open={openViewOrders}
        getUserOrders={getUserOrders} />

      <TrackIdModal
        handleOpen={handleOpenTrackId}
        open={trackId}
        selectedOrderId={selectedOrderId}
        fetchOrderList={fetchOrderList}
      />

      <EditTrackIdModal
        handleOpen={handleOpenEditTrackIdModal}
        open={editTrackId}
        initialTrackId={initialTrackId}
        selectedOrderId={selectedOrderId}
        fetchOrderList={fetchOrderList}
      />

    </>
  );
};

export default OrderTable;
