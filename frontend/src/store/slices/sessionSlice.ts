import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  sessions: any[];
  currentSession: any;
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<any[]>) => {
      state.sessions = action.payload;
    },
    setCurrentSession: (state, action: PayloadAction<any>) => {
      state.currentSession = action.payload;
    },
    addSession: (state, action: PayloadAction<any>) => {
      state.sessions.push(action.payload);
    },
    updateSession: (state, action: PayloadAction<any>) => {
      const index = state.sessions.findIndex(session => session.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }
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

export const { 
  setSessions, 
  setCurrentSession, 
  addSession, 
  updateSession, 
  setLoading, 
  setError, 
  clearError 
} = sessionSlice.actions;
export default sessionSlice.reducer; 