// src/store/reportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Analysis
export const fetchReport = createAsyncThunk(
  "report/fetchReport",
  async (formData, { rejectWithValue }) => {
    try {
       const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );
      return {
        data: response.data,
        statusCode: response.status,
      };
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Failed to fetch report",
        statusCode: err.response?.status || 500,
      });
    }
  }
);

export const getReportByReportId = createAsyncThunk(
  "report/getReportByReportId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/report/${userId}`
      );
     
      return {
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch report by user ID",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    data: null,
    loading: false,
    error: null,
    statusCode: null,
  },
  reducers: {
    clearReport: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusCode = action.payload.statusCode;
      });
    builder
      // Handle getReportByReportId
      .addCase(getReportByReportId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportByReportId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(getReportByReportId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusCode = action.payload.statusCode;
      });
  },
});

export const { clearReport } = reportSlice.actions;
export default reportSlice.reducer;
