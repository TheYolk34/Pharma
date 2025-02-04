import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; 

export const HomePage: FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="home">
      <div className="overlay" />
      <div className="content">
        <h1>Новые медицинские препараты</h1>
        <p>
          Погрузитесь в мир медицинских препоратов, спасающих людей от всевозможных болезней.
        </p>
        <Link to="/illnesses">
            <button className="custom-button">Просмотр болезней</button>
        </Link>
      </div>
    </div>
  );
};