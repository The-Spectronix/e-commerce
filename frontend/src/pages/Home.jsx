import { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import FeaturedCollection from '../components/Product/FeaturedCollection'
import FeaturedSection from '../components/Product/FeaturedSection'
import GenderCollection from '../components/Product/GenderCollection'
import NewArrivals from '../components/Product/NewArrivals'
import ProductDetails from '../components/Product/ProductDetails'
import ProductGrid from '../components/Product/ProductGrid'
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import {  fetchProductsByFilters } from "../redux/slices/productSlice"


const Home = () => {

const dispatch = useDispatch();
const { products, loading, error } = useSelector((state) => state.products);
const [bestSellerProduct, setBestSellerProduct] = useState(null);

useEffect(() => {
    // Fetch products for a specific collection
    dispatch(fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
    })
);
// Fetch best Seller product
    const fetchBestSeller = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
            setBestSellerProduct(response.data);
        } catch (error) {
            console.error(error);
            
        }
    };
    fetchBestSeller()
}, [dispatch])

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Seller */}
        <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
       { bestSellerProduct ? ( <ProductDetails productId={bestSellerProduct._id} />) : 
       (
        <p className='text-center'>Loading best seller product ...</p>
       ) }

        <div className='max-w-7xl mx-auto'>
            <h2 className='text-3xl text-center font-bold mb-4'>
                Top Wears for Women
            </h2>
            <ProductGrid products={products} loading={loading} error={error} />
        </div>

        {/* Featured component */}

        <FeaturedCollection />
        <FeaturedSection />
    </div>
  )
}

export default Home
