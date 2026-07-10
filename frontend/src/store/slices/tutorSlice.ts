import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TutorState {
  tutors: any[];
  selectedTutor: any;
  loading: boolean;
  error: string | null;
}

const initialState: TutorState = {
  tutors: [],
  selectedTutor: null,
  loading: false,
  error: null,
};

const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    setTutors: (state, action: PayloadAction<any[]>) => {
      state.tutors = action.payload;
    },
    setSelectedTutor: (state, action: PayloadAction<any>) => {
      state.selectedTutor = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setTutors, setSelectedTutor, setLoading, setError, clearError } = tutorSlice.actions;
export default tutorSlice.reducer; 