import React, { useEffect, useState, useContext } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from '@material-tailwind/react';
import axios from 'axios';
import { AppContext } from '../../../StoreContext/StoreContext';
import AppLoader from '../../../Loader';

const UserAddress = () => {
    const navigate = useNavigate();
    const { BASE_URL } = useContext(AppContext);
    const [userAddresses, setUserAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserAddresses = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get(`${BASE_URL}/user/profile/view/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserAddresses(response.data.user.addresses || []);
                setIsLoading(false)
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserAddresses();
    }, []);

    return (
        <div>
            <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-4'>
                {isLoading ? (
                    <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                        <AppLoader />
                    </div>
                ) : userAddresses.length === 0 ? (
                    <>
                    <p className='col-span-2 flex items-center justify-center h-[80vh] xl:h-[50vh] lg:[50vh]'>No address found</p>
                    </>
                ):(
                    userAddresses.map((address) => (
                        <Card className='p-4' key={address._id}>
                            <div className='flex justify-between'>
                                <div>
                                    <h1 className='text-secondary font-bold capitalize'>{address.addressType}</h1>
                                    <p className='text-sm capitalize'>
                                        {address.address}, {address.landmark}, {address.city}, {address.state}
                                    </p>
                                    <div className='mt-3 flex items-center gap-2'>
                                        <Link to={{
                                            pathname: '/edit-delivery-address'
                                        }}
                                            state={{ address }}>
                                            <Button variant='outlined' className='text-shippedBg border-shippedBg font-normal font-custom text-xs py-1 px-6 capitalize'>Edit</Button>
                                        </Link>
                                        {/* <Button
                                            variant='outlined'
                                            className='text-deleteBg border-deleteBg font-normal font-custom text-xs py-1 px-6 capitalize'>
                                            Remove
                                        </Button> */}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserAddress;
