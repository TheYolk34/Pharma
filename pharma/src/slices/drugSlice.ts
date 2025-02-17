import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DrugState {
  draftDrugId: number | null;
  count: number;
}

const initialState: DrugState = {
  draftDrugId: null, 
  count: 0,
};

const drugSlice = createSlice({
  name: 'drug',
  initialState,
  reducers: {
    setDraftDrug: (state, action: PayloadAction<{ draftDrugId: number, count: number }>) => {
      state.draftDrugId = action.payload.draftDrugId;
      state.count = action.payload.count;
    },
    setTotalIllnessCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    addIllnessToDrug: (state) => {
      if (state.draftDrugId !== null) {
        state.count += 1;
      }
    },
    resetDrug: (state) => {
      state.draftDrugId = null;
      state.count = 0;
    },
  },
});


export const { setDraftDrug, addIllnessToDrug, resetDrug, setTotalIllnessCount } = drugSlice.actions;
export default drugSlice.reducer;