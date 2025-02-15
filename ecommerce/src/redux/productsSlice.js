import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { build } from "vite";


let initialState = {isLoading: false, products: [], error: null}
export let getProducts = createAsyncThunk('productSlice/getProducts' , async()=>{
    let {data} = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
    return data.data;
})

let productSlice = createSlice({
    name : "productsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder)=> {
        builder.addCase(getProducts.pending , (state)=>{
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(getProducts.fulfilled , (state, action)=>{
            state.isLoading = false;
            state.products = action.payload;
        })
        builder.addCase(getProducts.rejected , (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})