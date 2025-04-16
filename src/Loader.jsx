import React from 'react';
import Loader from "react-js-loader";

const AppLoader = () => {
    const color = "#C21E56"; 

    return (
        <>
            <div >
                <Loader type="ping-cube" bgColor={color} size={60} />
            </div>
        </>
    );
};

export default AppLoader;
