import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../api/API";
import IllnessCard from "../../components/IllnessCard/IllnessCard";
//import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
//import { ROUTE_LABELS } from "../../Route.tsx";
import { ILLNESSES_MOCK } from "../../modules/mock";
import { setDraftDrug } from "../../slices/drugSlice"; 
import { selectSearchQuery, setSearchQuery } from "../../slices/illnessesSlice"; // Импортируем новый экшен и селектор
import { RootState } from "../../store";
import "./IllnessesPage.css";

interface Illness {
    id: string;
    name: string;
    spread: string;
    photo: string; 
};

const IllnessesPage: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { count, draftDrugId } = useSelector((state: RootState) => state.drug);
    const searchQuery = useSelector(selectSearchQuery); // Получаем строку поиска из Redux

    const [illnesses, setIllnesses] = useState<Illness[]>([]);

    const getIllnesses = async () => {
        try {
            const response = await API.getIllnesses();
            const data = await response.json();
            setIllnesses(data.illnesses);
            dispatch(setDraftDrug({
                draftDrugId: data.draft_drug_id,
                count: data.count,
            }));
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            setIllnesses(ILLNESSES_MOCK);
        }
    };

    useEffect(() => {
        getIllnesses();
    }, []);

    const filteredIllnesses = illnesses.filter((illness) =>
        illness.spread && illness.spread.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value)); // Обновляем локальное состояние строки поиска
    };

    const handleGoToDrug = () => {
        if (draftDrugId) {
            navigate(`/drugs/${draftDrugId}`);
        } // Обновляем строку поиска в Redux
    };


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
                        <div
                            onClick={count > 0 ? handleGoToDrug : undefined}
                            style={{ cursor: count > 0 ? 'pointer' : 'not-allowed' }}
                        >
                            <img src="/plus.png" className="bucket-icon" />
                            <span className="bucket-count">{count}</span>
                        </div>
                    </div>
                    
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
