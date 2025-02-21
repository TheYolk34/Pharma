import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/API";

// Интерфейс для сражения
interface Illness {
    id: string;
    name: string;
    description: string;
    spread: string;
    photo: string;
}

interface Drug {
    id: string;
    name: string;
    description: string;
    price: number;
    illnesses: { illness: Illness; trial: string }[];
    created_at: string;
    formed_at: string;
    completed_at: string;
    status: string;
    creator: string;
}

// Типизация для initialState
interface DrugState {
    drug: Drug | null;
    drugs: Drug[];
    loading: boolean;
    error: string | null;
}

const initialState: DrugState = {
    drug: null,
    drugs: [],
    loading: false,
    error: null,
};

// Асинхронные экшены для работы с API
export const fetchDrugDetails = createAsyncThunk<Drug, string>(
    "drugs/fetchDrugDetails",
    async (drugId) => {
        const response = await API.getDrugById(Number(drugId));
        return response.json();
    }
);

export const updateDrugFields = createAsyncThunk<void, { drugId: number; name: string; description: string, price: number }>(
    "drugs/updateDrugFields",
    async ({ drugId, name, description }) => {
        await API.changeAddFields(drugId, name, description);
    }
);

export const updateIllnessFields = createAsyncThunk<void, { illnessId: number; drugId: number; trial: string }>(
    "drugs/updateIllnessFields",
    async ({ illnessId, drugId, trial }) => {
        await API.changeIllnessFields(illnessId, drugId, trial);
    }
);

export const deleteDrug = createAsyncThunk<void, number>(
    "drugs/deleteDrug",
    async (drugId) => {
        await API.deleteDrug(drugId);
    }
);

export const deleteIllnessFromDrug = createAsyncThunk<void, { drugId: number; illnessId: number }>(
    "drugs/deleteIllnessFromDrug",
    async ({ drugId, illnessId }) => {
        await API.deleteIllnessFromDraft(drugId, illnessId);
    }
);

export const formDrug = createAsyncThunk<void, number>(
    "drugs/formDrug",
    async (drugId) => {
        await API.formDrug(drugId);
    }
);

export const completeDrug = createAsyncThunk<void, number>(
    "drugs/completeDrug",
    async (drugId) => {
        await API.completeDrug(drugId);
    }
);

export const rejectedDrug = createAsyncThunk<void, number>(
    "drugs/rejectedDrug",
    async (drugId) => {
        await API.rejectedDrug(drugId);
    }
);

export const fetchDrugs = createAsyncThunk('drug/fetchDrugs', async (status: string, { rejectWithValue }) => {
    try {
        const response = await API.getDrugs({ status });
        const data = await response.json();
        return data as Drug[];
    } catch (error) {
        return rejectWithValue('Ошибка при загрузке заявок');
    }
});

const drugSlice = createSlice({
    name: "drugs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDrugDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDrugDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.drug = action.payload;
            })
            .addCase(fetchDrugDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при загрузке данных о лекарствах";
            })
            .addCase(deleteDrug.fulfilled, (state) => {
                state.drug = null;
            })
            .addCase(deleteIllnessFromDrug.fulfilled, (state, action) => {
                if (state.drug) {
                    state.drug.illnesses = state.drug.illnesses.filter(
                        (illness) => Number(illness.illness.id) !== action.meta.arg.illnessId
                    );
                }
            })
            .addCase(formDrug.fulfilled, (state) => {
                if (state.drug) {
                    state.drug.status = "f";
                }
            })
            .addCase(completeDrug.fulfilled, (state) => {
                if (state.drug) {
                    state.drug.status = "c";
                }
            })
            .addCase(rejectedDrug.fulfilled, (state) => {
                if (state.drug) {
                    state.drug.status = "r";
                }
            })
            .addCase(fetchDrugs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDrugs.fulfilled, (state, action) => {
                state.loading = false;
                state.drugs = action.payload;
            })
            .addCase(fetchDrugs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при загрузке списка лекарств";
            });
    },
});

export default drugSlice.reducer;