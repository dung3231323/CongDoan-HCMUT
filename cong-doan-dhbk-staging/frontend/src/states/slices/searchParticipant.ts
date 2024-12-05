import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Participant } from '@/types/participant';
import { MetaData } from '@/services/participant';
import { FilterParticipant } from '@/types/filterParticipant';

export interface SearchParticipantState {
  searchDialogShow: boolean;

  filterParticipant: FilterParticipant;

  metaData: MetaData;
  data: Participant[];
  loading: boolean;
  lazyParams: { first: number; rows: number; page: number };
}

const initialState: SearchParticipantState = {
  searchDialogShow: false,

  filterParticipant: {
    familyName: '',
    givenName: '',
    email: '',
    phone: '',
    sID: '',
    dob: '',
    faculty: undefined,
    facultyId: '',
    gender: undefined,
    isUnionMember: false,
    uID: '',
    workingStatus: undefined,
    unionDept: undefined,
    unionDeptId: '',
    unionJoinDate: '',
    numOfChildrenMin: 0,
    childs: [],
    facultyName: '',
    unionDeptName: '',
    dobFrom: '',
    dobTo: '',
    page: 1,
    limit: 10,
    sortBy: 'givenName',
    orderBy: 'asc',
  },

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

const searchParticipantSlice = createSlice({
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
    setSearchDialogShow: (state, action: PayloadAction<boolean>) => {
      state.searchDialogShow = action.payload;
    },
    setFilterParticipant: (state, action: PayloadAction<FilterParticipant>) => {
      state.filterParticipant = action.payload;
    },
  },
});

export const {
  setParticipantData,
  setMetaData,
  setLoading,
  setLazyParams,
  setSearchDialogShow,
  setFilterParticipant
} = searchParticipantSlice.actions;

export default searchParticipantSlice;
