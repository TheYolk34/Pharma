import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { login } from "../../slices/userSlice";
import API from "../../api/API";
import "./ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const userName = useSelector((state: RootState) => state.user.userName);

  const [email, setEmail] = useState(userName || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await API.updateProfile(email, password || undefined);
      dispatch(login(email));
      setPassword("");
      alert("Данные успешно обновлены.");
    } catch (err: any) {
      setError(err.message || "Ошибка при обновлении профиля.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Профиль</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="profile-form"
      >
        <label>
          <h1 className="profile__title">Почта:</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <h1 className="profile__title">Пароль:</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите новый пароль"
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfilePage;