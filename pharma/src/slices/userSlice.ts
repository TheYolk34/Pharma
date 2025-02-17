import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '.././store';
import Api from '../api/API';

interface UserState {
  isLoggedIn: boolean;
  userName: string | null;
  status: 'idle' | 'loading' | 'failed';
}

interface SessionResponse {
  status: string;
  username: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  userName: null,
  status: 'idle',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.userName = action.payload;
      state.status = 'idle';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userName = null;
      state.status = 'idle';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'failed'>) => {
      state.status = action.payload;
    },
  },
});

export const { login, logout, setStatus } = userSlice.actions;

export const loginUser = (email: string, password: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const response = await Api.login({ email, password });
    const data = await response.json() as SessionResponse;

    if (data.status === 'ok') {
      dispatch(login(data.username));
    } else {
      console.log('Неверный логин или пароль');
      dispatch(setStatus('failed'));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    dispatch(setStatus('failed'));
  }
};

export const registerUser = (email: string, password: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const response = await Api.auth({ email, password });
    const data = await response.json() as SessionResponse;

    if (data.status === 'Success') {
      const loginResponse = await Api.login({ email, password });
      const loginData = await loginResponse.json() as SessionResponse;
      if (loginData.status === 'ok') {
        dispatch(login(loginData.username));
      } else {
        console.log('Ошибка при авторизации');
        dispatch(setStatus('failed'));
      }
    } else {
      console.log('Ошибка регистрации');
      dispatch(setStatus('failed'));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    dispatch(setStatus('failed'));
  }
};

export default userSlice.reducer;