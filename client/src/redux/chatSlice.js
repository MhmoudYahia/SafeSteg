// alertSlice.js

import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    showChat: false,
    receiver: ""
  },
  reducers: {
    setShowChat: (state, action) => {
      state.showChat = action.payload;
    },
    setReceiver: (state, action) => {
      state.receiver = action.payload;
    },
  },
});

export const { setShowChat, setReceiver } = chatSlice.actions;

export default chatSlice.reducer;
