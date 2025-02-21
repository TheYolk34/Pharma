import { FC, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loginUserFromSession, logoutUser } from "../../slices/userSlice";
import { resetFilters } from "../../slices/illnessesSlice";

const Header: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий путь
  const { isLoggedIn, userName, isStaff } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Проверка сессии при монтировании компонента
    dispatch(loginUserFromSession());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Дожидаемся завершения действия
      dispatch(resetFilters());
      navigate("/"); // Переход на главную страницу
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  };

  return (
    <nav className={`header ${location.pathname === "/" ? "home" : ""}`}>
      <div className="topline">
        <Link to="/">
          <img className="logo" src="/logo.png" alt="Pharma" />
        </Link>
        <div className="header-links">
          <Link to={isStaff ? "/moderator-illnesses" : "/illnesses"}>Болезни</Link>
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
        </div>
    </nav>
  );
};

export default Header;
