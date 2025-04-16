import { Button, Progress, Typography } from '@material-tailwind/react';
import React, { useContext, useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import { IoIosArrowBack } from "react-icons/io";
import { IoStarOutline } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../StoreContext/StoreContext';
import axios from 'axios';
import AppLoader from '../../../Loader';
import { formatDistanceToNow } from 'date-fns';
import { TiStar } from 'react-icons/ti';

const CustomerReviews = () => {
    const { BASE_URL } = useContext(AppContext);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const productId = location.state?.productId;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/review/${productId}`);
                setReviews(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, []);

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews === 0 ? 0 : (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews);

    // Calculate rating distribution
    const ratingCounts = [0, 0, 0, 0, 0]; // 1 to 5 stars
    reviews.forEach((review) => {
        ratingCounts[review.rating - 1]++; // Count the ratings
    });

    // Calculate rating percentages
    const ratingPercentages = ratingCounts.map(
        (count) => (totalReviews === 0 ? 0 : (count / totalReviews) * 100) // Calculate the percentage for each rating
    );

    return (
        <>
            <div className="bg-white shadow-md py-4 px-4 w-full sticky top-0">
                <h1
                    className="flex items-center gap-2 text-xl font-medium cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className="text-secondary text-2xl cursor-pointer" /> Customer Reviews
                </h1>
            </div>

            {/* Customer Reviews */}
            <div className="px-4 py-10 xl:py-16 xl:px-32 lg:py-16 lg:px-32 bg-userBg h-[calc(100vh-4rem)] pb-20 overflow-y-auto">
                <div className='flex items-center justify-between gap-0 pb-6 border-b-2 border-gray-300'>
                    <div className='flex flex-col justify-between gap-10 w-3/4 xl:w-1/4 lg:w-1/4'>
                        <h1 className='uppercase font-normal flex items-center gap-2 text-sm xl:text-xl lg:text-xl'>
                            ratings <IoStarOutline />
                        </h1>
                        <div>
                            <h2 className='flex items-center gap-2 text-sm xl:text-xl lg:text-xl font-medium'>
                                {averageRating.toFixed(1)} <FaStar className='text-ratingBg' />
                            </h2>
                            <p className='font-normal text-xs xl:text-base lg:text-base'>
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

                {/* <ul className="flex items-center gap-2 mt-5 overflow-x-scroll hide-scrollbar">
                    {['Most Helpful', 'Latest', 'Positive', 'Negative'].map((label) => (
                        <li
                            key={label}
                            className="font-normal capitalize text-xs xl:text-sm lg:text-sm font-custom min-w-[100px] sm:min-w-[128px] py-2 px-5 sm:p-3 flex justify-center items-center 
                                rounded-2xl border border-primary text-primary bg-white hover:bg-primary hover:text-white hover:opacity-100 whitespace-nowrap cursor-pointer"
                        >
                            {label}
                        </li>
                    ))}
                </ul> */}

                {/* reviews */}
                <div className='mt-5'>
                    {isLoading ? (
                        <div className='col-span-2 flex justify-center items-center h-[50vh]'>
                            <AppLoader />
                        </div>
                    ) : (
                        <>
                            {reviews.map((review) => (
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

                        </>
                    )}
                </div>

                <div className='hidden xl:flex lg:flex justify-center mt-10'>
                    <Link to='/write-review' state={{ productId }}>
                        <Button className='bg-primary font-custom font-normal text-sm capitalize w-52'>
                            Write a Review
                        </Button>
                    </Link>
                </div>

                <div className="bg-white shadow-md fixed bottom-0 inset-x-0 flex justify-center z-50 p-4 lg:hidden xl:hidden md:hidden">
                    <Link to='/write-review' state={{ productId }} className='w-full'>
                        <Button className="bg-primary font-custom font-normal text-sm capitalize w-full">
                            Write a Review
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default CustomerReviews;
