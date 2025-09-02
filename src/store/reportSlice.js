import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../i18n";

// Analysis
export const fetchReport = createAsyncThunk(
  "report/fetchReport",
  async ({ formData, token, language }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
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

export const translateObject = createAsyncThunk(
  "report/translateObject",
  async ({ object, targetLanguage, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/translate`,
        {
          object,
          targetLanguage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        translated: response.data.translated || response.data.raw,
        statusCode: response.status,
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Translation failed",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// getPreferLanguage API
export const getPreferLanguage = createAsyncThunk(
  "report/getPreferLanguage",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getuserlanguage/${userId}`,
        {}
      );
      return {
        preferLanguage: response.data.preferLanguage, // adjust key if API response differs
        statusCode: response.status,
      };
    } catch (error) {
      console.log("Error fetching preferred language:", error);

      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch preferred language",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    data: null,
    translated: null,
    loading: false,
    error: null,
    statusCode: null,
  },
  reducers: {
    resetReportErrorAndStatus: (state) => {
      state.error = null;
      state.statusCode = null;
      // state.loading = false;
    },
    setPreferLanguage: (state, action) => {
      state.preferLanguage = action.payload;
      i18n.changeLanguage(action.payload); // ✅ also update i18n
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
        state.statusCode = action.payload?.statusCode;
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
    builder
      .addCase(translateObject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(translateObject.fulfilled, (state, action) => {
        state.loading = false;
        state.translated = action.payload.translated;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(translateObject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusCode = action.payload.statusCode;
      });
    builder
      // getPreferLanguage
      .addCase(getPreferLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreferLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.preferLanguage = action.payload.preferLanguage;
        // i18n.changeLanguage(action.payload.preferLanguage); // ✅ sync Redux + i18n
        state.statusCode = action.payload.statusCode;
      })
      .addCase(getPreferLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusCode = action.payload?.statusCode;
      });
  },
});

export const { resetReportErrorAndStatus, setPreferLanguage } =
  reportSlice.actions;
export default reportSlice.reducer;
