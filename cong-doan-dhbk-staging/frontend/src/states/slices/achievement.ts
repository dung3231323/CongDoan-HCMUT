import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Achievement } from '@/types/achievement';
import { Faculty } from '@/types/faculty';
import { Participant } from '@/services/achievement';
import { MetaData } from '@/services/achievement';
export interface AchievementState {
  addNewVisible: boolean;
  editVisible: boolean;
  addOfficersVisible: boolean;
  editAchievement: Achievement | undefined;
  deleteAchievement: Achievement | undefined;
  faculties: Faculty[];
  participants: Participant[];
  metaData: MetaData | undefined;
  data: Achievement[];
  loading: boolean;
  lazyParams: { first: number; rows: number; page: number };
}

const initialState: AchievementState = {
  addNewVisible: false,
  addOfficersVisible: false,
  editVisible: false,
  editAchievement: undefined,
  deleteAchievement: undefined,
  participants: [],
  faculties: [],
  metaData: undefined,
  data: [],
  loading: false,
  lazyParams: { first: 0, rows: 10, page: 1 },
};

const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    setAchievementData: (state, action: PayloadAction<Achievement[]>) => {
      state.data = action.payload;
      state.loading = false;
    },
    setParticipant: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
    setFaculties: (state, action: PayloadAction<Faculty[]>) => {
      state.faculties = action.payload;
    },
    setAddOfficersVisible: (state, action: PayloadAction<boolean>) => {
      state.addOfficersVisible = action.payload;
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
    setAddNewVisible: (state, action: PayloadAction<boolean>) => {
      state.addNewVisible = action.payload;
    },
    setEditVisible: (state, action: PayloadAction<boolean>) => {
      state.editVisible = action.payload;
    },
    setEditAchievement: (state, action: PayloadAction<Achievement>) => {
      state.editAchievement = action.payload;
    },
    setDeleteAchievement: (state, action: PayloadAction<Achievement>) => {
      state.deleteAchievement = action.payload;
    },
  },
});

export const {
  setAchievementData,
  setAddOfficersVisible,
  setMetaData,
  setLoading,
  setLazyParams,
  setAddNewVisible,
  setDeleteAchievement,
  setEditAchievement,
  setEditVisible,
} = achievementSlice.actions;

export default achievementSlice;
