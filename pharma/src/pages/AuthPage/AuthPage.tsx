import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../store";
import { registerUser, loginUser } from "../../slices/userSlice";
import "./AuthPage.css";
import { useDispatch } from "react-redux";

const Auth: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const dispatch: AppDispatch = useDispatch(); // Указываем типизацию для dispatch
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const toggleAuthMode = () => setIsRegister((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await dispatch(registerUser({ email, password })).unwrap(); // `.unwrap()` для обработки ошибок из thunk
        await dispatch(loginUser({ email, password })).unwrap();
      } else {
        await dispatch(loginUser({ email, password })).unwrap();
      }
      navigate("/");
    } catch (err) {
      console.error("Ошибка:", err);
    }
  };

  return (
    <div className="auth-page">
      <h1>{isRegister ? "Регистрация" : "Вход"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : isRegister ? "Зарегистрироваться" : "Войти"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
        <button type="button" onClick={toggleAuthMode}>
          {isRegister ? "Войти" : "Регистрация"}
        </button>
      </p>
    </div>
  );
};

export default Auth;