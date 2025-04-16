import { Button, Card } from '@material-tailwind/react'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../../StoreContext/StoreContext'
import toast from 'react-hot-toast'

const AddUserAddress = () => {
    const navigate = useNavigate()
    const { BASE_URL } = useContext(AppContext)
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [address, setAddress] = useState('')
    const [landMark, setLandMark] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [addressType, setAddressType] = useState('home')
    const [defaultAddress, setDefaultAddress] = useState(false) // default address state

    const createAddressFormSubmit = async (e) => {
        e.preventDefault()

        // Ensure phone number is exactly 10 digits and does not contain alphabets
        const phoneNumberRegex = /^[0-9]{10}$/;

        if (!phoneNumberRegex.test(number)) {
            toast.error(`${number} is not a valid phone number.`);
            return;
        }

        const pinCodeRegex = /^[0-9]{6}$/;

        if (!pinCodeRegex.test(pinCode)) {
            toast.error("Pin code should be exactly 6 digits.");
            return;
        }

        try {
            const token = localStorage.getItem('userToken')
            const userId = localStorage.getItem('userId')

            // Append to formdata
            const rowData = {
                userId: userId,
                name: name,
                number: number,
                address: address,
                landmark: landMark,
                pincode: pinCode,
                city: city,
                state: state,
                addressType: addressType,
                defaultAddress: defaultAddress, // Use the state value for defaultAddress
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/user/address/add`, rowData, { headers })
            console.log(response.data)
            toast.success("Address added successfully")
            navigate('/select-delivery-address')
        } catch (error) {
            console.log(error)
            alert("Error in form submission:", error.response?.message || "Unknown error")
        }
    }

    return (
        <>
            <div className="bg-white shadow-md py-4 px-4 w-full sticky top-0 z-50">
                <h1
                    className="flex items-center gap-2 text-xl font-medium cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" />Add Delivery Address
                </h1>
            </div>

            <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <div className='flex justify-center items-center'>
                    <Card className='p-5 w-[600px]'>
                        <form action="" className="space-y-5 mt-3" onSubmit={createAddressFormSubmit}>
                            {/* Name */}
                            <div className="flex flex-col gap-1 w-full">
                                <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            {/* Number */}
                            <div className="flex flex-col gap-1 w-full">
                                <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base">
                                    Phone Number
                                </label>
                                <input
                                    type="number"
                                    name="number"
                                    id="number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder="Enter your phone number"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            {/* Address */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Address (House No, Building, Street, Area )"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    name="landmark"
                                    id="landmark"
                                    value={landMark}
                                    onChange={(e) => setLandMark(e.target.value)}
                                    placeholder="Landmark"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
                                />
                                <input
                                    type="number"
                                    name="pincode"
                                    id="pincode"
                                    value={pinCode}
                                    onChange={(e) => setPinCode(e.target.value)}
                                    placeholder="Pin code"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            {/* City */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Enter your city"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>
                            {/* State */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    id="state"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="Enter your state"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
                                />
                            </div>

                            {/* Address Type Buttons */}
                            <div className='flex items-center gap-3'>
                                <Button onClick={() => setAddressType("home")} variant='outlined' className={`text-secondary border-secondary font-custom text-sm capitalize 
                                    ${addressType === "home" ? "text-primary border-primary text-opacity-100 shadow-none" : ""}`}>Home</Button>
                                <Button onClick={() => setAddressType("work")} variant='outlined' className={`text-secondary border-secondary font-custom text-sm capitalize 
                                    ${addressType === "work" ? "text-primary border-primary text-opacity-100 shadow-none" : ""}`}>Work</Button>
                                <Button onClick={() => setAddressType("other")} variant='outlined' className={`text-secondary border-secondary font-custom text-sm capitalize 
                                    ${addressType === "other" ? "text-primary border-primary text-opacity-100 shadow-none" : ""}`}>Other</Button>
                            </div>

                            {/* Default Address Checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={defaultAddress}
                                    onChange={() => setDefaultAddress(!defaultAddress)}
                                    id="defaultAddress"
                                    className="h-4 w-4"
                                />
                                <label htmlFor="defaultAddress" className="font-medium text-sm xl:text-base lg:text-base">Set as Default Address</label>
                            </div>

                            {/* Submit Button */}
                            <div className='mb-3'>
                                <Button type='submit' className='bg-primary font-custom text-sm capitalize w-full font-normal'>Save Address</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default AddUserAddress
