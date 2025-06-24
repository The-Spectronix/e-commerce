import { useEffect } from 'react'
import MyOrders from './MyOrders'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';

const Profile = () => {

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      }
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart())
    navigate('/login');
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Section */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <button onClick={handleLogout} className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition">
              Logout
            </button>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrders />
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Profile
