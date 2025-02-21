import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../api/API";

// Типы данных для ответа API
interface Illness {
    id: string;
    name: string;
    description: string;
    spread: string;
    photo: string;
}

interface Illnessestate {
    illnesses: Illness[];
    draftDrugId: string | null;
    count: number;
    loading: boolean;
    error: string | null;
    illnessDetails: Illness | null; 
}

interface FetchIllnessesResponse {
    illnesses: Illness[];
    draft_drug_id: string;
    count: number;
}

// Начальное состояние
const initialState: Illnessestate = {
    illnesses: [],
    draftDrugId: null,
    count: 0,
    loading: false,
    error: null,
    illnessDetails: null,
};

// Thunk для загрузки всех болезней
export const fetchIllnesses = createAsyncThunk<FetchIllnessesResponse, void>(
    "illness/fetchIllnesses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.getIllnesses();
            const data: FetchIllnessesResponse = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue("Ошибка при загрузке данных");
        }
    }
);

export const fetchIllnessDetails = createAsyncThunk<Illness, string>(
    "illness/fetchIllnessDetails",
    async (illnessId, { rejectWithValue }) => {
        try {
            const response = await API.getIllnessDetails(illnessId);
            const data: Illness = await response.json(); // Прямо получаем объект Illness
            return data;
        } catch (error) {
            return rejectWithValue("Ошибка при загрузке данных о болезне");
        }
    }
);

export const addIllness = createAsyncThunk<Illness, Illness>(
    "illness/addIllness",
    async (newIllness, { rejectWithValue }) => {
        try {
            const response = await API.addIllness(
                newIllness.name,
                newIllness.description,
                newIllness.spread
            );
            const data: Illness = await response.json();
            return data;  // Возвращаем созданный болезнь
        } catch (error) {
            return rejectWithValue("Ошибка при добавлении болезни");
        }
    }
);

export const updateIllnessDetails = createAsyncThunk<Illness, Illness>(
    "illness/updateIllnessDetails",
    async (illness, { rejectWithValue }) => {
        try {
            const response = await API.changeIllness(
                Number(illness.id),
                illness.name,
                illness.description,
                illness.spread
            );
            const data: Illness = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue("Ошибка при обновлении данных о болезне");
        }
    }
);

export const addIllnessToDrug = createAsyncThunk(
    "illness/addIllnessToDrug",
    async (illnessId: number, { rejectWithValue }) => {
        try {
            await API.addIllnessToDraft(illnessId);

            const response = await API.getIllnesses();
            const data: FetchIllnessesResponse = await response.json();

            return data;
        } catch (error) {
            return rejectWithValue("Ошибка при добавлении болезни в сражение");
        }
    }
);

const illnessSlice = createSlice({
    name: "illness",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Обработка загрузки всех болезней
        builder
            .addCase(fetchIllnesses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIllnesses.fulfilled, (state, action: PayloadAction<FetchIllnessesResponse>) => {
                state.illnesses = action.payload.illnesses;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchIllnesses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchIllnessDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIllnessDetails.fulfilled, (state, action: PayloadAction<Illness>) => {
                state.illnessDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchIllnessDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addIllness.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIllness.fulfilled, (state, action: PayloadAction<Illness>) => {
                // Вы можете добавить новый болезнь в массив illnesses, если хотите
                state.illnesses.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(addIllness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateIllnessDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIllnessDetails.fulfilled, (state, action: PayloadAction<Illness>) => {
                state.illnessDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateIllnessDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addIllnessToDrug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIllnessToDrug.fulfilled, (state, action: PayloadAction<FetchIllnessesResponse>) => {
                state.draftDrugId = action.payload.draft_drug_id;
                state.count = action.payload.count;
                state.loading = false;
            })
            .addCase(addIllnessToDrug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default illnessSlice.reducer;