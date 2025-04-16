import React from 'react';
import StoreContext from './StoreContext/StoreContext'; // Ensure correct import
import FullRoutes from './Routes';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from 'react-hot-toast';
import "./App.css"

const App = () => {

  return (
    <StoreContext>
      <Toaster
        position="top-center"
        containerClassName="!z-[99999]"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 1000,
          style: {
            textTransform: 'capitalize',
            fontSize:'15px',
            fontWeight: 600,
            maxWidth: '650px',
            width: 'auto',
            padding: '14px',
            height: 'auto',
          },
        }}
      />
      <FullRoutes />
    </StoreContext>
  );
};

export default App;
