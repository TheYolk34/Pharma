import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../store';

interface IllnessesState {
    illness_spread?: string;
    searchQuery: string;
}

const initialState: IllnessesState = {
    illness_spread: '',
    searchQuery: ''
};

const illnessesSlice = createSlice({
    name: "illnesses",
    initialState,
    reducers: {
        setIllnessSpread(state, action: PayloadAction<string>) {
            state.illness_spread = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload; // Сохраняем строку поиска в глобальном состоянии
        },
        resetFilters(state) {
            Object.assign(state, initialState); // Сбросить состояние к начальному
        },
    },
});

export const { setIllnessSpread, setSearchQuery, resetFilters } = illnessesSlice.actions;

export const selectSearchQuery = (state: RootState) => state.illnesses.searchQuery;

export default illnessesSlice.reducer;