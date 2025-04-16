import React from 'react'
import UserDetails from './UserDetails'
import UserLargeImage from './UserLargeImage'
import UserOrdersTable from './UserOrdersTable'
import { IoIosArrowBack } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'

const ViewUserManagement = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { user } = location.state || []
  return (
    <>
      <p onClick={() => navigate(-1)} className='flex items-center cursor-pointer hover:text-primary'>
        <IoIosArrowBack /> Back</p>
      <h1 className='text-3xl font-semibold'>User Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mt-5">
        <div className="lg:col-span-2">
          <UserDetails user={user} />
        </div>
        <div className="lg:col-span-3 space-y-5">
          <UserLargeImage user={user} />
          <UserOrdersTable user={user}/>
        </div>
      </div>
    </>
  )
}

export default ViewUserManagement