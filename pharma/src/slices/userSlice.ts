import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/API";
import { deleteCookie, getCookie } from "../api/Utils";

interface UserState {
  isLoggedIn: boolean;
  userName: string | null;
  isStaff: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userName: null,
  isStaff: false,
  loading: false,
  error: null,
};

// Thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await API.auth({ email, password });
      const data = await response.json();

      if (data.status === "Success") {
        return { email };
      } else {
        throw new Error("Ошибка регистрации");
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk для входа пользователя
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await API.login({ email, password });
      const data = await response.json();

      if (data.status === "ok") {
        return { username: data.username, isStaff: data.is_staff };
      } else {
        throw new Error("Неверный логин или пароль");
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loginUserFromSession = createAsyncThunk(
    "user/loginUserFromSession",
    async (_, thunkAPI) => {
      try {
        const sessionId = getCookie("session_id");
        if (!sessionId) {
          throw new Error("Сессия отсутствует");
        }
        const sessionData = await API.getSession();
        if (sessionData.username) {
          return { username: sessionData.username, isStaff: sessionData.isStaff };
        } else {
          throw new Error("Сессия недействительна");
        }
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  // Выход из системы
  export const logoutUser = createAsyncThunk("user/logoutUser", async (_, thunkAPI) => {
    try {
      await API.logout();
      deleteCookie("session_id");
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });

// Thunk для обновления профиля
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ email, password }: { email: string; password?: string }, thunkAPI) => {
    try {
      await API.updateProfile(email, password);
      return { email };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.userName = null;
      state.isStaff = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload); // Посмотри, что приходит
        state.loading = false;
        state.isLoggedIn = true;
        state.userName = action.payload.username;
        state.isStaff = action.payload.isStaff;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userName = action.payload.email;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUserFromSession.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.userName = action.payload.username;
        state.isStaff = action.payload.isStaff;
        state.error = null;
      })
      .addCase(loginUserFromSession.rejected, (state) => {
        state.isLoggedIn = false;
        state.userName = null;
        state.isStaff = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userName = null;
        state.isStaff = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;