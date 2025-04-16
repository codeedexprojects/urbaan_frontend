import React from 'react'
import CreateCarousel from './CreateCarousel'
import AddedCarousel from './AddedCarousel'
import { useState } from 'react'
import EditCarousel from './EditCarousel'
import SearchCarousel from './SearchCarousel'

const AdminCarousel = () => {
  const [createEditCarousel, setCreateEditCarousel] = useState("createcarousel");
  const [initialEditCarouselData, setInitialEditCarouselData] = useState(null)
  const [adminCarousel, setAdminCarousel] = useState([]);

  const handleEditCarousel = (crsl) => {
    setInitialEditCarouselData(crsl)
    setCreateEditCarousel('editcarousel')
    console.log(crsl);

  }

  // console.log(adminCarousel);


  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">Carousel</h1>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mt-5">
        {/* Left Section */}
        <div className="lg:col-span-2">
          <div className="h-fit overflow-y-auto hide-scrollbar">
            {createEditCarousel === "createcarousel" ? (
              <CreateCarousel
                setAdminCarousel={setAdminCarousel}
              />
            ) : (
              <EditCarousel
                initialEditCarouselData={initialEditCarouselData}
                setAdminCarousel={setAdminCarousel}
              />
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-4 space-y-5">
          <SearchCarousel
            setAdminCarousel={setAdminCarousel}
          />

          {/* Added Carousel */}
          <div className="space-y-10 overflow-y-auto hide-scrollbar">
            <AddedCarousel
              createEditCarousel={createEditCarousel}
              handleEditCarousel={handleEditCarousel}
              adminCarousel={adminCarousel}
              setAdminCarousel={setAdminCarousel}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCarousel;

