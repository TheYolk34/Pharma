import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { login, logout } from "../../slices/userSlice";
import { resetFilters } from "../../slices/illnessesSlice";
import API from "../../api/API";
import { getCookie, deleteCookie } from "../../api/Utils";

const Header: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для навигации
  const { isLoggedIn, userName } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const sessionId = getCookie("session_id");
    if (sessionId) {
      const checkSession = async () => {
        const response = await API.getSession();
        const data = await response.json();
        if (data.status === "ok" && data.username) {
          dispatch(login(data.username));
        }
      };
      checkSession();
    }
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(resetFilters());
    await API.logout();
    deleteCookie("session_id");
    navigate("/");
  };

  return (
    <nav className="header">
      <Link to="/">
        <img src="/logo.png" alt="Logo" />
      </Link>
      <div className="header-links">
        <Link to="/illnesses">Болезни</Link>
        <Link to="/drugs">Лекарства</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile"><span>{userName}</span></Link>
            <button onClick={handleLogout} className="button-exit">Выйти</button>
          </>
        ) : (
          <Link to="/auth">
            <button className="button-exit">Войти</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;