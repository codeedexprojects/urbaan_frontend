import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { FiChevronDown } from 'react-icons/fi';

const FilterDate = ({ setFilters, resetFilter, filterKeys = { start: 'startDate', end: 'endDate' } }) => {
    const [selectedDates, setSelectedDates] = useState([]);

    const handleDateChange = useCallback((value) => {
        setSelectedDates(value);
        setFilters((prev) => ({
            ...prev,
            [filterKeys.start]: value[0]?.format("DD-MM-YYYY") || '', // Dynamic key for start date
            [filterKeys.end]: value[1]?.format("DD-MM-YYYY") || '',  // Dynamic key for end date
        }));
    }, [setFilters, filterKeys]);

    // useEffect(() => {
    //     if (resetFilter) {
    //         setSelectedDates([]);
    //         setFilters((prev) => ({
    //             ...prev,
    //             [filterKeys.start]: '',
    //             [filterKeys.end]: '',
    //         }));
    //     }
    // }, [resetFilter, setFilters, filterKeys]);

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: '11px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
            }}
        >
            <DatePicker
                value={selectedDates}
                multiple
                max={2}
                placeholder="Select Date"
                highlightToday={false}
                onChange={handleDateChange}
                style={{
                    border: 'none',
                    height: '100%',
                    width: '100%',
                    outline: 'none',
                    boxShadow: 'none',
                    cursor: 'pointer',
                }}
                plugins={[<DatePanel />]}
            />
            <FiChevronDown
                size={19}
                style={{
                    color: '#202224',
                    cursor: 'pointer',
                }}
            />
            <style>
                {`
                    input::placeholder {
                        color: #202224;
                    }
                `}
            </style>
        </div>
    );
};

export default FilterDate;
