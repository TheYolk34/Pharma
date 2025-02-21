import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { updateProfile  } from "../../slices/userSlice";
import "./ProfilePage.css";

const ProfilePage = () => {
  const dispatch: AppDispatch = useDispatch(); // Указываем типизацию для dispatch
  const { userName, loading, error } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState(userName || "");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    try {
      await dispatch(updateProfile({ email, password: password || undefined })).unwrap();
      setPassword("");
      alert("Данные успешно обновлены.");
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
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
        <button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfilePage;