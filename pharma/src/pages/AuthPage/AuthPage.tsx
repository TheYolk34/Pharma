import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from '../../slices/userSlice';
import { RootState } from '../../store';
import "./AuthPage.css";

const Auth: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const status = useSelector((state: RootState) => state.user.status);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const toggleAuthMode = () => setIsRegister((prev) => !prev);

  useEffect(() => {
    if (isLoggedIn) {
        navigate("/illnesses");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      dispatch(registerUser(email, password));
    } else {
      dispatch(loginUser(email, password));
    }
  };

  const isLoading = status === 'loading';
  const isFailed = status === 'failed';

  return (
    <div className="auth-page">
      <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
      {isFailed && <p>Произошла ошибка. Попробуйте снова.</p>}
      <p>
        {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
        <button type="button" onClick={toggleAuthMode}>
          {isRegister ? 'Войти' : 'Регистрация'}
        </button>
      </p>
    </div>
  );
};

export default Auth;