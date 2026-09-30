import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";


let initialState = {isLoading: false, products: [], error: null}
export let getProducts = createAsyncThunk('productSlice/getProducts' , async()=>{
    let {data} = await api.get("/products")
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