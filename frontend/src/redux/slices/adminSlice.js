import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
    const userToken = localStorage.getItem("userToken");
    return {
        Authorization: `Bearer ${userToken}`,
    };
};

export const fetchUsers = createAsyncThunk("admin/fetchusers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/admin/users`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data; // Should be an array of user objects
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addUser = createAsyncThunk(
    "admin/adduser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json'
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "admin/updateuser",
    async ({ id, ...updateData }, { rejectWithValue }) => { // Destructure id and rest of updateData
        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/users/${id}`,
                updateData, // Pass the rest of the data
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json'
                    },
                }
            );
            return response.data.user; // Assuming your backend returns { user: updatedUser }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
            headers: getAuthHeaders(),
        });
        return id; // Return the ID for filtering
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [], // Explicitly an empty array
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure payload is an array, default to empty if not
                state.users = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.users = []; // Reset users on error
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                const userIndex = state.users.findIndex(
                    (user) => user._id === updatedUser._id
                );
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser;
                }
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default adminSlice.reducer;