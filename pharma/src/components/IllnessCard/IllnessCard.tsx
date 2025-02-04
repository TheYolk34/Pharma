import { FC } from "react";
import "./IllnessCard.css";

interface IllnessCardProps {
    illness: {
        id: string;
        name: string;
        spread: string;
        photo: string;
    };
}

const IllnessCard: FC<IllnessCardProps> = ({illness}) => {
    return (
        <div className="illness-card">
            <div className="illness-content">
                <a href={`/illnesses/${illness.id}`}>
                    <div className="illness-image-container">
                        <img src={illness.photo} alt={illness.name}
                         />
                    </div>
                    <h2 className="illness-title">{illness.name}</h2>
                </a>
                <p className="illness-spread">Способ передачи: {illness.spread}</p>
                <button
                    type="button" 
                    className="add-request-button styled-button"
                >
                    Добавить заявку
                </button>
            </div>
        </div>
    );
};

export default IllnessCard;
