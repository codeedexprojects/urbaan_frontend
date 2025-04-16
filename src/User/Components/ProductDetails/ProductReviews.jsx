import { Button, Progress, Typography } from '@material-tailwind/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa6';
import { IoStarOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../StoreContext/StoreContext';
import { formatDistanceToNow } from "date-fns";
import { TiStar } from 'react-icons/ti';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const { BASE_URL } = useContext(AppContext);
  console.log(productId);
  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/review/${productId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [productId]);

  const calculateRatings = (reviews) => {
    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return { averageRating: 0, ratingPercentages: [0, 0, 0, 0, 0], totalReviews };
    }

    // Calculate average rating
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;

    // Calculate rating distribution
    const ratingCounts = [0, 0, 0, 0, 0]; // 1 to 5 stars

    reviews.forEach((review) => {
      ratingCounts[review.rating - 1]++; // Count the ratings
    });

    const ratingPercentages = ratingCounts.map(
      (count) => (count / totalReviews) * 100 // Calculate the percentage for each rating
    );

    return { averageRating, ratingPercentages, totalReviews };
  };

  const { averageRating, ratingPercentages, totalReviews } = calculateRatings(reviews);

  const token = localStorage.getItem('userToken')
  const userId = localStorage.getItem('userId')

  return (
    <>
      <div className='flex items-end justify-between border-b-2 pb-5 border-gray-300'>
        <h4 className="font-medium text-sm xl:text-base lg:text-base">
          Customer Reviews ({totalReviews})
        </h4>
        <Link to={!token && !userId ? '/login-user' : '/write-review'} state={{ productId }}>
          <Button className='bg-primary font-normal capitalize font-custom py-2 px-4'>Add Review</Button>
        </Link>
      </div>
      <div className="flex items-center justify-between gap-0 py-6 border-b-2 border-gray-300">
        <div className="flex flex-col justify-between gap-10 w-3/4 xl:w-1/2 lg:w-1/2">
          <h1 className="uppercase font-normal flex items-center gap-2 text-sm xl:text-base lg:text-base">
            Ratings <IoStarOutline />
          </h1>
          <div>
            <h2 className="flex items-center gap-2 text-sm xl:text-base lg:text-base">
              {averageRating.toFixed(1)} <FaStar className="text-ratingBg" />
            </h2>
            <p className="font-normal text-xs xl:text-sm lg:text-sm">
              {totalReviews} Verified Buyers
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={star} className="flex items-center gap-2">
              <Typography className="text-xs xl:text-sm lg:text-sm font-custom">{star}</Typography>
              <Progress
                value={ratingPercentages[star - 1]} // Correct index for rating percentages
                size="sm"
                color="pink"
              />
              <span className="text-xs">{Math.round(ratingPercentages[star - 1])}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className='font-semibold mb-5'>Images uploaded by customers:</p>
        {reviews.slice(0, 3).map((review) => (
          <div className="space-y-2 border-b-2 py-5" key={review._id}>
            <ul className="flex flex-col items-start gap-3 xl:gap-5 lg:gap-5 font-medium">
              <li className="w-14 h-14 xl:w-16 xl:h-16 lg:w-16 lg:h-16">
                <img
                  src={review.image}
                  alt=''
                  className="w-full h-full object-cover rounded-md"
                />
              </li>
              <li>
                <ul className="flex items-center gap-2">
                  <li
                    className='flex items-center justify-center bg-shippedBg w-9 h-5 rounded-2xl text-xs'
                  >
                    <span className="text-white">
                      {review.rating}
                    </span>
                    <TiStar className='text-base text-white' />
                  </li>
                  <span className="text-gray-900 font-normal text-xs xl:text-sm lg:text-sm capitalize" >{review.message}</span>
                </ul>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              <p className="text-gray-600 font-bold text-xs capitalize">
                {review.userId?.name}
              </p>
              <p className="text-gray-600 font-normal text-xs capitalize">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        <Link to="/customer-reviews"
          state={{ productId }}
          className='flex justify-end mt-5'>
          <p className='text-primary text-sm underline underline-offset-2 font-semibold'>
            View all reviews
          </p>
        </Link>
      </div>
    </>
  );
};

export default ProductReviews;
