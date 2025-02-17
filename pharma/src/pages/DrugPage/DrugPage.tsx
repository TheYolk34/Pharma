import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/API";
import "./DrugPage.css";

interface Illness {
    id: string;
    name: string;
    spread: string;
    photo: string;
}

interface Drug {
    id: string;
    name: string;
    description: string;
    price: number;
    illnesses: { illness: Illness; trial: string }[];
    created_at: string;
    status: string;
}

const DrugPage = () => {
    const { drugId } = useParams<{ drugId: string }>();
    const navigate = useNavigate();
    const [drug, setDrug] = useState<Drug | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getDrugDetails = async () => {
            if (!drugId) {
                setError("ID услуги не указан");
                setLoading(false);
                return;
            }

            try {
                const response = await API.getDrugById(Number(drugId));
                const data = await response.json();
                setDrug({
                    ...data,
                    illnesses: data.illnesses || [],
                });
            } catch (error) {
                console.error("Ошибка при загрузке данных о лекарстве:", error);
                setError("Не удалось загрузить данные о лекарстве");
            } finally {
                setLoading(false);
            }
        };

        getDrugDetails();
    }, [drugId]);

    if (loading) return <div className="loading-gif">Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (!drug) return <div>Услуга не найдена.</div>;

    const isEditable = drug.status !== 'f' && drug.status !== 'c' && drug.status !== 'r';

    const handleSubmit = async () => {
        try {
            await API.formDrug(Number(drugId));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при оформлении услуги:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await API.deleteDrug(Number(drugId));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handleIllnessDelete = async (illnessId: string, index: number) => {
        if (!drug) return;
        try {
            await API.deleteIllnessFromDraft(Number(drugId), Number(illnessId));
            const updatedIllnesses = [...drug.illnesses];
            updatedIllnesses.splice(index, 1);
            setDrug({ ...drug, illnesses: updatedIllnesses });
        } catch (error) {
            console.error('Ошибка при удалении болезни:', error);
        }
    };

    const handleDrugNameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const newDrugName = e.target.value.trim();
        if (!newDrugName) {
            alert("Название услуги не может быть пустым");
            return;
        }

        if (!drug) return;
        setDrug({ ...drug, name: newDrugName });

        try {
            await API.changeAddFields(Number(drugId), newDrugName);
            console.log('Название лекарства обновлено');
        } catch (error) {
            console.error('Ошибка при обновлении названия лекарства:', error);
            setDrug({ ...drug, name: drug.name });
        }
    };

    const handleTrialBlur = async (e: React.FocusEvent<HTMLInputElement>, illnessId: string, index: number) => {
        const newTrial = e.target.value;
        if (!drug) return;

        const updatedIllnesses = drug.illnesses.map((illnessObj, i) =>
            i === index ? { ...illnessObj, trial: newTrial } : illnessObj
        );
        setDrug({ ...drug, illnesses: updatedIllnesses });

        try {
            await API.changeIllnessFields(Number(illnessId), Number(drugId), newTrial);
            console.log('Испытание обновлено');
        } catch (error) {
            console.error('Ошибка при обновлении испытания:', error);
            const revertedIllnesses = drug.illnesses.map((illnessObj, i) =>
                i === index ? { ...illnessObj, trial: illnessObj.trial } : illnessObj
            );
            setDrug({ ...drug, illnesses: revertedIllnesses });
        }
    };

    return (
        <div className="drug-page">
            <h1 className="drug-name-fix">Название услуги</h1>
            <input
                defaultValue={drug.name}
                type="text"
                className="drug-name-input"
                onBlur={handleDrugNameBlur}
                disabled={!isEditable}
            />

            <h1 className="drug-price-fix">Цена</h1>
            <input
                defaultValue={drug.price}
                type="number"
                className="drug-price-input"
                disabled={!isEditable}
            />

            <h1 className="drug-price-fix">Описание</h1>
            <input
                defaultValue={drug.description}
                type="string"
                className="drug-name-input"
                disabled={!isEditable}
            />

            <div className="illness-container">
                {drug.illnesses.map(({ illness, trial }, index) => (
                    <div key={index} className="drug-row">
                        <div className="illness-card">
                            <div className="illness-content">
                                <img src={illness.photo} alt={illness.name} className="illness-photo" />
                                <div className="illness-info">
                                    <h1>{illness.name}</h1>
                                    {isEditable && (
                                        <button className="illness-delete" onClick={() => handleIllnessDelete(illness.id, index)}>
                                            Удалить
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="trial-card">
                            <h2>Испытание</h2>
                            <input
                                type="text"
                                defaultValue={trial}
                                className="trial-input"
                                onBlur={(e) => handleTrialBlur(e, illness.id, index)}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="button-container">
                {isEditable && (
                    <>
                        <button className="drug-submit" onClick={handleSubmit}>Оформить</button>
                        <button className="drug-delete" onClick={handleDelete}>Удалить</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DrugPage;