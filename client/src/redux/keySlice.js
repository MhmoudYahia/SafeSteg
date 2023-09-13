// alertSlice.js

import { createSlice } from '@reduxjs/toolkit';

const keySlice = createSlice({
  name: 'key',
  initialState: {
    publicKey: '',
  },
  reducers: {
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
  },
});

export const { setPublicKey } = keySlice.actions;

export default keySlice.reducer;
