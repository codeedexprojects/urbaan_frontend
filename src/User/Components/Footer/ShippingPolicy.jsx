import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="py-10 px-6 md:px-20 lg:px-40">
            <h1 className="text-center text-3xl font-bold mb-8">Shipping Policy</h1>
            <p className="mb-4 text-sm text-gray-600">Last Updated: 22 APRIL 2025</p>
            
            <div className="space-y-4">
                <p>We ship our products once the order and payment is confirmed. We use third-party shipping services to ship the items across India. Delays are to be expected in case of contingency.</p>
                
                <p>We ship the products within a day or two. Working day.</p>
                
                <p>Tracking id will be send to your email id, you can track the courier directly from courier service.</p>
                
                <p>If there is any delay in courier due to the issues courier service URBAAN COLLECTIONS is not responsible.</p>
                
                <p>Do not receive the item if the package is damaged. If so report it in respective courier or postal office.</p>
            </div>
        </div>
    );
};

export default ShippingPolicy;