import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Green", "Yellow", "Black", "Gray", "White", "Pink", "Beige", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Polyester", "Wool", "Silk", "Linen", "Viscose", "Fleece", "Denim"];
  const brands = ["Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashioninsta", "ChicStyle"];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: parseInt(params.minPrice || 0),
      maxPrice: parseInt(params.maxPrice || 100),
    });

    setPriceRange([
      parseInt(params.minPrice || 0),
      parseInt(params.maxPrice || 100)
    ]);
  }, [searchParams]);

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.set(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.set(key, newFilters[key]);
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newFilters = { ...filters };

    if (type === "checkbox") {
      newFilters[name] = checked
        ? [...(newFilters[name] || []), value]
        : newFilters[name].filter((item) => item !== value);
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleColorSelect = (color) => {
    const newFilters = { ...filters, color };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setPriceRange([0, newPrice]);
    setFilters(filters);
    updateURLParams(newFilters);
  };

  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

      {/* Category Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Category</label>
        {categories.map((category) => (
          <div key={category} className='flex items-center mb-1'>
            <input
              type='radio'
              name='category'
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className='mr-2 h-4 w-4 text-blue-500'
            />
            <span>{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Gender</label>
        {genders.map((gender) => (
          <div key={gender} className='flex items-center mb-1'>
            <input
              type='radio'
              name='gender'
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className='mr-2 h-4 w-4 text-blue-500'
            />
            <span>{gender}</span>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Color</label>
        <div className='flex flex-wrap gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              type='button'
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 ${filters.color === color ? 'ring-2 ring-blue-500' : ''} cursor-pointer`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Size</label>
        {sizes.map((size) => (
          <div key={size} className='flex items-center mb-1'>
            <input
              type='checkbox'
              name='size'
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className='mr-2 h-4 w-4'
            />
            <span>{size}</span>
          </div>
        ))}
      </div>

      {/* Material Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Material</label>
        {materials.map((material) => (
          <div key={material} className='flex items-center mb-1'>
            <input
              type='checkbox'
              name='material'
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className='mr-2 h-4 w-4'
            />
            <span>{material}</span>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Brand</label>
        {brands.map((brand) => (
          <div key={brand} className='flex items-center mb-1'>
            <input
              type='checkbox'
              name='brand'
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className='mr-2 h-4 w-4'
            />
            <span>{brand}</span>
          </div>
        ))}
      </div>

      {/* Price Filter */}
      <div className='mb-8'>
        <label className='block text-gray-600 font-medium mb-2'>Price Range</label>
        <input
          type='range'
          name='priceRange'
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'
        />
        <div className='flex justify-between mt-2 text-gray-600'>
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
