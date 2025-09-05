import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CallState {
  currentCallId: string | null;
  isMuted: boolean;
  isOnHold: boolean;
  audioRoute: string;
  callStatus: 'idle' | 'ringing' | 'connected' | 'ended';
}

const initialState: CallState = {
  currentCallId: null,
  isMuted: false,
  isOnHold: false,
  audioRoute: 'speaker',
  callStatus: 'idle',
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setCurrentCallId: (state, action: PayloadAction<string | null>) => {
      state.currentCallId = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setOnHold: (state, action: PayloadAction<boolean>) => {
      state.isOnHold = action.payload;
    },
    setAudioRoute: (state, action: PayloadAction<string>) => {
      state.audioRoute = action.payload;
    },
    setCallStatus: (state, action: PayloadAction<CallState['callStatus']>) => {
      state.callStatus = action.payload;
    },
  },
});

export const { setCurrentCallId, setMuted, setOnHold, setAudioRoute, setCallStatus } = callSlice.actions;
export default callSlice.reducer;
