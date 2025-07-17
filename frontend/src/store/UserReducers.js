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
            state.isAuthorized = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const {setIsAuthorized, setUser} =userSlice.actions
export default userSlice.reducer;