// store/intentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "intent",
  initialState: {
    paymentId: null,
  },
  reducers: {
    setPaymentId: (state, action) => {
      state.paymentId = action.payload;
    },
    clearPaymentId: (state) => {
      state.paymentId = null;
    },
  },
});

export const { setPaymentId, clearPaymentId } = paymentSlice.actions;
export default paymentSlice.reducer;
