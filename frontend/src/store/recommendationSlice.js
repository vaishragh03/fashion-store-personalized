import { createSlice } from '@reduxjs/toolkit';

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState: {
    viewedCategories: []
  },
  reducers: {
    trackCategory: (state, action) => {
      state.viewedCategories.push(action.payload);
    }
  }
});

export const { trackCategory } = recommendationSlice.actions;
export default recommendationSlice.reducer;