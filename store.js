// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

// Initial state for the music catalog
const initialState = {
  catalog: [],
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    addSong: (state, action) => {
      state.catalog.push(action.payload);
    },
    removeSong: (state, action) => {
      state.catalog = state.catalog.filter((song) => song.trackId !== action.payload.trackId);
    },
    setCatalog: (state, action) => {
      state.catalog = action.payload; 
    },
  },
});

// Export actions for use in components
export const { addSong, removeSong, setCatalog } = catalogSlice.actions;

// Configure the Redux store
const store = configureStore({
  reducer: {
    catalog: catalogSlice.reducer,
  },
});

export default store;
