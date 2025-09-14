import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./reportSlice";
import paymentReducer from "./paymentSlice";

const store = configureStore({
  reducer: {
    report: reportReducer,
    payment: paymentReducer
  }
});

export default store;
