// src/redux/slices/faculty.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Faculty } from '@/types/faculty';
import { MetaData } from '@/services/faculty';

export interface FacultyState {
  data: Faculty[];
  metaData: MetaData;
}

const initialState: FacultyState = {
  data: [],
  metaData: {
    hasNextPage: false,
    hasPreviousPage: false,
    itemCount: 0,
    page: 1,
    pageCount: 1,
    take: 10,
  },
};

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Faculty[]>) => {
      state.data = action.payload;
    },
    setMetaData: (state, action: PayloadAction<MetaData>) => {
      state.metaData = action.payload;
    },
  },
});

export const { setData, setMetaData } = facultySlice.actions;
export default facultySlice;
