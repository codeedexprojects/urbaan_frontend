import React from 'react';
import Overview from './Overview';
import SalesGraph from './SalesGraph';
import RecentOrders from './RecentOrders';

const Dashboard = () => {
    return (
        <div className='p-4'>
            <h1 className='text-3xl font-semibold mb-6'>Dashboard</h1>
            <div className='space-y-10'>
                <Overview />
                <SalesGraph />
                <RecentOrders />
            </div>
        </div>
    )
}

export default Dashboard;