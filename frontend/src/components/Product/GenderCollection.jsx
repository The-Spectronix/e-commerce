import { Link } from 'react-router-dom';
import mensCollectionImage from '../../assets/mens-collection.webp';
import womensCollectionImage from '../../assets/womens-collection.webp';

const GenderCollection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Women's Collection */}
            <div className='relative flex-1'>
                <img src={womensCollectionImage} alt="Women's collection" className='w-full h-[700px] object-cover' />
                    <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
                        <h2 className='text-2xl font-bold mb-3 text-gray-900'>Women's Collection</h2>
                        <Link to="/collections/all?gender=Women" className='text-gray-900 underline'>
                        Shop Now
                        </Link>
                    </div>
            </div>

            {/* Men's Collection */}
                <div className='relative flex-1'>
                <img src={mensCollectionImage} alt="Men's collection" className='w-full h-[700px] object-cover' />
                    <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
                        <h2 className='text-2xl font-bold mb-3 text-gray-900'>Men's Collection</h2>
                        <Link to="/collections/all?gender=Men" className='text-gray-900 underline'>
                        Shop Now
                        </Link>
                    </div>
            </div>

        </div>
    </section>
  )
}

export default GenderCollection
