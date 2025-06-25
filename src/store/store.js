import { configureStore } from "@reduxjs/toolkit";
import reportReducer from "./reportSlice";

const store = configureStore({
  reducer: {
    report: reportReducer,
  }
});

export default store;
