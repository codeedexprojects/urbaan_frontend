import React, { useState } from 'react'
import CreateSubCategories from './CreateSubCategories'
import AddedSubCategories from './AddedSubCategories'
import EditSubCategories from './EditSubCategories'
import { RiSearch2Line } from 'react-icons/ri'
import { useContext } from 'react'
import { AppContext } from '../../../../StoreContext/StoreContext'
import { useEffect } from 'react'
import axios from 'axios'

const SubCategory = () => {
  const { BASE_URL } = useContext(AppContext);
  const [createEditSub, setCreateEditSub] = useState("createSub");
  const [initialSubCategory, setInitialSubCategory] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const [searchSubCategory, setSearchSubCategory] = useState('')

  const handleEditCategory = (category) => {
    setCreateEditSub('editSub');
    setInitialSubCategory(category);
    console.log(category);

  };

  // handle sub category search
  useEffect(() => {
    const handleSearchSubCategory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/Subcategory/search?name=${searchSubCategory}`)
        setSubCategory(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    handleSearchSubCategory()
  }, [searchSubCategory])

  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">Sub Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mt-5">

        <div className="lg:col-span-2">
          <div className="h-fit overflow-y-auto hide-scrollbar">
            {
              createEditSub === "createSub" ? (
                <>
                  <CreateSubCategories setSubCategory={setSubCategory}/>
                </>
              ) : (
                <>
                  <EditSubCategories 
                  initialSubCategory={initialSubCategory}
                  setSubCategory={setSubCategory} />
                </>
              )
            }
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          {/* Search Bar */}
          <div className="border border-gray-300 py-1 px-2 flex items-center gap-1 rounded-xl bg-white h-12 w-96">
            <RiSearch2Line className="text-gray-700 text-xl" />
            <input
              type="search"
              name="search"
              value={searchSubCategory}
              onChange={(e) => setSearchSubCategory(e.target.value)}
              placeholder="Search Category"
              className="bg-transparent placeholder:text-gray-700 placeholder:text-base focus:outline-none text-secondary w-full"
            />
          </div>

          {/* Added Sub Categories */}
          <div className="overflow-y-auto hide-scrollbar">
            <AddedSubCategories
              createEditSub={createEditSub}
              handleEditCategory={handleEditCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SubCategory
