import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

interface SearchState {
  searchTerm: string;
  category: string;
  sortOrder: string;
}

const initialState: SearchState = {
  searchTerm: "",
  category: "all",
  sortOrder: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.sortOrder = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.category = "all";
      state.sortOrder = "";
    },
  },
});

export const { setSearchTerm, setCategory, setSortOrder, clearSearch } =
  searchSlice.actions;

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer;
