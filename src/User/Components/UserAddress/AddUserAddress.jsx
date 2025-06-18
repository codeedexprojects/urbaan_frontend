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
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [number, setNumber] = useState('')
    const [address, setAddress] = useState('')
    const [area, setArea] = useState('')
    const [landMark, setLandMark] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [addressType, setAddressType] = useState('home')
    const [defaultAddress, setDefaultAddress] = useState(false)
    const [pinCodeError, setPinCodeError] = useState('')
    const [isValidatingPin, setIsValidatingPin] = useState(false)

    const indianStates = [
        'ANDHRA PRADESH',
        'ARUNACHAL PRADESH',
        'ASSAM',
        'BIHAR',
        'CHHATTISGARH',
        'GOA',
        'GUJARAT',
        'HARYANA',
        'HIMACHAL PRADESH',
        'JHARKHAND',
        'KARNATAKA',
        'KERALA',
        'MADHYA PRADESH',
        'MAHARASHTRA',
        'MANIPUR',
        'MEGHALAYA',
        'MIZORAM',
        'NAGALAND',
        'ODISHA',
        'PUNJAB',
        'RAJASTHAN',
        'SIKKIM',
        'TAMIL NADU',
        'TELANGANA',
        'TRIPURA',
        'UTTAR PRADESH',
        'UTTARAKHAND',
        'WEST BENGAL',
        'ANDAMAN AND NICOBAR ISLANDS',
        'CHANDIGARH',
        'DADRA AND NAGAR HAVELI AND DAMAN AND DIU',
        'DELHI',
        'JAMMU AND KASHMIR',
        'LADAKH',
        'LAKSHADWEEP',
        'PUDUCHERRY'
    ]

    const validatePinCode = async (pin) => {
        if (!pin || pin.length !== 6) {
            setPinCodeError('PIN code must be 6 digits')
            return false
        }

        setIsValidatingPin(true)
        try {
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pin}`)
            const data = response.data[0] // API returns an array with one object

            if (data.Status === 'Error') {
                setPinCodeError('Invalid PIN code')
                return false
            }

            if (data.Status === 'Success') {
                setPinCodeError('')
                // Auto-fill city and state if available
                if (data.PostOffice && data.PostOffice.length > 0) {
                    const firstPostOffice = data.PostOffice[0]
                    setCity(firstPostOffice.District || '')
                    setState(firstPostOffice.State?.toUpperCase() || '')
                }
                return true
            }

            return false
        } catch (error) {
            console.error('PIN code validation error:', error)
            setPinCodeError('Error validating PIN code')
            return false
        } finally {
            setIsValidatingPin(false)
        }
    }

    const handlePinCodeBlur = async () => {
        if (pinCode.length === 6) {
            await validatePinCode(pinCode)
        }
    }

    const createAddressFormSubmit = async (e) => {
        e.preventDefault()

        // Validate phone number
        const phoneNumberRegex = /^[0-9]{10}$/;
        if (!phoneNumberRegex.test(number)) {
            toast.error(`${number} is not a valid phone number.`);
            return;
        }

        // Validate PIN code before submission
        const isPinValid = await validatePinCode(pinCode)
        if (!isPinValid) {
            return
        }

        try {
            const token = localStorage.getItem('userToken')
            const userId = localStorage.getItem('userId')

            const rowData = {
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                number: number,
                address: address,
                area: area,
                landmark: landMark,
                pincode: pinCode,
                city: city,
                state: state,
                country:country,
                addressType: addressType,
                defaultAddress: defaultAddress,
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
            toast.error(error.response?.data?.message || "Error adding address")
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
                            {/* First Name and Last Name in same row */}
                            <div className="flex gap-5 w-full">
                                {/* First Name */}
                                <div className="flex flex-col gap-1 w-1/2">
                                    <label htmlFor="firstName" className="font-medium text-sm xl:text-base lg:text-base">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value.toUpperCase())}
                                        placeholder="Enter your first name"
                                        required
                                        className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="flex flex-col gap-1 w-1/2">
                                    <label htmlFor="lastName" className="font-medium text-sm xl:text-base lg:text-base">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value.toUpperCase())}
                                        placeholder="Enter your last name"
                                        required
                                        className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
                                    />
                                </div>
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
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
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
                                    onChange={(e) => setAddress(e.target.value.toUpperCase())}
                                    placeholder="Flat No, House No, Building, Company..."
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
                                />
                                <input
                                    type="text"
                                    name="area"
                                    id="area"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value.toUpperCase())}
                                    placeholder="Area, Street, Sector, Village..."
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
                                />


                                <input
                                    type="text"
                                    name="landmark"
                                    id="landmark"
                                    value={landMark}
                                    onChange={(e) => setLandMark(e.target.value.toUpperCase())}
                                    placeholder="Landmark"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
                                />
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="pincode"
                                        id="pincode"
                                        value={pinCode}
                                        onChange={(e) => setPinCode(e.target.value)}
                                        onBlur={handlePinCodeBlur}
                                        placeholder="Pin code"
                                        required
                                        className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none w-full uppercase"
                                    />
                                    {isValidatingPin && (
                                        <span className="absolute right-3 top-2.5 text-xs text-gray-500">Validating...</span>
                                    )}
                                </div>
                                {pinCodeError && (
                                    <p className="text-red-500 text-xs">{pinCodeError}</p>
                                )}
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
                                    onChange={(e) => setCity(e.target.value.toUpperCase())}
                                    placeholder="Enter your city"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
                                />
                            </div>
                            {/* State Dropdown */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="state" className="font-medium text-sm xl:text-base lg:text-base">
                                    State
                                </label>
                                <select
                                    name="state"
                                    id="state"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md text-sm focus:outline-none uppercase"
                                >
                                    <option value="">SELECT YOUR STATE</option>
                                    {indianStates.map((stateName, index) => (
                                        <option key={index} value={stateName}>
                                            {stateName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="font-medium text-sm xl:text-base lg:text-base">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    id="country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value.toUpperCase())}
                                    placeholder="Enter your country"
                                    required
                                    className="border-[1px] bg-transparent border-gray-400 p-2 rounded-md placeholder:text-sm placeholder:text-gray-500 focus:outline-none uppercase"
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
                                <Button
                                    type='submit'
                                    className='bg-primary font-custom text-sm capitalize w-full font-normal'
                                    disabled={isValidatingPin || !!pinCodeError}
                                >
                                    Save Address
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default AddUserAddress