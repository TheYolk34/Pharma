import { FC, useState, useEffect } from "react";
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
}

const IllnessesPage: FC = () => {
    const [illnesses, setIllnesses] = useState<Illness[]>([]);
    const [filteredIllnesses, setFilteredIllnesses] = useState<Illness[]>([]);
    const [drug, setDrug] = useState<{ id: string; count: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const getIllnesses = async () => {
        try {
            const response = await API.getIllnesses();
            const data = await response.json();
            setIllnesses(data.illnesses);
            setFilteredIllnesses(data.illnesses);
            setDrug(data.drug);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            setIllnesses(ILLNESSES_MOCK);
            setFilteredIllnesses(ILLNESSES_MOCK);
            setDrug(null);
            setLoading(false);
            setError(null);
        }
    };

    useEffect(() => {
        getIllnesses();
    }, []);

    const handleSearch = () => {
        const filtered = illnesses.filter((illness) =>
            illness.spread.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredIllnesses(filtered);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }


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
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="button" className="search-button" onClick={handleSearch}>
                            <img src="/search.png" className="search-icon" alt="Search" />
                        </button>
                    </div>
                    <div className="d-flex flex-column align-items-end position-relative plus-button-container">
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
                    </div>
                </div>
                <div className="cards-container three-columns">
                    {filteredIllnesses.length === 0 ? (
                        <div>К сожалению, ничего не найдено :(</div>
                    ) : (
                        filteredIllnesses.map((illness) => (
                            <IllnessCard key={illness.id} illness={illness} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default IllnessesPage;
