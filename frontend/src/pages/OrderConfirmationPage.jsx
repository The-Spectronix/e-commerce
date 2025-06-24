import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';


const OrderConfirmationPage = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const  { checkout } = useSelector((state) => state.checkout);

//clear the cart when the order is placed
useEffect(() => {
  if (checkout && checkout._id) {
    dispatch(clearCart());
    localStorage.removeItem("cart")
  } else {
    navigate("/my-orders");
  }
}, [checkout, dispatch, navigate])

const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt)
    orderDate.setDate(orderDate.getDate() + 10); //Add 10 days to the order date
    return orderDate.toLocaleDateString();
}

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
        Thank You for Your Order!
      </h1>
      {checkout && (
        <div className='p-6 rounded-lg border'>
            <div className='flex justify-between mb-20'>
                {/* Order Id and Date */}
                <div>
                    <h2 className='text-xl font-semibold'>
                        Order ID: {checkout._id}
                    </h2>
                    <p className='text-gray-500'>
                        Order date: {new Date(checkout.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {/* Estimated delivery */}
                <div>
                    <p className='text-emerald-700 text-sm'>
                        Estimated Delivery:{" "}
                        {calculateEstimatedDelivery(checkout.createdAt)}
                    </p>
                </div>
            </div>
            {/* ordered Items */}
            <div className='mb-20'>
                {checkout.checkoutItems.map((item) => (
                   <div
  key={item.productId}
  className='flex items-center justify-between mb-4 border-b pb-4'
>
  {/* Image */}
  <div className='w-20 h-20 flex-shrink-0'>
    <img
      src={item.image}
      alt={item.name}
      className='w-full h-full object-cover rounded'
    />
  </div>

  {/* Details */}
  <div className='flex-1 ml-4'>
    <h4 className='text-md font-semibold'>{item.name}</h4>
    <p className='text-sm text-gray-500'>
      {item.color} | {item.size}
    </p>
  </div>

  {/* Price and Quantity */}
  <div className='text-right min-w-[100px]'>
    <p className='text-md font-semibold'>${item.price}</p>
    <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
  </div>
</div>
                ))}
            </div>

            <div className='gird grid-cols-2 gap-8'>
              {/* payment Info */}
              <div className='mb-4'>
                <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                <p className='text-gray-600'>PayPal</p>
              </div>

              {/* Delivery Info */}

              <div>
                <h4 className='text-lg font-semibold mb-2'>Delivery</h4>
                <p className='text-gray-600'>
                  {checkout.shippingAddress.address}
                </p>
                <p className='text-gray-600'>
                  {checkout.shippingAddress.city}, {" "}
                  {checkout.shippingAddress.country}
                </p>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default OrderConfirmationPage
