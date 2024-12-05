import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addModalShow: false,
  editModalShow: false,
  deleteModalShow: false,
  metadata: {},
  data: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setAddModalVisibility(state, { payload }) {
      return { ...state, addModalShow: payload.visibility };
    },
    setEditModalVisibility(state, { payload }) {
      return { ...state, editModalShow: payload.visibility };
    },
    setDeleteModalVisibility(state, { payload }) {
      return { ...state, deleteModalShow: payload.visibility };
    },
    setData(state, { payload }) {
      return { ...state, data: payload.data, metadata: payload.metadata };
    },
  },
});

export default categorySlice;
