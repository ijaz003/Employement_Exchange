import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    isAuthorized: false,
    user: {},
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsAuthorized: (state, action) => {
            console.log("Setting isAuthorized to:", action.payload);
            state.isAuthorized = action.payload;
            console.log("Updated isAuthorized:", state.isAuthorized);
        },
        setUser: (state, action) => {
            console.log()
            state.user = action.payload;
            
        },
        updateProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const {setIsAuthorized, setUser, updateProfile} = userSlice.actions
export default userSlice.reducer;