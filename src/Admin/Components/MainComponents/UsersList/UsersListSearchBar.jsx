import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { AppContext } from '../../../../StoreContext/StoreContext'

const UsersListSearchBar = ({ setUserList }) => {
    const [searchUser, setSearchUser] = useState('')
    const { BASE_URL } = useContext(AppContext);

    const token = localStorage.getItem('token')

    //handle search
    useEffect(() => {
        const handleUserSearch = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/users/search?email=${searchUser}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserList(response.data.users)
            } catch (error) {
                console.log(error);
            }
        }
        handleUserSearch()
    }, [searchUser])

    return (
        <>
            <div className="border border-gray-300 py-1 px-2 flex items-center gap-1 rounded-xl bg-white h-12 w-96">
                <RiSearch2Line className="text-gray-700 text-xl" />
                <input
                    type="search"
                    name="search"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Search for user"
                    className="bg-transparent placeholder:text-gray-700 placeholder:text-base focus:outline-none text-secondary w-full"
                />
            </div>
        </>
    )
}

export default UsersListSearchBar
