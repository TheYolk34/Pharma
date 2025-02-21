import { combineReducers, configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import illnessesReducer from "./slices/illnessesSlice";
import illnessReducer from "./slices/illnessSlice";
import userReducer from "./slices/userSlice";
import drugReducer from "./slices/drugSlice";
import drugsReducer from "./slices/drugsSlice";

const rootReducer = combineReducers({
    illnesses: illnessesReducer,
    illness: illnessReducer,
    user: userReducer,
    drug: drugReducer,
    drugs: drugsReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;