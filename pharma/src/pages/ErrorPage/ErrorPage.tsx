import { useParams } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
    const { errorCode } = useParams();

    const getErrorMessage = (code: string) => {
        switch (code) {
            case "401":
                return "Ошибка 403: Доступ запрещен.";
            case "403":
                return "Ошибка 403: Доступ запрещен.";
            case "404":
                return "Ошибка 404: Страница не найдена.";
            default:
                return "Произошла неизвестная ошибка.";
        }
    };

    return (
        <div className="error-page">
            <h1>{getErrorMessage(errorCode || "")}</h1>
            <button onClick={() => window.location.href = '/'} className="back-button">
                Вернуться на главную
            </button>
        </div>
    );
};

export default ErrorPage;