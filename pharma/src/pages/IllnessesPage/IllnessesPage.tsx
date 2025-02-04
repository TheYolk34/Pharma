import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setIllnessName, useTitle } from "../../slices/illnessesSlice"; // Используем только существующие экшены и селекторы
import API from "../../api/API";
import IllnessCard from "../../components/IllnessCard/IllnessCard";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route.tsx";
import { ILLNESSES_MOCK } from "../../modules/mock";
import "./IllnessesPage.css";

interface Illness {
    id: string;
    name: string;
    spread: string;
    photo: string; 
};

const IllnessesPage: FC = () => {
    const dispatch = useDispatch();
    const illnessName = useTitle(); // Получаем строку поиска из Redux
    const [illnesses, setIllnesses] = useState<Illness[]>([]); // Локальное состояние для списка кораблей
    const [searchQuery, setSearchQuery] = useState(illnessName || ""); // Инициализируем строку поиска значением из Redux

    const getIllnesses = async () => {
        try {
            const response = await API.getIllnesses();
            const data = await response.json();
            setIllnesses(data.illnesses); // Устанавливаем корабли в локальное состояние
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            setIllnesses(ILLNESSES_MOCK); // Если ошибка, используем мок-данные
        }
    };

    useEffect(() => {
        getIllnesses();
    }, []);

    const filteredIllnesses = illnesses.filter((illness) =>
        illness.spread.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Обновляем локальное состояние строки поиска
    };

    const handleIllnessNameChange = () => {
        dispatch(setIllnessName(searchQuery)); // Обновляем строку поиска в Redux
    };

    useEffect(() => {
        // Если строка поиска изменяется, обновляем Redux
        dispatch(setIllnessName(searchQuery));
    }, [searchQuery, dispatch]);


    return (
        <div className="clinpharm-content">
            <div className="container">
                <div className="search-section">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Способ передачи болезни"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button type="button" className="search-button" onClick={handleIllnessNameChange}>
                            <img src="/search.png" className="search-icon" alt="Search" />
                        </button>
                    </div>
                    {/* <div className="d-flex flex-column align-items-end position-relative plus-button-container">
                        {drug ? (
                            <a href={`/drug/${drug.id}`}>
                                <img src="/plus.png" height="50px" alt="Drug" />
                            </a>
                        ) : (
                            <a href="#" className="btn btn-outline-warning">
                                <img src="/plus.png" height="50px" alt="Drug" />
                            </a>
                        )}
                        <span className="badge bg-warning badge-position">{drug ? drug.count : 0}</span>
                    </div> */}
                </div>
                <div className="cards-container three-columns">
                    {filteredIllnesses.length === 0 ? (
                        <div>К сожалению, ничего не найдено :(</div>
                    ) : (
                        filteredIllnesses.map((illness: Illness) => (
                            <IllnessCard key={illness.id} illness={illness} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default IllnessesPage;
