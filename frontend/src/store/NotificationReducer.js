import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  unreadCount: 0,
};


const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    storeNotifications: (state, action) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state) => {
      state.unreadCount += 1;
    },
    removeNotification: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
  },
});

export const { addNotification, removeNotification, storeNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
