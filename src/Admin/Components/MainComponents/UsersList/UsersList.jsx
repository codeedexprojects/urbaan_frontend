import React from 'react'
import UsersListSearchBar from './UsersListSearchBar'
import UsersListTable from './UsersListTable'
import { useState } from 'react';

const UsersList = () => {
  const [userList, setUserList] = useState([]);
  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">Users List</h1>
      <div className='space-y-5 mt-5'>
        <div>
          <UsersListSearchBar setUserList={setUserList} />
        </div>
        <div>
          <UsersListTable userList={userList} setUserList={setUserList} />
        </div>
      </div>
    </>
  )
}

export default UsersList
