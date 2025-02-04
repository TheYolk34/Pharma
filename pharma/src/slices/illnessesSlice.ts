import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface IllnessesState {
    illness_name?: string
}

const initialState: IllnessesState = {
    illness_name: ''
};

const illnessesSlice = createSlice({
    name: "illnesses",
    initialState,
    reducers: {
        setIllnessName(state, action: PayloadAction<string>) {
            state.illness_name = action.payload;
        }
    },
});

export const useTitle = () => useSelector((state: RootState) => state.illnesses.illness_name);

export const {
    setIllnessName,
} = illnessesSlice.actions;

export default illnessesSlice.reducer;