import { configureStore } from '@reduxjs/toolkit';
import userSlice, { UserState } from './slices/user'; // Nhập kiểu dữ liệu UserState
import participantSlice, { ParticipantState } from './slices/participant';
import facultySlice, { FacultyState } from './slices/faculty';
import unionDepartmentSlice, { UnionDepartmentState } from './slices/unionDepartment';
import achievementSlice, { AchievementState } from './slices/achievement';
import searchParticipantSlice, { SearchParticipantState } from './slices/searchParticipant';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    participant: participantSlice.reducer,
    searchParticipant:searchParticipantSlice.reducer,
    faculty: facultySlice.reducer,
    unionDepartment: unionDepartmentSlice.reducer,
    achievement: achievementSlice.reducer,
  },
});

export type RootState = {
  participant: ParticipantState;
  searchParticipant: SearchParticipantState;
  faculty: FacultyState;
  unionDepartment: UnionDepartmentState;
  user: UserState;
  achievement: AchievementState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
