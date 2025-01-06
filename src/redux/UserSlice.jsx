
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
    loading: false,
    error: null,
    loggedIn: false, // Adding the loggedIn state
};

const userSlice = createSlice({

    name: "user",
    initialState,
    reducers: {

        setData: (state, action) => {

            state.data = action.payload;

            state.loggedIn = true;

        },
        setCredits: (state, action) => {
            if (state.data) {
                // Update credits only if user data is available
                state.data.credits = action.payload;
            } else {
                console.warn('User data not available for credit update. Fetch data first.');
            }
        },
        logout: (state) => {
            // Reset state to initial values
            state.loggedIn = false;
            state.data = null;
        },

    }
})

export const { setData, logout,setCredits } = userSlice.actions;

export default userSlice.reducer;

