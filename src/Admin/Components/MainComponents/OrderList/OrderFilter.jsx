import React, { useState, useEffect, useContext } from 'react';
import { ImFilter } from 'react-icons/im';
import { PiArrowCounterClockwiseBold } from 'react-icons/pi';
import FilterDate from '../../FilterDate/FilterDate';
import FilterCategory from '../../FilterCategory/FilterCategory';
import { FilterOrderStatus } from '../../FilterOrderStatus/FilterOrderStatus';
import { AppContext } from '../../../../StoreContext/StoreContext';
import axios from 'axios';
import { Button } from '@material-tailwind/react';

const OrderFilter = ({ setOrderList }) => {
    const { BASE_URL } = useContext(AppContext);
    const [resetFilter, setResetFilter] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
        categoryIds: []
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFilteredOrders = async () => {
            try {
                const queryParams = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key]) queryParams.append(key, filters[key]);
                });

                const response = await axios.get(`${BASE_URL}/admin/orderlist/filter?${queryParams.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrderList(response.data);
                console.log(response.data);

            } catch (error) {
                console.error('Error fetching filtered orders:', error);
            }
        };

        fetchFilteredOrders();
    }, [filters, BASE_URL, setOrderList, resetFilter]);

    // Reset filters
    const resetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            status: '',
            categoryIds: []
        });
        setResetFilter(prev => !prev);
    };

    return (
        <div className='flex items-center gap-1'>
            <ul className='flex items-center gap-1 text-secondary'>
                <li className='bg-white border-[1px] border-gray-300 rounded-full p-1 w-12 h-12 flex items-center justify-center'>
                    <ImFilter />
                </li>
                <li className='bg-white font-normal text-base border-[1px] border-gray-300 rounded-xl p-1 w-24 h-12 flex items-center justify-center'>Filter by</li>
                <li>
                    <FilterDate
                        setFilters={setFilters}
                        resetFilter={resetFilter}
                        filterKeys={{ start: 'startDate', end: 'endDate' }}
                    />
                </li>
                {/* <li>
                    <FilterCategory setFilters={setFilters} resetFilter={resetFilter} />
                </li> */}
                <li>
                    <FilterOrderStatus setFilters={setFilters} resetFilter={resetFilter} />
                </li>
            </ul>
            <Button
                onClick={resetFilters}
                className='bg-white font-custom capitalize shadow-none hover:shadow-none cursor-pointer font-normal text-base border-[1px] border-gray-300 rounded-xl p-1 w-32 h-12 flex items-center justify-center gap-1 text-red-500 hover:text-primary'
            >
                <PiArrowCounterClockwiseBold />
                Reset Filter
            </Button>
        </div>
    );
};

export default OrderFilter;
