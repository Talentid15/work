import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    additionalDetails: null,
    userHistoryData: null,
    tokenExpiry: "",
    token:null,
    loading: false,
    error: null,
    loggedIn: false,
    expiryTimestamp: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setData: (state, action) => {
            // Directly assign the payload properties to state
            state.data = { ...action.payload };
            
            // Extract and store nested properties
            if (action.payload.additionalDetails) {
                state.additionalDetails = action.payload.additionalDetails;
                // Remove from main data object to avoid duplication
                delete state.data.additionalDetails;
            }
            
            if (action.payload.searchHistory) {
                state.userHistoryData = action.payload.searchHistory;
                delete state.data.searchHistory;
            }
            state.token = action.payload.token || null;
            state.tokenExpiry = action.payload.tokenExpiry || "";
            state.expiryTimestamp = Date.now();
            state.loggedIn = true;
        },

        setCredits: (state, action) => {
            if (state.data) {
                state.data.credits = action.payload;
            } else {
                console.warn("User data not available for credit update");
            }
        },

        setUserHistory: (state, action) => {
            if (state.userHistoryData) {
                state.userHistoryData = [action.payload, ...state.userHistoryData];
            } else {
                state.userHistoryData = [action.payload];
            }
        },

        checkExpiry: (state) => {
            const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
            if (state.expiryTimestamp && Date.now() - state.expiryTimestamp > twoDaysInMilliseconds) {
                console.warn("Stored data expired. Logging out.");
                return initialState;
            }
        },

        logout: () => initialState,
    },
});

export const { setData, setCredits, logout, checkExpiry, setUserHistory } = userSlice.actions;
export default userSlice.reducer;