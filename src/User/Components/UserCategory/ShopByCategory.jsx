import React from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { AppContext } from '../../../StoreContext/StoreContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import AppLoader from '../../../Loader';

const ShopByCategory = () => {
  const { BASE_URL } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/category/get`);
        setCategories(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        console.log("Category data could not be fetched.");
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [BASE_URL]);

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='text-secondary text-lg xl:text-xl lg:text-xl font-semibold'>Shop by Category</h1>
        <Link to='/view-all-category'><p className='text-primary text-sm xl:text-base lg:text-base font-medium underline underline-offset-2'>View all</p></Link>
      </div>
      {
        isLoading || categories.length === 0 ? (
          <div className="col-span-2 flex justify-center items-center">
            <AppLoader />
          </div>
        ) : (
          <>
            <div className='flex items-center gap-4 xl:gap-8 lg:gap-8 overflow-x-scroll hide-scrollbar'>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={{
                    pathname: "/all-category",
                  }}
                  state={{ category }}
                  className="space-y-2 mb-4 transition-opacity duration-500 ease-in-out hover:opacity-75 cursor-pointer block"
                >
                  <div className="w-24 h-28 xl:w-36 xl:h-36 lg:w-36 lg:h-36">
                    <img
                      src={category?.imageUrl}
                      alt={category.name || 'Category Image'}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => (e.target.src = '/no-image.jpg')}
                    />

                  </div>
                  <p className="text-secondary text-center text-xs xl:text-sm lg:text-sm font-normal capitalize truncate">
                    {category.name.slice(0,15)+'...'}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )
      }
    </>
  )
}

export default ShopByCategory