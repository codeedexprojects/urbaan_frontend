import React, { useContext } from 'react';
import Slider from "react-slick";
import { motion } from "motion/react";
import { AppContext } from '../../../StoreContext/StoreContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import AppLoader from '../../../Loader';

const UserCarousel = () => {
  const { BASE_URL } = useContext(AppContext);
  const [carousel, setCarousel] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/slider/view-sliders`)
        setCarousel(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    fetchCarousel()
  }, [])


  const settings = {
    dots: true,
    arrows: false,
    infinite: carousel.length > 1, // Disable infinite scroll if only one slide
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: carousel.length > 1, // Disable autoplay if only one slide
    speed: 1000,
    autoplaySpeed: 5000,
  };

  return (
    <>
      {
        isLoading || carousel.length === 0 ? (
          <div className="col-span-2 flex justify-center items-center h-[50vh]">
            <AppLoader />
          </div>
        ) : (
          <>
            <Slider {...settings}>
              {carousel.map((slider) => (
                <div
                  key={slider._id}
                  className="relative w-full h-56 lg:h-[500px] xl:h-[450px] shadow-md rounded-2xl"
                >
                  <img
                    src={slider.image}
                    alt={`Image showcasing ${slider.title}`}
                    className="h-full w-full object-cover rounded-2xl"
                    onError={(e) => e.target.src = '/banner-no-image.jpg'}
                  />
                  <div className="absolute inset-y-1/3 left-5 lg:left-20 text-white z-10">
                    <motion.p
                      initial={{ opacity: 0, y: -50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-sm lg:text-lg uppercase font-medium"
                    >
                      {slider.title}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="text-3xl lg:text-5xl font-extrabold capitalize"
                    >
                      {slider.label}
                    </motion.p>

                    <Link to={{
                      pathname: "/all-category",
                    }}
                      state={{
                        category: {
                          id: slider?.category,
                          name: slider?.title, // Pass the title or name if available
                        },
                      }}>
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.1 }}
                        className="bg-primary mt-3 font-custom font-normal capitalize tracking-wider text-white 
                      p-2 xl:py-3 xl:px-6 lg:py-3 lg:px-6 text-xs xl:text-sm lg:text-sm  rounded-lg shadow-md hover:bg-secondary/80"
                      >
                        Explore Now
                      </motion.button>
                    </Link>
                  </div>

                  <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
                </div>
              ))}
            </Slider>

          </>
        )
      }
    </>
  )
}

export default UserCarousel

