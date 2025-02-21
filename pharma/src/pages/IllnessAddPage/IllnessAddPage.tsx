import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addIllness } from "../../slices/illnessSlice"; // Импортируем Thunk
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import "./IllnessAddPage.css";

const IllnessAddPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [editableIllness, setEditableIllness] = useState({
        id: "",
        name: "",
        description: "",
        spread: "",
        photo: "", // Если хотите поддерживать фото, добавьте соответствующие поля
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableIllness({
            ...editableIllness,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        try {
            // Используем Thunk для добавления болезни
            const action = await dispatch(addIllness(editableIllness));
            if (addIllness.fulfilled.match(action)) {
                navigate("/moderator-illnesses", { replace: true }); // Переходим к списку болезней
            } else {
                setError("Не удалось создать болезнь.");
            }
        } catch (error) {
            console.error("Ошибка при сохранении изменений:", error);
            setError("Не удалось создать болезнь.");
        }
    };

    return (
        <div>
            <div className="breadcrumbs-illness">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.MODER_ILLNESSES, path: "/moderator-illnesses" },
                        { label: "Добавить болезнь" },
                    ]}
                />
            </div>
            <div className="illness-page">
                <div className="illness-details">
                    <div className="illness-image-card">
                        <img src="/default-illness-image.jpg" alt="Illness" /> {/* Здесь можно добавить дефолтное изображение */}
                    </div>
                    <div className="illness-info">
                        <p>
                            <strong>Название:</strong>
                            <input
                                type="text"
                                name="name"
                                className="illness-edit-input"
                                value={editableIllness.name}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Заражение:</strong>
                            <input
                                type="text"
                                name="spread"
                                className="illness-edit-input"
                                value={editableIllness.spread || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Описание:</strong>
                            <textarea
                                name="description"
                                className="illness-edit-input"
                                value={editableIllness.description || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <button className="illness-save-edit" onClick={handleSaveChanges}>
                            Сохранить изменения
                        </button>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IllnessAddPage;