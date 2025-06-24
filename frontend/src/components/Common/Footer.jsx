import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { FiPhoneCall } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className='border-t py-12 bg-white w-full'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Newsletter */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Newsletter</h3>
            <p className='text-gray-500 mb-4'>
                Be the first to hear about new products, exclusive events, and online offers
            </p>
            <p className='font-medium text-sm text-gray-600 mb-6'>Sign up and get 10% off yout first order.</p>

            {/* Newsletter form */}
            <form className='flex w-full max-w-md'>
                <input type="email" placeholder='enter your email' className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all' required  />
                    <button type='submit' className='text-white bg-black px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all'>Subscribe</button>
            </form>
        </div>

        {/* Shop links */}

        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
            <ul className='space-y-2 text-gray-600'>
                <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                    Men's Top wear
                    </Link>
                </li>
                  <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                    Women's Top wear
                    </Link>
                </li>
                  <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                    Men's Bottom wear
                    </Link>
                </li>
                  <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                    Women's Bottom wear
                    </Link>
                </li>
            </ul>
        </div>

        {/* Support Links */}

        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
            <ul className='space-y-2 text-gray-600'>
                <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                    Contact Us
                    </Link>
                </li>
                  <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                    About Us
                    </Link>
                </li>
                  <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                    FAQs
                    </Link>
                </li>
                  <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>
                   Features
                    </Link>
                </li>
            </ul>
        </div>

        {/* Follow Us Links */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Follow Us</h3>
            <div className='flex items-center space-x-4 mt-6'>
        <a 
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className='hover:text-gray-500 transition-colors'
        >
            <TbBrandMeta className='w-5 h-5' />
        </a>
        <a 
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className='hover:text-gray-500 transition-colors'
        >
            <IoLogoInstagram className='w-5 h-5' />
        </a>
        <a 
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className='hover:text-gray-500 transition-colors'
        >
            <RiTwitterXLine className='w-4 h-4' />
        </a>
            </div>
            <p className='text-gray-500 mt-6'>Call Us</p>
            <p className='mt-1 text-gray-700'>
                <FiPhoneCall className=" inline-block mr-2 w-5 h-5" />
                0123-456-789
            </p>
        </div>

      </div>
{/* Footer Bottom */}

        <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
            <p className='text-gray-500 text-center text-sm tracking-tighter'>© 2025, CompileTab. All Rights Reserved.</p>
        </div>

    </footer>
  )
}

export default Footer
