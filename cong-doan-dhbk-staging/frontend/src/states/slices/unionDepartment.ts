import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnionDepartment } from '@/types/unionDepartment';
import { MetaData } from '@/services/unionDepartment';

export interface UnionDepartmentState {
  data: UnionDepartment[];
  metaData: MetaData;
}

const initialState: UnionDepartmentState = {
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

const unionDepartmentSlice = createSlice({
  name: 'unionDepartment',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<UnionDepartment[]>) {
      state.data = action.payload;
    },
    setMetaData(state, action: PayloadAction<MetaData>) {
      state.metaData = action.payload;
    },
  },
});

export const { setData, setMetaData } = unionDepartmentSlice.actions;
export default unionDepartmentSlice;
