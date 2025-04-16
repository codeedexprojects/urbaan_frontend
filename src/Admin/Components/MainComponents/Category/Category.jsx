import { Button } from '@material-tailwind/react';
import React, { useState } from 'react';
import CreateCategories from './CreateCategories';
import AddedCategories from './AddedCategories';
import EditCategories from './EditCategories';
import { RiSearch2Line } from 'react-icons/ri';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../../../../StoreContext/StoreContext';
import { useEffect } from 'react';

const Category = () => {
  const { BASE_URL } = useContext(AppContext);
  const [createEdit, setCreateEdit] = useState("create");
  const [initialData, setInitialData] = useState(null);  // for displaying initial input fields on edit catgeory form before editing the form
  const [adminCategory, setAdminCategory] = useState([]);
  const [searchCategory, setSearchCategory] = useState('')


  const handleEditCategory = (category) => {
    setCreateEdit('edit');
    setInitialData(category);
    console.log(category);

  };

  // handle category search
  useEffect(() => {
    const handleCategorySearch = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/category/search?name=${searchCategory}`)
        setAdminCategory(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    handleCategorySearch()
  }, [searchCategory])

  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mt-5">
        {/* Create Categories Section */}
        <div className="lg:col-span-2">
          <div className="h-[calc(100vh-6rem)] overflow-y-auto hide-scrollbar">
            {
              createEdit === "create" ? (
                <>
                  <CreateCategories setAdminCategory={setAdminCategory}/>
                </>
              )
                : (
                  <>
                    <EditCategories
                      initialData={initialData}
                      setAdminCategory={setAdminCategory}
                    />
                  </>
                )
            }
          </div>
        </div>

        {/* Search and Added Categories Section */}
        <div className="lg:col-span-4 space-y-5">
          {/* Search Bar */}
          <div className="border border-gray-300 py-1 px-2 flex items-center gap-1 rounded-xl bg-white h-12 w-96">
            <RiSearch2Line className="text-gray-700 text-xl" />
            <input
              type="search"
              name="search"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Search Category"
              className="bg-transparent placeholder:text-gray-700 placeholder:text-base focus:outline-none text-secondary w-full"
            />
          </div>

          {/* Added Categories */}
          <div className="grid lg:grid-cols-2 gap-5 h-[calc(100vh-10rem)] overflow-y-auto hide-scrollbar">
            <AddedCategories
              createEdit={createEdit}
              handleEditCategory={handleEditCategory}
              adminCategory={adminCategory}
              setAdminCategory={setAdminCategory} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
