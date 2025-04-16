import React from 'react'
import OrderFilter from './OrderFilter'
import OrderTable from './OrderTable'
import { useState } from 'react';

const OrderList = () => {
  const [orderList, setOrderList] = useState([]);

  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">Order Lists</h1>
      <div className='space-y-5 mt-5'>
        <div>
          <OrderFilter setOrderList={setOrderList} />
        </div>
        <div>
          <OrderTable
            orderList={orderList}
            setOrderList={setOrderList}
          />
        </div>
      </div>
    </>
  )
}

export default OrderList
