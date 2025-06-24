// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import axios from "axios"

// const API_URL = '${import.meta.env.VITE_BACKEND_URL}'
// const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`


// //async thunk to fetch admin products

// export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts", 
//     async (_, { rejectWithValue }) => {
//        try {
//          const response = await axios.get(`${API_URL}/api/admin/products`, 
//              {
//                  headers: {
 
//                      Authorization: USER_TOKEN,
//              },
//       });
//       return response.data;
//        } catch (error) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//        }
//     }
// );

// // async function to create a new product
// export const createProduct = createAsyncThunk("adminProducts/createProduct",
//     async (productData , { rejectWithValue }) => {
//        try {
//          const response = await axios.post(`${API_URL}/api/admin/products`, 
//              productData,
//              {
//                  headers: {
//                      Authorization: USER_TOKEN,
//                      },
//                      }
//          );
//          return response.data;
//        } catch (error) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//        }
//     })

//     // async thunk to update an existing product

//     export const updateProduct = createAsyncThunk("adminProducts/updateProduct", 
//         async ({ id, productData }, { rejectWithValue }) => {
//             try {
//                 const response = await axios.put(`${API_URL}/api/admin/products/${id}`,
//                     productData,
//                     {
//                         headers: {
//                             Authorization: USER_TOKEN,
//                             },
//                         })
//                         return response.data;
//             } catch (error) {
//                 return rejectWithValue(error.response?.data?.message || error.message);
//             }
//         }
//     );


//     // async thunk to delete a product

//     export const deleteProduct = createAsyncThunk(
//         "adminProducts/deleteProduct",
//         async (id, { rejectWithValue }) =>
//             {
//                 try {
//                     await axios.delete(`${API_URL}/api/admin/products/${id}`,
//                         {
//                             headers: {
//                                 Authorization: USER_TOKEN,
//                                 },
//                                 }
//                                 );
//                                 return id;
//                 } catch (error) {
//                     return rejectWithValue(error.response?.data?.message || error.message);
//                 }
//                         }
//     );

//   const adminProductSlice = createSlice({
//     name: "adminProducts",
//     initialState: {
//         products: [],
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => 
//         builder
//     .addCase(fetchAdminProducts.pending, (state) => {
//         state.loading = true;
//     })
//      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = Array.isArray(action.payload);
//     })
//      .addCase(fetchAdminProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.products = [];
//         state.error = action.payload;
//     })
//     //create Product
//     .addCase(createProduct.fulfilled, (state, action) => {
//         state.products.push(action.payload);
//     })

//     //update Products
//     .addCase(updateProduct.fulfilled, (state, action) =>{
//         const index = state.products.findIndex((product) =>
//             product._id === action.payload._id
//         );
//         if (index !== -1) {
//             state.products[index] = action.payload; 
//         }
//     })
//     //delete Product
//     .addCase(deleteProduct.fulfilled, (state, action) =>
//        {
//          state.products = state.products.filter((product) =>
//             product._id !== action.payload._id
//     )})
    
//   })  

//   export default adminProductSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Use backticks for template literals and define API_URL here if consistent
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Function to get the token dynamically
const getAuthHeaders = () => {
    const userToken = localStorage.getItem("userToken");
    return {
        Authorization: `Bearer ${userToken}`,
    };
};

//async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts",
    async (_, { rejectWithValue }) => { // Added rejectWithValue
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/products`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data; // This should be an array of products
        } catch (error) {
            // Provide a meaningful error payload
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// async function to create a new product
export const createProduct = createAsyncThunk("adminProducts/createProduct",
    async (productData, { rejectWithValue }) => { // Added rejectWithValue
        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/products`,
                productData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json', // Good practice for POST
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    })

// async thunk to update an existing product
export const updateProduct = createAsyncThunk("adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => { // Added rejectWithValue
        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/products/${id}`,
                productData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json', // Good practice for PUT
                    },
                })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// async thunk to delete a product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id, { rejectWithValue }) => { // Added rejectWithValue
        try {
            await axios.delete(`${API_BASE_URL}/api/products/${id}`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return id; // Return the ID for filtering in the reducer
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [], // Ensure initial state is an empty array
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear previous errors
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure payload is an array, default to empty if not
                state.products = Array.isArray(action.payload) ? action.payload : [];
                state.error = null;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.products = []; // Reset products on error
                state.error = action.payload; // action.payload will contain the error message from rejectWithValue
            })
            // create Product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
                state.error = null;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // update Products
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex((product) =>
                    product._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload is now the ID from the thunk
                state.products = state.products.filter((product) =>
                    product._id !== action.payload
                );
                state.error = null;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
})

export default adminProductSlice.reducer;