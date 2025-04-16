import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { AppContext } from '../../../../StoreContext/StoreContext'

const CouponsSearchBar = ({ setAdminCoupon }) => {
  const [searchCoupon, setSearchCoupon] = useState('')
  const { BASE_URL } = useContext(AppContext)

  // search coupons
  useEffect(() => {
    const fetchSearchedCoupons = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/admin/coupon/search?code=${searchCoupon}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAdminCoupon(response.data.coupons)
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSearchedCoupons()
  }, [searchCoupon])

  return (
    <>
      <div className="border border-gray-300 py-1 px-2 flex items-center gap-1 rounded-xl bg-white h-12 w-96">
        <RiSearch2Line className="text-gray-700 text-xl" />
        <input
          type="search"
          name="search"
          value={searchCoupon}
          onChange={(e) => setSearchCoupon(e.target.value)}
          placeholder="Search by coupon code & name"
          className="bg-transparent placeholder:text-gray-700 placeholder:text-base focus:outline-none text-secondary w-full"
        />
      </div>
    </>
  )
}

export default CouponsSearchBar
