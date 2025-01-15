import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    additionalDetails: null,
    userHistoryData: null,
    pipelineData: null,
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

            console.log("data is ", action.payload);

            state.additionalDetails = action.payload.additionalDetails;

            state.userHistoryData = action.payload.searchHistory;

            var newData = {};

            Object.keys(action.payload).forEach((val) => {


                if (val != "additionalDetails" && val != "searchHistory") {

                    console.log("val is ", val);
                    newData[val] = action.payload[val];
                }
            })

            console.log("data at useSLice is", newData);
            state.data = newData;;
            state.expiryTimestamp = Date.now(); // Set expiry timestamp
        },

        setPipelineData: (state, action) => {

            state.pipelineData = action.payload;


        },

        clearPipelineData: (state,action) =>{

            state.pipelineData = null;

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

export const { setData, setCredits, logout, checkExpiry,setPipelineData,clearPipelineData } = userSlice.actions;

export default userSlice.reducer;
