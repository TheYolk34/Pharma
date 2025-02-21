import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIllnessDetails, updateIllnessDetails } from "../../slices/illnessSlice";  // Импортируем экшены
import { RootState } from "../../store"; // Типизированный root state
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { AppDispatch } from "../../store";
import { ROUTE_LABELS } from "../../Route";
import "./IllnessEditPage.css";

interface Illness {
    id: string;
    name: string;
    description: string;
    spread: string;
    photo: string;
}

const IllnessEditPage = () => {
    const { illnessId } = useParams<{ illnessId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { illnessDetails, loading, error } = useSelector((state: RootState) => state.illness);

    const [editableIllness, setEditableIllness] = useState<Illness | null>(null);

    useEffect(() => {
        if (illnessId) {
            dispatch(fetchIllnessDetails(illnessId));  // Запрашиваем данные о болезни
        }
    }, [illnessId, dispatch]);

    useEffect(() => {
        if (illnessDetails) {
            setEditableIllness(illnessDetails);  // Обновляем данные editableIllness при получении из Redux
        }
    }, [illnessDetails]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (editableIllness) {
            setEditableIllness({
                ...editableIllness,
                [name]: value,
            });
        }
    };

    const handleSaveChanges = async () => {
        if (editableIllness) {
            try {
                const action = await dispatch(updateIllnessDetails(editableIllness));  // Диспетчеризация для обновления

                if (updateIllnessDetails.fulfilled.match(action)) {
                    navigate(`/moderator-illnesses`, { replace: true });
                } else {
                    console.error("Не удалось сохранить изменения");
                }
            } catch (error) {
                console.error("Ошибка при сохранении изменений", error);
            }
        }
    };

    if (loading) {
        return <div className="loading-gif">
                    <img src="/loading.webp" alt="Loading" />
                </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!illnessDetails) {
        return <div>Болезнь не найден.</div>;
    }

    return (
        <div>
            <div className="breadcrumbs-illness">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.MODER_ILLNESSES, path: "/moderator-illnesses" },
                        { label: illnessDetails.name || "Болезнь" },
                    ]}
                />
            </div>
            <div className="illness-page">
                <div className="illness-details">
                    <div className="illness-image-card">
                        <img src={illnessDetails.photo} alt={illnessDetails.name} />
                    </div>
                    <div className="illness-info">
                        <h1>
                            <input
                                type="text"
                                name="name"
                                className="illness-edit-input"
                                value={editableIllness?.name || ''}
                                onChange={handleInputChange}
                            />
                        </h1>
                        <p>
                            <strong>Заражение:</strong>
                            <input
                                type="text"
                                name="spread"
                                className="illness-edit-input"
                                value={editableIllness?.spread || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Описание:</strong>
                            <textarea
                                name="description"
                                className="illness-edit-input"
                                value={editableIllness?.description || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <button className="illness-save-edit" onClick={handleSaveChanges}>Сохранить изменения</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IllnessEditPage;