// Checkout.jsx (fixed version)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PayPalButton from '../Cart/PayPalButton';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { checkout } = useSelector((state) => state.checkout);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      // Wait for thunk to resolve and get payload
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: 'PayPal',
          totalPrice: cart.totalPrice,
        })
      );
      // Check if payload is inside res.payload (fulfilled action)
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        console.log('Created Checkout ID:', res.payload._id);
      } else {
        console.error('Checkout creation failed:', res.error || res);
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      console.log('Payment success, Details:', details);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: 'Paid', paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      console.log('Finalizing checkout:', checkoutId);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      console.log('Checkout finalized:', response.data);
      navigate('/order-confirmation');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Left - Shipping Info */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* City / Postal Code */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Country / Phone */}
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, country: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {!checkoutId && (
            <button type="submit" className="w-full bg-black text-white py-3 rounded">
              Continue to Payment
            </button>
          )}
        </form>

        {checkoutId && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Pay with PayPal</h3>
            <PayPalButton
              amount={cart.totalPrice}
              onSuccess={handlePaymentSuccess}
              onError={() => alert('Payment failed. Please try again.')}
            />
          </div>
        )}
      </div>

      {/* Right - Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4 border-t pt-4 max-h-[70vh] overflow-y-auto">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-start justify-between border-b pb-4">
              <div className="flex gap-4">
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="text-sm text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-md font-medium">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-lg">
            <p>Subtotal</p>
            <p>${cart.totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg">
            <p>Shipping</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between text-xl font-semibold border-t pt-4">
            <p>Total</p>
            <p>${cart.totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
