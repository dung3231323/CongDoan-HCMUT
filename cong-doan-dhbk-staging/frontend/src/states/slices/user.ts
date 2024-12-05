import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, MetaData } from '@/services/user';

export interface UserState {
  addModalShow: boolean;
  addModalShow2: boolean;
  editModalShow: boolean;
  deleteModalShow: boolean;
  metadata: MetaData | undefined;
  data: User[];
  loading: boolean;
  lazyParams: { first: number; rows: number; page: number };
}

const initialState: UserState = {
  addModalShow: false,
  addModalShow2: false,
  editModalShow: false,
  deleteModalShow: false,
  metadata: undefined,
  data: [],
  loading: true,
  lazyParams: { first: 0, rows: 10, page: 0 },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAddModalVisibility(state, action: PayloadAction<{ visibility: boolean }>) {
      state.addModalShow = action.payload.visibility;
    },
    setAddModal2Visibility(state, action: PayloadAction<{ visibility: boolean }>) {
      state.addModalShow2 = action.payload.visibility;
    },
    setEditModalVisibility(state, action: PayloadAction<{ visibility: boolean }>) {
      state.editModalShow = action.payload.visibility;
    },
    setDeleteModalVisibility(state, action: PayloadAction<{ visibility: boolean }>) {
      state.deleteModalShow = action.payload.visibility;
    },
    setData(state, action: PayloadAction<{ data: User[]; metadata: MetaData }>) {
      state.data = action.payload.data;
      state.metadata = action.payload.metadata;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLazyParams(state, action: PayloadAction<{ first: number; rows: number; page: number }>) {
      state.lazyParams = action.payload;
    },
  },
});

export const {
  setAddModalVisibility,
  setEditModalVisibility,
  setDeleteModalVisibility,
  setData,
  setLoading,
  setLazyParams,
} = userSlice.actions;

export default userSlice;
