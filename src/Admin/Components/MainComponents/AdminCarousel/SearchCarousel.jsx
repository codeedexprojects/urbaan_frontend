import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { AppContext } from '../../../../StoreContext/StoreContext'
import axios from 'axios'
import { useEffect } from 'react'

const SearchCarousel = ({ setAdminCarousel }) => {
    const [searchCarousel, setSearchCarousel] = useState('')
    const { BASE_URL } = useContext(AppContext);
    const token = localStorage.getItem('token')

    //handle search carousel
    useEffect(() => {
        const handleSearchCarousel = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/slider/search?name=${searchCarousel}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setAdminCarousel(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        handleSearchCarousel()
    }, [searchCarousel])
    return (
        <>
            <div className="border border-gray-300 py-1 px-2 flex items-center gap-1 rounded-xl bg-white h-12 w-96">
                <RiSearch2Line className="text-gray-700 text-xl" />
                <input
                    type="search"
                    name="search"
                    value={searchCarousel}
                    onChange={(e) => setSearchCarousel(e.target.value)}
                    placeholder="Search Category"
                    className="bg-transparent placeholder:text-gray-700 placeholder:text-base focus:outline-none text-secondary w-full"
                />
            </div>
        </>
    )
}

export default SearchCarousel
