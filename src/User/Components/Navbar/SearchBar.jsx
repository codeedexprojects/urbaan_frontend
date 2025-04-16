import axios from 'axios'
import React, { useEffect, useContext } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { AppContext } from '../../../StoreContext/StoreContext'

const SearchBar = () => {
    const { BASE_URL, setSearchedProducts, searchUser, setSearchUser } = useContext(AppContext)

    useEffect(() => {
        const fetchUserSearchProducts = async () => {
            if (searchUser.trim() === '') {
                return setSearchedProducts([]); // Clear results if search is empty
            }
            try {
                const response = await axios.get(`${BASE_URL}/user/search/view?query=${searchUser}`)
                setSearchedProducts(response.data.products) // Setting the search results
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserSearchProducts()
    }, [searchUser, BASE_URL, setSearchedProducts])

    return (
        <div className='xl:w-[450px] lg:w-[450px]'>
            <ul>
                <li className='w-full flex items-center gap-2 text-sm p-2 rounded-full placeholder:font-normal bg-searchUser placeholder:text-gray-700'>
                    <RiSearch2Line className='text-gray-600 text-xl' />
                    <input
                        type="search"
                        name="search"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        placeholder='Search Products, Brands, Categories...'
                        className='bg-transparent placeholder:text-gray-600 placeholder:text-sm font-light focus:outline-none text-secondary w-full'
                    />
                </li>
            </ul>
        </div>
    )
}

export default SearchBar
