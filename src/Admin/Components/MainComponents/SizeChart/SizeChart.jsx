import React from 'react';
import SizeChartSearchBar from './SearchSize';
import SizeChartTable from './SizeChartTable';
import { Button } from '@material-tailwind/react';
import { FaPlus } from 'react-icons/fa6';
import { useContext } from 'react';
import { AppContext } from "../../../../StoreContext/StoreContext";
import { AddSizeChartModal } from './AddSizeChartModel';
import { useState } from 'react';

const SizeCharts = () => {
  const { open, handleOpen } = useContext(AppContext);
  const [adminSizeCharts, setAdminSizeCharts] = useState([]);

  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">Size Charts</h1>
      <div className='space-y-5 mt-5'>
        <div className='flex items-center gap-2'>
          <SizeChartSearchBar setAdminSizeCharts={setAdminSizeCharts} />
          <Button 
            onClick={() => handleOpen("addSizeChartModal")} 
            className='flex items-center gap-1 bg-buttonBg font-custom font-normal text-sm'
          >
            <FaPlus />Add Size Chart
          </Button>
        </div>
        <div>
          <SizeChartTable
            adminSizeCharts={adminSizeCharts}
            setAdminSizeCharts={setAdminSizeCharts}
          />
        </div>
      </div>

      <AddSizeChartModal
        open={open === "addSizeChartModal"}
        handleOpen={handleOpen}
        setAdminSizeCharts={setAdminSizeCharts}
      />
    </>
  );
}

export default SizeCharts;