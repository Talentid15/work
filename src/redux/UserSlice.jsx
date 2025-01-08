import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    loading: false,
    error: null,
    loggedIn: false, // Indicates if the user is logged in
    expiryTimestamp: null, // To track when the data expires
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setData: (state, action) => {
            const { data, expiryTime } = action.payload;
            state.data = data;
            state.loggedIn = true;
            state.expiryTimestamp = Date.now() + expiryTime; // Set expiry timestamp
        },
        setCredits: (state, action) => {
            if (state.data) {
                // Update credits only if user data is available
                state.data.credits = action.payload;
            } else {
                console.warn(
                    "User data not available for credit update. Fetch data first."
                );
            }
        },
        checkExpiry: (state) => {
            const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // 2 days
            if (state.createdAt && Date.now() - state.createdAt > twoDaysInMilliseconds) {
                console.warn("Stored data is older than 2 days. Logging out.");
                state.loggedIn = false;
                state.data = null;
                state.createdAt = null;
            }
        },
        logout: (state) => {
            // Reset state to initial values
            state.loggedIn = false;
            state.data = null;
            state.expiryTimestamp = null;
        },
    },
});

export const { setData, setCredits, logout, checkExpiry } = userSlice.actions;

export default userSlice.reducer;
