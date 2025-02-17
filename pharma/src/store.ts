import { combineReducers, configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import illnessesReducer from "./slices/illnessesSlice";
import userReducer from "./slices/userSlice";
import drugReducer from "./slices/drugSlice";

const rootReducer = combineReducers({
    illnesses: illnessesReducer,
    user: userReducer,
    drug: drugReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;