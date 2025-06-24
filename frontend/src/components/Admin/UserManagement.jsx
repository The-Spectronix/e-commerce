import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser, deleteUser, updateUser, fetchUsers } from '../../redux/slices/adminSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  // FIX 1: Provide a default empty array for 'users' if it's undefined
  const { users = [], loading, error } = useSelector((state) => state.admin);

  // FIX 5: Fetch users when the component mounts or when the admin user is confirmed
  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]); // Re-run if dispatch or user (e.g., login state/role) changes

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData)); // Keeping as is, assuming backend handles redirect or success state

    // Note: If you want to reset the form *after* successful user creation
    // you would need to use `createAsyncThunk`'s lifecycle in `extraReducers`
    // or make this `handleSubmit` async and `await` the dispatch result.
    // For now, keeping as original for minimal change.
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleRoleChange = (userId, newRole) => {
    // Ensure the payload matches what your updateUser thunk expects ({ id, role })
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-8'>User Management</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>} {/* Error display remains as is */}
      {/* Add New User Form */}
      <div className='bg-white shadow p-6 rounded-lg mb-6'>
        <h3 className='text-lg font-bold mb-4'>Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700'>Name</label>
            <input
              type="text"
              onChange={handleChange}
              value={formData.name}
              name='name'
              className='w-full p-2 border rounded'
              required
              autoComplete="name" // FIX 4: Added autocomplete
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type="email"
              onChange={handleChange}
              value={formData.email}
              name='email'
              className='w-full p-2 border rounded'
              required
              autoComplete="email" // FIX 4: Added autocomplete
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Password</label>
            <input
              type="password"
              onChange={handleChange}
              value={formData.password}
              name='password'
              className='w-full p-2 border rounded'
              required
              autoComplete="new-password" // FIX 4: Added autocomplete
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type='submit'
            className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
          >
            Add User
          </button>
        </form>
      </div>

      {/* User List Management */}
      <div className='overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='min-w-full text-left text-sm text-gray-500'>
          <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
            <tr>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Email</th>
              <th className='py-3 px-4'>Role</th>
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* FIX 1 & 3: Conditionally render based on users.length and wrap "No users found" in a <td> */}
            {users.length === 0 ? (
              <tr>
                {/* FIX 2: Changed colspan to colSpan. FIX 3: Wrapped message in td. */}
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  {loading ? "Loading users..." : "No users found."}
                </td>
              </tr>
            ) : (
              // FIX 1: Renamed 'user' to 'userItem' to avoid variable shadowing with 'user' from state.auth
              users.map((userItem) => (
                <tr key={userItem._id} className='border-b hover:bg-gray-50'>
                  <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{userItem.name}</td>
                  <td className='p-4'>{userItem.email}</td>
                  <td className='p-4'>
                    <select
                      value={userItem.role}
                      onChange={(e) => handleRoleChange(userItem._id, e.target.value)}
                      className='p-2 border rounded'
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className='p-4'>
                    <button onClick={() => handleDeleteUser(userItem._id)}
                      className='bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600'>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;