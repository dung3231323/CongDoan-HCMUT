import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Participant } from '@/types/participant';
import { MetaData } from '@/services/participant';

export interface ParticipantState {
  addModalShow: boolean;
  editModalShow: boolean;
  deleteModalShow: boolean;
  getDetailModalShow: boolean;

  uploadedFile: File | null;
  uploadedTypeFile: string | null;

  uploadModalShow: boolean;

  metaData: MetaData;
  data: Participant[];
  loading: boolean;
  lazyParams: { first: number; rows: number; page: number };
}

const initialState: ParticipantState = {
  addModalShow: false,
  editModalShow: false,
  deleteModalShow: false,
  getDetailModalShow: false,

  uploadModalShow: false,

  uploadedFile: null,
  uploadedTypeFile: null,

  metaData: {
    hasNextPage: false,
    hasPreviousPage: false,
    itemCount: 0,
    page: 1,
    pageCount: 1,
    take: 10,
  },
  data: [],
  loading: false,
  lazyParams: { first: 0, rows: 10, page: 1 },
};

const participantSlice = createSlice({
  name: 'participant',
  initialState,
  reducers: {
    setParticipantData: (state, action: PayloadAction<Participant[]>) => {
      state.data = action.payload;
    },
    setMetaData: (state, action: PayloadAction<MetaData>) => {
      state.metaData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLazyParams: (state, action: PayloadAction<{ first: number; rows: number; page: number }>) => {
      state.lazyParams = action.payload;
    },
    setAddModalShow: (state, action: PayloadAction<boolean>) => {
      state.addModalShow = action.payload;
    },
    setEditModalShow: (state, action: PayloadAction<boolean>) => {
      state.editModalShow = action.payload;
    },
    setDeleteModalShow: (state, action: PayloadAction<boolean>) => {
      state.deleteModalShow = action.payload;
    },
    setGetDetailModalShow: (state, action: PayloadAction<boolean>) => {
      state.getDetailModalShow = action.payload;
    },
    setUploadModalShow: (state, action: PayloadAction<boolean>) => {
      state.uploadModalShow = action.payload;
    },
    setUploadedFile: (state, action: PayloadAction<File>) => {
      state.uploadedFile = action.payload;
    },
    setUploadedTypeFile: (state, action: PayloadAction<string>) => {
      state.uploadedTypeFile = action.payload;
    },
  },
});

export const {
  setParticipantData,
  setMetaData,
  setLoading,
  setLazyParams,
  setAddModalShow,
  setDeleteModalShow,
  setEditModalShow,
  setGetDetailModalShow,
  setUploadModalShow,
  setUploadedFile,
  setUploadedTypeFile,
} = participantSlice.actions;

export default participantSlice;
