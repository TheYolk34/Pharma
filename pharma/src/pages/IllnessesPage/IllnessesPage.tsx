import { FC, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import IllnessCard from "../../components/IllnessCard/IllnessCard";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route.tsx";
import { setDraftDrug } from "../../slices/drugSlice"; 
import { fetchIllnesses } from "../../slices/illnessSlice";
import { selectSearchQuery, setSearchQuery } from "../../slices/illnessesSlice"; // Импортируем новый экшен и селектор
import { RootState, AppDispatch } from "../../store";
import "./IllnessesPage.css";

interface Illness {
    id: string;
    name: string;
    spread: string;
    photo: string; 
};

const IllnessesPage: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { count, draftDrugId } = useSelector((state: RootState) => state.drug);
    const searchQuery = useSelector(selectSearchQuery); // Получаем строку поиска из Redux

    const {illnesses, loading, error } = useSelector((state: RootState) => state.illness);

    useEffect(() => {
        const fetchData = async () => {
            const result = await dispatch(fetchIllnesses()).unwrap(); // Получаем результат через unwrap
            const draftDrugIdAsNumber = Number(result.draft_drug_id); // Преобразуем draft_drug_id в number
            dispatch(setDraftDrug({ draftDrugId: draftDrugIdAsNumber, count: result.count })); // Обновляем drugSlice
        };

        fetchData().catch((error) => {
            console.error("Ошибка при загрузке данных:", error);
        });
    }, [dispatch]);

    const filteredIllnesses = illnesses.filter((illness) =>
        illness.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value)); // Обновляем строку поиска в Redux
    };

    const handleGoToDrug = () => {
        if (draftDrugId) {
            navigate(`/drugs/${draftDrugId}`);
        }
    };



    return (
        <div className="clinpharm-content">
            <div>
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.ILLNESSES }]} />
            </div>
            <div className="container">
                <div className="search-section">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Тип передачи болезни" 
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
                    {loading ? (
                        <div>Загрузка...</div>
                    ) : error ? (
                        <div>Ошибка: {error}</div>
                    ) : filteredIllnesses.length === 0 ? (
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
