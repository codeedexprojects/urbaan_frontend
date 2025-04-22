import React from 'react';
import { Input } from '@material-tailwind/react';

const SizeChartSearchBar = ({ setAdminSizeCharts }) => {
  return (
    <div className="w-full md:w-72">
      <Input
        label="Search size charts..."
        className="font-custom"
        // Add your search functionality here
      />
    </div>
  );
};

export default SizeChartSearchBar;