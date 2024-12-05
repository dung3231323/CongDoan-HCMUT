import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addModalShow: false,
  editModalShow: false,
  deleteModalShow: false,
  getDetailModalShow: false,
  addBatchModalShow: false,
  metadata: {},
  data: [],
  activityDetail: null,
  activityFilter: [],
};

const activitySlice = createSlice({
  name: 'activity',
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
    setGetDetailModalShowVisibility(state, { payload }) {
      return { ...state, getDetailModalShow: payload.visibility };
    },
    setAddBatchModalVisibility(state, { payload }) {
      return { ...state, addBatchModalShow: payload.visibility };
    },
    setData(state, { payload }) {
      return { ...state, data: payload.data, metadata: payload.metadata };
    },
    setActivityDetail(state, { payload }) {
      return { ...state, activityDetail: payload.activityDetail };
    },
    setActivityFilter(state, { payload }) {
      return { ...state, activityFilter: payload.activityFilter };
    },
  },
});

export default activitySlice;
