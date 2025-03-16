
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  data: null,
};

const offerSlice = createSlice({

    name: "offer",
    initialState,
    reducers: {
        
        setOfferData:(state,action)=>{
            state.loading = false;
            state.data = action.payload;
        },

    },

})


export const {setOfferData} = offerSlice.actions;

export default offerSlice.reducer;
