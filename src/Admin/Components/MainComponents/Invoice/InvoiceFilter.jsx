import React, { useState } from 'react';
import { ImFilter } from "react-icons/im";
import { PiArrowCounterClockwiseBold } from "react-icons/pi";
import FilterDate from '../../FilterDate/FilterDate';
import { FilterPaymentStatus } from '../../FilterPaymentStatus/FilterPaymentStatus';
import { useContext } from 'react';
import { AppContext } from '../../../../StoreContext/StoreContext';
import { useEffect } from 'react';
import axios from 'axios';
import { Button } from '@material-tailwind/react';

const InvoiceFilter = ({ setInvoice }) => {
    const { BASE_URL } = useContext(AppContext);
    const [resetFilter, setResetFilter] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: [],
    });

    useEffect(() => {
        const fetchFilteredInvoice = async () => {
            try {
                const queryParams = new URLSearchParams();
                Object.keys(filters).forEach((key) => {
                    if (filters[key]) queryParams.append(key, filters[key]);
                });

                console.log(`API Request: ${BASE_URL}/admin/invoice/filter?${queryParams.toString()}`);
                const response = await axios.get(`${BASE_URL}/admin/invoice/filter?${queryParams.toString()}`);
                console.log(response.data.invoices);
                setInvoice(response.data?.invoices);
            } catch (error) {
                console.error("Error fetching filtered invoices:", error);
            }
        };

        fetchFilteredInvoice();
    }, [filters, BASE_URL, setInvoice, resetFilter]);


    // handleClearAll
    const resetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            status: [],
        });
        setResetFilter(prev => !prev)
    };

    return (
        <>
            <div className='flex items-center gap-1'>
                <ul className="flex items-center gap-1 text-secondary">
                    <li className="bg-white border-[1px] border-gray-300 rounded-full p-1 w-12 h-12 flex items-center justify-center">
                        <ImFilter />
                    </li>
                    <li className="bg-white font-normal text-base border-[1px] border-gray-300 rounded-xl p-1 w-24 h-12 flex items-center justify-center">Filter by</li>
                    <li>
                        <FilterDate
                            setFilters={setFilters}
                            resetFilter={resetFilter}
                            filterKeys={{ start: 'startDate', end: 'endDate' }}
                        />
                    </li>

                    <li><FilterPaymentStatus setFilters={setFilters} resetFilter={resetFilter} /></li>
                </ul>
                <Button onClick={resetFilters} className="bg-white capitalize font-custom shadow-none hover:shadow-none cursor-pointer font-normal text-base border-[1px] border-gray-300 rounded-xl p-1 w-32 h-12 flex items-center justify-center gap-1 
                    text-red-500 hover:text-primary">
                    <PiArrowCounterClockwiseBold />
                    Reset Filter
                </Button>
            </div>
        </>
    )
}

export default InvoiceFilter