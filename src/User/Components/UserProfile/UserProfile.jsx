import React from 'react'
import { RiUser3Line } from "react-icons/ri";
import { Link, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../../StoreContext/StoreContext';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import UserOrders from './UserOrders'
import UserAddress from './UserAddress'
import UserWishlist from './UserWishlist';
import UserDash from './UserDash';
import UserLogout from './UseLogout'

const UserProfile = () => {
  const { BASE_URL, profile, setProfile } = useContext(AppContext)
  const [userDash, setUserDash] = useState('dashboard')

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        return;
      }
      try {
        const response = await axios.get(`${BASE_URL}/user/profile/view/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setProfile(response.data.user || null)
        console.log(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserProfile()
  }, [])

  return (
    <>
      <div className="p-4 xl:p-16 lg:p-16 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto hide-scrollbar">
        {!token ? (
          <>
            <div className='flex justify-center items-center h-[50vh]'>
              <div className='flex flex-col justify-center items-center space-y-1'>
                <RiUser3Line className='text-[200px] xl:text-[300px] lg:text-[300px] text-gray-500' />
                <p className='font-semibold xl:text-2xl lg:text-2xl'>No account yet ?</p>
                <Link to='/login-user'>
                  <p className='uppercase xl:text-4xl lg:text-4xl underline underline-offset-8 text-primary'>create an account</p>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 !gap-y-10 xl:gap-5 lg:gap-5 xl:h-full lg:h-full'>
              <div className='xl:border-r-[1px] lg:border-r-[1px] border-gray-300 xl:pr-5 lg:pr-5 border-b-[1px] pb-5 xl:border-b-0 lg:border-b-0 xl:pb-0 lg:pb-0'>
                <h1 className='uppercase font-semibold pb-2 text-secondary border-b-[1px] border-gray-300'>my account</h1>
                <ul className='mt-5 capitalize space-y-1'>
                  {['dashboard', 'orders', 'address', 'wishlist', 'logout'].map((item) => (
                    <li
                      key={item}
                      onClick={() => setUserDash(item)}
                      className={`cursor-pointer p-3 rounded-md transition-all duration-300 ease-in-out ${userDash === item ? 'bg-searchUser shadow-none py-5' : ''
                        }`}
                    >
                      {item === 'dashboard' || item === 'logout' ? item : `my ${item}`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='col-span-2 h-[calc(100vh-4rem)] pb-0 xl:pb-20 lg:pb-20 overflow-y-auto hide-scrollbar'>
                {userDash === 'dashboard' && <UserDash profile={profile} setUserDash={setUserDash} />}
                {userDash === 'orders' && <UserOrders />}
                {userDash === 'address' && <UserAddress />}
                {userDash === 'wishlist' && <UserWishlist />}
                {userDash === 'logout' && <UserLogout setUserDash={setUserDash} />}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default UserProfile
