import React from 'react'
import UserCarousel from '../Components/Carousel/Carousel'
import ShopByCategory from '../Components/UserCategory/ShopByCategory'
import LatestProducts from '../Components/LatestProducts/LatestProducts'
import FeaturedProducts from '../Components/FeaturedProducts/FeaturedProducts'
import Footer from '../Components/Footer/Footer'
import OfferProducts from '../Components/OfferProducts/OfferProducts'


const UserHome = () => {
    return (
        <>
            <div className='bg-userBg p-4 xl:p-16 lg:p-16 space-y-8 xl:space-y-14 lg:space-y-14'>
                <UserCarousel />
                <ShopByCategory />
                <LatestProducts />
                <OfferProducts />
                <FeaturedProducts />
            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}

export default UserHome