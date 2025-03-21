import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAllProducts} from "@/lib/urls";
import api from "@/lib/api";

export const getProducts = createAsyncThunk(
    "products/getAllProducts",
    async (data, thunkAPI) => {
        try {
            return await api(getAllProducts)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.fulfilled,(state,action)=>{
                state.products=action.payload
            })

    }
})

export default productsSlice.reducer