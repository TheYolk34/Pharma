import React, { createContext, useContext, useEffect, useReducer, FC } from "react";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import API from "../../api/API";
import { ILLNESSES_MOCK } from "../../modules/mock";
import "./IllnessModerPage.css";

// Типы данных для болезни и состояния
interface Illness {
    id: string;
    name: string;
    description: string;
    spread: string;
    photo: string;
}

type State = {
    illnesses: Illness[];
    searchQuery: string;
    loading: boolean;
    error: string | null;
};

type Action =
    | { type: "SET_ILLNESSES"; payload: Illness[] }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null };

// Начальное состояние
const initialState: State = {
    illnesses: [],
    searchQuery: "", // Изначально строка поиска пуста
    loading: false,
    error: null,
};

// Редуктор для управления состоянием
const reducer = (state: State, action: Action): State => {
    console.log("Dispatching action:", action); // Логирование действия
    switch (action.type) {
        case "SET_ILLNESSES":
            console.log("Setting illnesses:", action.payload); // Логирование нового состояния для болезней
            return { ...state, illnesses: action.payload };
        case "SET_SEARCH_QUERY":
            console.log("Setting search query:", action.payload); // Логирование нового значения строки поиска
            return { ...state, searchQuery: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

// Контекст для состояния болезней
const IllnessesContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | null>(null);

// Провайдер для контекста
const IllnessesProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        console.log("useEffect triggered"); // Логирование вызова useEffect
    
        const getIllnesses = async () => {
            dispatch({ type: "SET_LOADING", payload: true });
            try {
                const response = await API.getIllnesses();
                const data = await response.json();
                console.log("Received illnesses data:", data.illnesses); // Логирование полученных данных
                dispatch({ type: "SET_ILLNESSES", payload: data.illnesses });
                dispatch({ type: "SET_LOADING", payload: false });
            } catch (err) {
                console.error("Error loading data:", err);
                dispatch({ type: "SET_ERROR", payload: "Ошибка при загрузке данных с бэкенда" });
                dispatch({ type: "SET_LOADING", payload: false });
                dispatch({ type: "SET_ILLNESSES", payload: ILLNESSES_MOCK });
            }
        };
    
        getIllnesses();
    }, []); // Пустой массив зависимостей: эффект должен быть вызван только один раз при монтировании
    
    return (
        <IllnessesContext.Provider value={{ state, dispatch }}>
            {children}
        </IllnessesContext.Provider>
    );
};

// Хук для использования контекста
const useIllnesses = () => {
    const context = useContext(IllnessesContext);
    if (!context) {
        throw new Error("useIllnesses must be used within a IllnessesProvider");
    }
    return context;
};

// Компонент для отображения страницы с болезнями
const IllnessesModerPage: FC = () => {
    const { state, dispatch } = useIllnesses();
    const { illnesses, searchQuery, loading, error } = state;

    // Логируем текущее состояние перед фильтрацией
    console.log("Illnesses before filtering:", illnesses);
    console.log("Search query before filtering:", searchQuery);

    // Фильтрация болезней по строке поиска, фильтруем только после загрузки данных
    const filteredIllnesses = illnesses.length > 0 && searchQuery
        ? illnesses.filter((illness) => illness.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : illnesses;

    // Обработчик изменения строки поиска
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchQuery = e.target.value;
        console.log("Updating search query:", newSearchQuery); // Логируем новое значение строки поиска
        dispatch({ type: "SET_SEARCH_QUERY", payload: newSearchQuery });
    };

    // Обработчик удаления болезни
    const handleDeleteClick = async (illnessId: string) => {
        try {
            await API.deleteIllness(Number(illnessId)); // Удаляем болезнь по id
            dispatch({ type: "SET_ILLNESSES", payload: illnesses.filter((illness) => illness.id !== illnessId) });
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Ошибка при удалении болезни" });
        }
    };

    // Логируем текущее состояние страницы
    console.log("Current state:", state);

    return (
        <div className="main-page">
            <div>
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ILLNESSES }]} />
            </div>
            <div className="search-container-moder">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Введите название"
                    value={searchQuery} // сохраняем состояние строки поиска
                    onChange={handleSearchChange} // обновляем строку поиска
                />
            </div>
            <div>
                {loading ? (
                    <div>Загрузка...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : filteredIllnesses.length === 0 ? (
                    <div>К сожалению, ничего не найдено :(</div>
                ) : (
                    filteredIllnesses.map((illness) => (
                        <div key={illness.id} className="illness-card-moder">
                            <img src={illness.photo} alt={illness.name} className="illness-photo-moder" />
                            <div className="illness-details-moder">
                                <div className="illness-field">
                                    <strong>Название:</strong>
                                    <Link to={`/illnesses/${illness.id}`} className="illness-name-link" style={{ cursor: "pointer" }}>
                                        {illness.name}
                                    </Link>
                                </div>
                                <div className="illness-field"><strong>Заражение:</strong> {illness.spread}</div>
                                <div>
                                    <Link 
                                        to={`/edit-illnesses/${illness.id}`} 
                                        className="illness-edit-button">
                                        Изменить
                                    </Link>
                                    <button 
                                        className="illness-delete-button" 
                                        onClick={() => handleDeleteClick(illness.id)}>
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default () => (
    <IllnessesProvider>
        <IllnessesModerPage />
    </IllnessesProvider>
);