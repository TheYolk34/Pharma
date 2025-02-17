import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./IllnessCard.css";
import API from "../../api/API";
import { setDraftDrug } from "../../slices/drugSlice"; 

// Определяем интерфейс Illness
interface Illness {
    id: string;
    name: string;
    spread: string;
    photo: string;
}

// Пропсы для компонента
interface IllnessCardProps {
    illness: Illness;
}

const IllnessCard: React.FC<IllnessCardProps> = ({ illness }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Обработчик клика по заголовку или изображению
    const handleTitleClick = () => {
        navigate(`/illnesses/${illness.id}`);
    };

    // Обработчик клика по кнопке "Добавить заявку"
    const handleAddRequest = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const response = await API.addIllnessToDraft(Number(illness.id));
            const data = await response.json();

            if (data.draft_drug_id) {
                dispatch(setDraftDrug({
                    draftDrugId: data.draft_drug_id,
                    count: data.count,
                }));
            } else {
                console.error("Ошибка: неверный ответ от API");
            }
        } catch (error) {
            console.error("Ошибка при добавлении заявки:", error);
        }
    };

    return (
        <div className="illness-card">
            <div className="illness-content">
                {/* Изображение болезни */}
                <div className="illness-image-container" onClick={handleTitleClick} style={{ cursor: "pointer" }}>
                    <img src={illness.photo} alt={illness.name} />
                </div>
                {/* Заголовок болезни */}
                <h2 className="illness-title" onClick={handleTitleClick} style={{ cursor: "pointer" }}>
                    {illness.name}
                </h2>
                {/* Способ передачи */}
                <p className="illness-spread">Способ передачи: {illness.spread}</p>
                {/* Кнопка "Добавить заявку" */} 
                <button
                    type="button"
                    className="add-request-button styled-button"
                    onClick={handleAddRequest}
                >
                    Добавить заявку
                </button>
            </div>
        </div>
    );
};

export default IllnessCard;