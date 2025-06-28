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
import namer from 'color-namer';


const TABLE_HEAD = ["ID", "Customer", "Address", "Order Date", "Payment", "Total Price", "Status", "Orders", "Track ID", "Actions"];

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
  const [expandedAddresses, setExpandedAddresses] = useState({});

  const toggleAddress = (orderId) => {
    setExpandedAddresses(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };


  // Shop address - you can modify this as needed
  const SHOP_ADDRESS = {
    name: "URBAAN Collections",
    address: "3rd Floor, Oberon Mall, Edappally",
    city: "Ernakulam",
    state: "Kerala",
    pincode: "682024",
    phone: "+91 9847820705",
    email: "chimsuc@gmail.com"
  };

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

  // Print functionality
  const handlePrintOrder = (order) => {
    const getNamedColor = (colorCode) => {
      try {
        const namedColors = namer(colorCode);
        return namedColors.ntc[0]?.name || "Unknown Color";
      } catch (error) {
        console.error("Invalid color code:", error);
        return "Invalid Color";
      }
    };


    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Invoice - ${order.orderId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
          }
          .addresses {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
          }
          .address-block {
            width: 45%;
          }
          .address-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
            color: #2c5aa0;
          }
          .address-content {
            line-height: 1.6;
            font-size: 14px;
          }
          .order-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .order-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .order-table th,
          .order-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .order-table th {
            background-color: #2c5aa0;
            color: white;
            font-weight: bold;
          }
          .order-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
          }
          .product-details {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }
          .color-indicator {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 8px;
            vertical-align: middle;
            border: 1px solid #ddd;
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #333;
          }
          .total-amount {
            font-size: 18px;
            font-weight: bold;
            color: #2c5aa0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .invoice-container { max-width: none; }
            .no-print { display: none !important; }
          }
          .print-button {
            background-color: #2c5aa0;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="company-name">${SHOP_ADDRESS.name}</div>
          </div>
          
          <div class="addresses">
            <div class="address-block">
              <div class="address-title">From:</div>
              <div class="address-content">
                <strong>${SHOP_ADDRESS.name}</strong><br>
                ${SHOP_ADDRESS.address}<br>
                ${SHOP_ADDRESS.city}, ${SHOP_ADDRESS.state} - ${SHOP_ADDRESS.pincode}<br>
                Phone: ${SHOP_ADDRESS.phone}<br>
                Email: ${SHOP_ADDRESS.email}
              </div>
            </div>
            
           <div class="address-block">
  <div class="address-title">To:</div>
  <div class="address-content">
    <strong>${order.addressDetails?.firstName || 'N/A'} ${order.addressDetails?.lastName || ''}</strong><br>
    ${order.addressDetails?.address || 'N/A'}<br>
    ${order.addressDetails?.area ? `${order.addressDetails.area}, ` : ''}
    ${order.addressDetails?.city || ''} ${order.addressDetails?.state || ''}<br>
    ${order.addressDetails?.pincode || ''}<br>
    ${order.addressDetails?.landmark ? `Landmark: ${order.addressDetails.landmark}<br>` : ''}
    Phone: ${order.addressDetails?.number || order.userId?.phone || 'N/A'}
  </div>
</div>
          </div>
          
          <div class="order-info">
            <div class="order-info-row">
              <span><strong>Order ID:</strong></span>
              <span>${order.orderId}</span>
            </div>
            <div class="order-info-row">
              <span><strong>Order Date:</strong></span>
              <span>${new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}</span>
            </div>
            <div class="order-info-row">
              <span><strong>Payment Method:</strong></span>
              <span>${order.paymentMethod}</span>
            </div>
            <div class="order-info-row">
              <span><strong>Order Status:</strong></span>
              <span>${order.status}</span>
            </div>
            ${order.TrackId ? `
            <div class="order-info-row">
              <span><strong>Tracking ID:</strong></span>
              <span>${order.TrackId}</span>
            </div>
            ` : ''}
          </div>
          
          <table class="order-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Color & Size</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.products?.map(product => {
      // Try different ways to access the price
      const unitPrice = product.price || product.productId?.price || 0;
      const quantity = product.quantity || 1;
      const totalPrice = unitPrice * quantity;

      return `
                <tr>
                  <td>
                    <img src="${product.productId?.images?.[0] || '/no-image.jpg'}" 
                         alt="${product.productId?.title || 'Product Image'}" 
                         class="product-image"
                         onerror="this.src='/no-image.jpg'">
                  </td>
                  <td>
                    <strong>${product.productId?.title || 'Product'}</strong><br>
                    <div class="product-details">
                      Code: ${product.productId?.product_Code || 'N/A'}
                    </div>
                  </td>
                  <td>
                    ${product.color ? `
                      <div style="display: flex; align-items: center; margin-bottom: 4px;">
                        <span class="color-indicator" style="background-color: ${product.color};"></span>
                        <span>${getNamedColor(product.color)}</span>
                      </div>
                    ` : '<div>No Color</div>'}
                    ${product.size ? `<div><strong>Size:</strong> ${product.size}</div>` : ''}
                  </td>
                  <td style="text-align: center;">${quantity}</td>
                  <td>₹${Math.ceil(unitPrice).toFixed(2)}</td>
                  <td><strong>₹${Math.ceil(totalPrice).toFixed(2)}</strong></td>
                </tr>
              `;
    }).join('') || '<tr><td colspan="6">No products found</td></tr>'}
            </tbody>
          </table>
          
          <div class="total-section">
            
            
            <div class="total-amount">
              Total Amount: ₹${Math.ceil(order.finalPayableAmount || 0).toFixed(2)}
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with ${SHOP_ADDRESS.name}!</p>
            <p>For any queries, contact us at ${SHOP_ADDRESS.phone} or ${SHOP_ADDRESS.email}</p>
          </div>
        </div>

        <div class="no-print" style="text-align: center;">
          <button class="print-button" onclick="window.print()">Print Invoice</button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

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
                          <div className="w-48">
                            {order?.addressDetails ? (
                              <>
                                {/* Compact view */}
                                {!expandedAddresses[order._id] && (
                                  <Typography variant="small" className="font-normal font-custom text-sm line-clamp-1">
                                    {order.addressDetails.address}, {order.addressDetails.area}
                                  </Typography>
                                )}

                                {/* Expanded view */}
                                {expandedAddresses[order._id] && (
                                  <div className="text-sm space-y-1">
                                    <div className="font-medium">
                                      {order.addressDetails.firstName} {order.addressDetails.lastName}
                                    </div>
                                    <div>{order.addressDetails.address}, {order.addressDetails.area}</div>
                                    <div>{order.addressDetails.city}, {order.addressDetails.state} - {order.addressDetails.pincode}</div>
                                    {order.addressDetails.landmark && (
                                      <div className="text-gray-600">Landmark: {order.addressDetails.landmark}</div>
                                    )}
                                    <div className="text-gray-600">Phone: {order.addressDetails.number}</div>
                                  </div>
                                )}

                                {/* Toggle button */}
                                <button
                                  className="text-blue-500 hover:underline text-xs mt-1 focus:outline-none"
                                  onClick={() => toggleAddress(order._id)}
                                >
                                  {expandedAddresses[order._id] ? 'View Less' : 'View More'}
                                </button>
                              </>
                            ) : (
                              <Typography variant="small" className="font-normal font-custom text-sm">
                                Address not available
                              </Typography>
                            )}
                          </div>
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
                            ₹{Math.ceil(order?.finalPayableAmount)}
                          </Typography>
                        </td>


                        <td className={classes}>
                          <Chip
                            className={`capitalize text-sm text-center font-normal ${statusColors[order.status] || statusColors.default}`}
                            value={
                              order?.status === 'In-Transist'
                                ? 'dispatched'
                                : order.status === 'invoice_generated'
                                  ? 'Invoice Generated'
                                  : order.status === 'Cancelled'
                                    ? `Cancelled (${order.isRefunded ? 'Refunded' : 'Not Refunded'})`
                                    : order.status
                            }
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
                        <td className={classes}>
                          <Button
                            onClick={() => handlePrintOrder(order)}
                            className='bg-green-500 shadow-none text-white font-custom capitalize font-normal 
                              text-xs border border-gray-700 rounded-3xl px-3 py-2 hover:shadow-none hover:bg-green-600'
                          >
                            Print
                          </Button>
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