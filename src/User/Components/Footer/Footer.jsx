import React from 'react'
import { FaRegEnvelope } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { GrLocation } from "react-icons/gr";

const Footer = () => {
  return (
    <>
      <div className='bg-footerBg text-white pt-16 pb-20 px-4 xl:p-16 lg:p-16 cursor-default'>
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-16">
          {/* About */}
          <div className='xl:col-span-2 lg:col-span-2'>
            <h1 className='text-lg xl:text-2xl lg:text-2xl font-semibold'>About us</h1>
            <p className='text-xs xl:text-sm lg:text-sm md:text-sm font-light mt-5 leading-normal cursor-default'><strong className='text-primary font-bold uppercase'>Urbaan</strong> is your one-stop shop for stylish and comfortable women's fashion. We offer a wide range of Kurtis,
              Kurti sets, bottoms, nightwear, home wear, maternity wear, accessories, and kidswear, blending elegance with
              everyday comfort. Discover fashion that fits every occasion at Urbaan!</p>
          </div>

          {/* sitemap */}
          <div className=''>
            <h1 className='text-lg xl:text-2xl lg:text-2xl font-semibold'>Sitemap</h1>
            <ul className='mt-5 space-y-5'>
              <li className='font-light text-xs xl:text-sm lg:text-sm md:text-sm'>
                <Link to='/' className='hover:text-primary'>Home</Link>
              </li>
              <li className='font-light text-xs xl:text-sm lg:text-sm md:text-sm'>
                <Link to='/view-all-category' className='hover:text-primary'>Categories</Link>
              </li>
              <li className='font-light text-xs xl:text-sm lg:text-sm md:text-sm'>
                <Link to='/orders-tracking' className='hover:text-primary'>Track Order</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h1 className='text-lg xl:text-2xl lg:text-2xl font-semibold'>Contact</h1>
            <ul className='mt-5 space-y-5'>
              <li>
                <a
                  href="https://www.google.com/maps?q=Oberon+Mall,+Edappally,+Ernakulam,+Kerala+-+682024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='flex items-center gap-2 font-light text-xs xl:text-sm lg:text-sm md:text-sm hover:text-primary'
                >
                  <GrLocation className='text-xl xl:text-4xl lg:text-4xl md:text-lg' />
                  3rd Floor, Oberon Mall, Edappally, Ernakulam, Kerala - 682024
                </a>
              </li>
              <li>
                <a
                  href="tel:+919847820705"
                  className='flex items-center gap-2 font-light text-xs xl:text-sm lg:text-sm md:text-sm hover:text-primary'
                >
                  <FiPhone className='text-sm xl:text-lg lg:text-lg md:text-lg' />
                  +91 9847820705
                </a>
              </li>
              <li>
                <a
                  href="mailto:chimsuc@gmail.com"
                  className='flex items-center gap-2 font-light text-xs xl:text-sm lg:text-sm md:text-sm hover:text-primary'
                >
                  <FaRegEnvelope className='text-sm xl:text-lg lg:text-lg md:text-lg' />
                  chimsuc@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>


        {/* privacy policy */}
        <div className='space-y-10'>
  <ul className='flex flex-col lg:flex-row xl:flex-row lg:items-center xl:items-center justify-center
    xl:gap-20 lg:gap-20 gap-5 mt-20'>
    <li className='text-xs xl:text-sm lg:text-sm md:text-sm font-light cursor-pointer'>
      <Link to='/privacy-policy'>Privacy Policy</Link>
    </li>
    <li className='text-xs xl:text-sm lg:text-sm md:text-sm font-light cursor-pointer'>
      <Link to='/terms-conditions'>Terms & Conditions</Link>
    </li>
    <li className='text-xs xl:text-sm lg:text-sm md:text-sm font-light cursor-pointer'>
      <Link to='/shipping-policy'>Shipping Policy</Link>
    </li>
    <li className='text-xs xl:text-sm lg:text-sm md:text-sm font-light cursor-pointer'>
      <Link to='/refund-policy'>Refund & Cancellation Policy</Link>
    </li>
    <li className='text-xs xl:text-sm lg:text-sm md:text-sm font-light cursor-pointer'>
      <Link to='/pricing-policy'>Pricing Policy</Link>
    </li>
  </ul>

  {/* copyright */}
  <p className='text-xs xl:text-sm lg:text-sm md:text-sm font-light text-center cursor-pointer'>
    Copyright &copy; {new Date().getFullYear()} • URBAAN COLLECTIONS.
  </p>
</div>

      </div>
    </>
  )
}

export default Footer