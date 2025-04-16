import { BarChart } from '@mui/x-charts';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppLoader from '../../../../Loader';
import { AppContext } from '../../../../StoreContext/StoreContext';
import PlaceMenu from "./PlaceMenu";
import MonthMenu from "./MonthMenu";

const SalesGraph = () => {
    const [graphData, setGraphData] = useState([]);
    const { BASE_URL } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchGraphDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/admin/dashboard/view-graph`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const formattedData = response.data.data.map(item => ({
                    x: item?.monthName,
                    y: item?.totalRevenue
                }));
                setGraphData(formattedData);
                setIsLoading(false)
            } catch (error) {
                console.log(error);
            }
        };
        fetchGraphDetails();
    }, [BASE_URL]);

    // Helper function to format month names
    const formatMonth = (month) => {
        const date = new Date(month + ' 1, 2020');  // Use any year for parsing
        return date.toLocaleString('en-US', { month: 'short' });
    };

    // Helper function to format revenue (e.g., 15000 -> 15k)
    const formatRevenue = (revenue) => {
        if (revenue >= 1000) {
            return `${(revenue / 1000).toFixed(0)}k`;
        }
        return revenue;
    };



    return (
        <div className='p-10 mt-10 bg-white rounded-xl shadow-md'>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-medium mb-0 text-secondary">Sales Details</h1>
                </div>
                <ul className="flex items-center gap-2">
                    <li><PlaceMenu setGraphData={setGraphData} /></li>
                    <li><MonthMenu setGraphData={setGraphData} /></li>
                </ul>
            </div>
            {isLoading ? (
                <div className="col-span-2 flex justify-center items-center h-[70vh]">
                    <AppLoader />
                </div>
            ) : graphData.length === 0 ? (
                <div className="text-center text-gray-500">
                    No data available for the selected filter.
                </div>
            ) : (
                <>
                    <div className='w-[100%]'>
                        <BarChart
                            xAxis={[{
                                data: graphData.map(item => formatMonth(item?.x)),
                                tickNumber: 12,
                                scaleType: 'band',
                                valueFormatter: (value) => value,
                            }]}
                            yAxis={[{
                                min: 0,
                                tickNumber: 5,
                                valueFormatter: (value) => formatRevenue(value),
                            }]}
                            series={[{
                                data: graphData.map(item => item?.y),
                                // curve: 'linear',
                                color: '#A3BDF5',
                            }]}
                            className="w-full"
                            height={500}
                            grid={{ vertical: false, horizontal: true }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default SalesGraph;
