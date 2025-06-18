import { Button, Card, Radio } from '@material-tailwind/react'
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import { GoPlus } from "react-icons/go";
import { useContext } from 'react';
import { AppContext } from '../../../StoreContext/StoreContext';
import { RemoveAddressModal } from './RemoveAddressModal';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import AppLoader from '../../../Loader';
import toast from 'react-hot-toast';

const SelectUserAddress = () => {
    const navigate = useNavigate()
    const { BASE_URL, getAddress, setGetAddress } = useContext(AppContext)
    // const [getAddress, setGetAddress] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [openRemoveModal, setOpenRemoveModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState(null);

    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('userToken')

    // remove address modal
    const handleOpenRemoveModal = (addressId) => {
        setOpenRemoveModal(!openRemoveModal);
        setSelectedId(addressId)
        console.log(addressId);
    }

    //fetch user address
    const fetchAddress = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/address/view/${userId}`, {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })
            setIsLoading(false)
            setGetAddress(response.data)
            console.log(response.data);
        } catch (error) {
            console.log(error);
            if(error.response.data.message){
                setIsLoading(false)
            }
            console.log(error.response.data.message);
            
        }
        // finally {
        //     setIsLoading(false); // Ensure this is called after the data is fetched
        // }
    }
    useEffect(() => {
        fetchAddress();
    }, [])

    const handleRemoveAddress = async (addressId) => {
        try {
            const token = localStorage.getItem('userToken')

            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/user/address/delete/${addressId}`, { headers })
            console.log(response.data);
            handleOpenRemoveModal()
            toast.success('Address is deleted')
            setGetAddress(prevAddresses => prevAddresses.filter(address => address._id !== addressId));
        } catch (error) {
            console.log(error);
        }
    }

    const handleContinue = () => {
        const defaultAddress = getAddress.find(address => address.defaultAddress === true) || getAddress[0];
        navigate('/user-cart',
            {
                state: {
                    selectedAddress: selectedAddress || defaultAddress,
                }
            });
    }


    return (
        <>
            <div className="bg-white shadow-md py-4 px-4 w-full sticky top-0">
                <h1
                    className="flex items-center gap-2 text-xl font-medium cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" />Select Delivery Address
                </h1>
            </div>
            <div className="p-4 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-5">
                    {
                        isLoading ? (
                            <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                                <AppLoader />
                            </div>
                        ) : getAddress?.length === 0 ? (
                            <>
                                <div className='col-span-2 flex justify-center items-center'>
                                    <div className='w-96 h-96'>
                                        <img src="/no-address.png" alt="" className='w-full h-full object-cover' />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {getAddress.map((address) => (
                                    <Card className='p-4 xl:p-10 lg:p-10' key={address._id}>
                                        <div className='flex justify-between'>
                                            <div>
                                                <h1 className='text-secondary font-bold capitalize'>{address.addressType}</h1>
                                                <p className='text-sm capitalize'>{address.address},{address.area}, {address.landmark}, {address.city}, {address.state},{address.country}, {address.pincode}</p>
                                                <div className='mt-3 flex items-center gap-2'>
                                                    <Link to={{
                                                        pathname: '/edit-delivery-address'
                                                    }}
                                                        state={{ address }}
                                                    >
                                                        <Button variant='outlined' className='text-shippedBg border-shippedBg font-normal 
                                                        text-xs py-1 px-6 capitalize font-custom'>Edit</Button>
                                                    </Link>
                                                    <Button onClick={() => handleOpenRemoveModal(address._id)} variant='outlined' className='text-deleteBg border-deleteBg font-normal 
                                                        text-xs py-1 px-6 capitalize font-custom'>Remove</Button>
                                                </div>
                                            </div>
                                            <div>
                                                <Radio
                                                    name="address"
                                                    color="pink"
                                                    className="border-primary border-2"
                                                    checked={selectedAddress?._id === address._id}
                                                    onChange={() => setSelectedAddress(address)}
                                                />
                                            </div>
                                        </div >
                                    </Card >
                                ))}
                            </>
                        )
                    }
                </div >

                <div className='mt-5 flex flex-col xl:flex-row lg:flex-row gap-2 justify-normal xl:justify-center xl:items-center'>
                    <Link to='/add-delivery-address'><Button variant='outlined' className='w-full xl:w-52 lg:w-52 border-primary text-primary text-sm capitalize font-custom 
                    font-normal flex items-center gap-2 justify-center'><GoPlus />Add new address</Button></Link>
                    <Button onClick={handleContinue} className='w-full xl:w-52 lg:w-52 bg-primary text-white text-sm capitalize font-custom 
                    font-normal'>Continue</Button>
                </div>
            </div >

            <RemoveAddressModal
                openRemoveModal={openRemoveModal}
                handleOpenRemoveModal={handleOpenRemoveModal}
                handleDelete={handleRemoveAddress}
                addressId={selectedId}
            />
        </>
    )
}

export default SelectUserAddress
