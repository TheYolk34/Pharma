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
}

interface IllnessCardProps {
    illness: Illness;
}

const colors = ["#1e946f", "#39c2a7", "#209470", "#3cc09a", "#25a280", "#46d7c0"];
const rotations = ["1.2deg", "-6deg", "4deg", "-3deg", "8deg", "-4deg"];

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

    const index = Number(illness.id) % 6;
    const backgroundColor = colors[index];
    const rotation = rotations[index];

    return (
        <div 
            className="illness-card"
            style={{ backgroundColor }}
            onClick={handleTitleClick}
        >
            <div className="illness-image-container">
                <img src={illness.photo} alt={illness.name} className="illness-image" />
            </div>
            <div className="illness-info">
                <h2 className="illness-title">{illness.name}</h2>
                <p className="illness-spread">Тип передачи: {illness.spread}</p>
                <button className="add-request-button" onClick={handleAddRequest}>
                    Добавить заявку
                </button>
            </div>
            <div 
                className="illness-card-shadow"
                style={{ transform: `rotate(${rotation})` }}
            ></div>
        </div>
    );
};

export default IllnessCard;
