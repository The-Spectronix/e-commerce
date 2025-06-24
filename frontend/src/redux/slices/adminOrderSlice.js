import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Consistent base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to get auth headers
const getAuthHeaders = () => {
    const userToken = localStorage.getItem("userToken");
    return {
        Authorization: `Bearer ${userToken}`,
    };
};

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
    "adminOrder/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
                headers: getAuthHeaders(),
            });
            return response.data; // Should be an array of orders
        } catch (error) {
            console.error("Error fetching all orders (admin):", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update order delivery status
export const updateOrderStatus = createAsyncThunk(
    "adminOrder/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/orders/${id}`, { status }, {
                headers: getAuthHeaders(),
            });
            return response.data; // The updated order object
        } catch (error) {
            console.error("Error updating order status (admin):", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
    "adminOrder/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/orders/${id}`, {
                headers: getAuthHeaders(),
            });
            return id; // Return the ID of the deleted order for filtering
        } catch (error) {
            console.error("Error deleting order (admin):", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [], // Ensure this is always an array
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- fetchAllOrders ---
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload) ? action.payload : []; // Ensure payload is array
                state.totalOrders = state.orders.length;

                const totalSales = state.orders.reduce((acc, order) => {
                    return acc + (order.totalPrice || 0);
                }, 0);
                state.totalSales = totalSales;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.orders = []; // Clear orders on error
                state.totalOrders = 0;
                state.totalSales = 0;
            })

            // --- updateOrderStatus ---
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true; // Set loading to true when update starts
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false on success
                const updatedOrder = action.payload;
                // Fix: Changed orderIndex to index
                const index = state.orders.findIndex((order) =>
                    order._id === updatedOrder._id
                );
                if (index !== -1) {
                    state.orders[index] = updatedOrder;
                }
                state.error = null;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- deleteOrder ---
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
                state.totalOrders = state.orders.length; // Update count
                const totalSales = state.orders.reduce((acc, order) => {
                    return acc + (order.totalPrice || 0);
                }, 0);
                state.totalSales = totalSales;
                state.error = null;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminOrderSlice.reducer;