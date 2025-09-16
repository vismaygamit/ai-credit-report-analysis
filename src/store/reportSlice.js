import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import i18n from "../i18n";

// Analysis
export const fetchReport = createAsyncThunk(
  "report/fetchReport",
  async ({ formData, token, language, onProgress }, { rejectWithValue }) => {
    try {
      let fake = 0;
      const timer = setInterval(() => {
        fake = Math.min(fake + 5, 95); // smoothly increase until 95%
        onProgress(fake);
      }, 200);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/basicanalyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
          onUploadProgress: (e) => {
            if (onProgress) {
              const percent = Math.round((e.loaded * 100) / e.total);
              onProgress(percent);
            }
          },
        }
      );
      clearInterval(timer);
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

export const fetchPaidReport = createAsyncThunk(
  "report/fetchPaidReport",
  async ({ formData, token, language, onProgress }, { rejectWithValue }) => {
    try {
      let fake = 0;
      const timer = setInterval(() => {
        fake = Math.min(fake + 5, 95); // smoothly increase until 95%
        onProgress(fake);
      }, 200);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
          onUploadProgress: (e) => {
            if (onProgress) {
              const percent = Math.round((e.loaded * 100) / e.total);
              onProgress(percent);
            }
          },
        }
      );
      clearInterval(timer);
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
  async ({ userId, language, onProgress }, { rejectWithValue }) => {
    try {
      let fake = 0;
      const timer = setInterval(() => {
        fake = Math.min(fake + 5, 95); // smoothly increase until 95%
        onProgress(fake);
      }, 200);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/report/${userId}`,
        {
          params: {
            language: language, // 👈 pass your language variable here
          },
          onDownloadProgress: (e) => {
            if (e.total) {
              const percent = Math.round((e.loaded * 100) / e.total);
              if (onProgress) onProgress(percent);
            }
          },
        }
      );
      clearInterval(timer);
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
  async (
    { object, targetLanguage, token, onProgress },
    { rejectWithValue }
  ) => {
    try {
      let fake = 0;
      const timer = setInterval(() => {
        fake = Math.min(fake + 5, 95); // smoothly increase until 95%
        onProgress(fake);
      }, 200);
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
          onUploadProgress: (e) => {
            if (onProgress) {
              const percent = Math.round((e.loaded * 100) / e.total);
              onProgress(percent);
            }
          },
        }
      );
      clearInterval(timer);
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
    progress: 0,
  },
  reducers: {
    resetReportErrorAndStatus: (state) => {
      state.error = null;
      state.statusCode = null;
      // state.loading = false;
    },
    setPreferLanguage: (state, action) => {
      state.preferLanguage = action.payload;
      i18n.changeLanguage(action.payload);
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetProgress: (state) => {
      state.progress = 0;
    },
    resetData: (state) => {
      state.data = null;
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
      .addCase(fetchPaidReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaidReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(fetchPaidReport.rejected, (state, action) => {
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
        state.statusCode = action.payload.statusCode;
      })
      .addCase(getPreferLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusCode = action.payload?.statusCode;
      });
  },
});

export const {
  resetReportErrorAndStatus,
  setPreferLanguage,
  setProgress,
  resetProgress,
  resetData,
} = reportSlice.actions;
export default reportSlice.reducer;
