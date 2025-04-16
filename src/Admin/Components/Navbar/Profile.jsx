import React from 'react'
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { AiOutlineLogin } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem('userId');
    navigate("/admin-login")
    toast.success("Logout successfully")
  }

  return (
    <>

      <Menu placement='bottom-end'>
        <MenuHandler>
          <div className='flex items-center gap-2'>
            <Avatar
              variant="circular"
              alt="tania andrew"
              className="cursor-pointer"
              src="/admin.png"
            />
            <p className='text-sm text-secondary font-normal'>Admin</p>
          </div>
        </MenuHandler>
        <MenuList className='rounded-xl shadow-md !w-[50px] py-2 px-0 !m-0'>
          <MenuItem className="px-7">
            <Typography onClick={handleLogout} variant="small" className="font-medium font-custom flex items-center gap-2 text-deleteBg">
              <AiOutlineLogout className='text-2xl' />
              Log Out
            </Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

export default Profile
