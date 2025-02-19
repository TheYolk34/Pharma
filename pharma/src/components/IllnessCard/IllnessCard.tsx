import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./IllnessCard.css";
import API from "../../api/API";
import { setDraftDrug } from "../../slices/drugSlice"; 

interface Illness {
    id: string;
    name: string;
    spread: string;
    photo: string;
    color?: string; // Добавлен цвет карточки
}

interface IllnessCardProps {
    illness: Illness;
}

const IllnessCard: React.FC<IllnessCardProps> = ({ illness }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleTitleClick = () => {
        navigate(`/illnesses/${illness.id}`);
    };

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
        <div 
            className="illness-card" 
            style={{ backgroundColor: illness.color || "#f5f5f5" }} 
            onClick={handleTitleClick}
        >
            <div className="illness-image-container">
                <img src={illness.photo} alt={illness.name} className="illness-image" />
            </div>
            <div className="illness-info">
                <h2 className="illness-title">{illness.name}</h2>
                <p className="illness-spread">Способ передачи: {illness.spread}</p>
                <button className="add-request-button" onClick={handleAddRequest}>
                    Добавить заявку
                </button>
            </div>
        </div>
    );
};

export default IllnessCard;
