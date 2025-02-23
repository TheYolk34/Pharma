import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrugDetails, updateDrugFields, updateIllnessFields, deleteDrug, deleteIllnessFromDrug, formDrug } from "../../slices/drugsSlice";
import { RootState, AppDispatch } from "../../store";
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
    illnesses: { illness: Illness; trial: string }[];
    created_at: string;
    status: string;
}

const DrugPage = () => {
    const { drugId } = useParams<{ drugId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { drug, loading, error } = useSelector((state: RootState) => state.drugs);

    const [isFormValid, setIsFormValid] = useState(true);
    const [formErrors, setFormErrors] = useState<{
        name: boolean;
        description: boolean;
        trial: boolean[];
    }>({
        name: false,
        description: false,
        trial: []
    });

    const [localDrug, setLocalDrug] = useState<Drug | null>(null);

    useEffect(() => {
        if (drugId) {
            dispatch(fetchDrugDetails(drugId));
        }
    }, [dispatch, drugId]);

    useEffect(() => {
        if (drug) {
            setLocalDrug(drug);
        }
    }, [drug]);

    if (loading) return <div className="loading-gif"><img src="/loading.webp" alt="loading" /></div>;
    if (error) return <div>{error}</div>;
    if (!drug) return <div>Услуга не найдена.</div>;

    const isEditable = drug.status !== 'f' && drug.status !== 'c' && drug.status !== 'r';

    const validateForm = () => {
        if (!localDrug) return false;

        const name = localDrug.name?.trim();
        const description = localDrug.description?.trim();
        const trialEmpty = localDrug.illnesses.map(illness => !illness.trial?.trim());

        setFormErrors({
            name: !name,
            description: !description,
            trial: trialEmpty
        });

        if (!name || trialEmpty.includes(true)) {
            setIsFormValid(false);
            return false;
        }

        setIsFormValid(true);
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            await dispatch(updateDrugFields({ 
                drugId: Number(drugId), 
                name: localDrug?.name || "", 
                description: localDrug?.description || "" 
            }));

            await dispatch(formDrug(Number(drugId)));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при оформлении услуги:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteDrug(Number(drugId)));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handleIllnessDelete = async (illnessId: string, index: number) => {
        if (!localDrug) return;
        try {
            await dispatch(deleteIllnessFromDrug({ drugId: Number(drugId), illnessId: Number(illnessId) }));
            const updatedIllnesses = [...localDrug.illnesses];
            updatedIllnesses.splice(index, 1);
            setLocalDrug({ ...localDrug, illnesses: updatedIllnesses });
        } catch (error) {
            console.error('Ошибка при удалении болезни:', error);
        }
    };

    const handleSaveChanges = async () => {
        if (!localDrug) return;
        try {
            await dispatch(updateDrugFields({ 
                drugId: Number(drugId), 
                name: localDrug.name, 
                description: localDrug.description 
            }));

            // Save trial changes for each illness
            for (let i = 0; i < localDrug.illnesses.length; i++) {
                const illnessId = localDrug.illnesses[i].illness.id;
                const trial = localDrug.illnesses[i].trial;
                await dispatch(updateIllnessFields({ illnessId: Number(illnessId), drugId: Number(drugId), trial }));
            }

            console.log('Изменения сохранены');
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    const handleInputChange = (field: string, value: string, index?: number) => {
        if (!localDrug) return;

        if (field === 'name') {
            setLocalDrug({ ...localDrug, name: value });
        } else if (field === 'description') {
            setLocalDrug({ ...localDrug, description: value });
        } else if (field === 'trial' && index !== undefined) {
            const updatedIllnesses = [...localDrug.illnesses];
            updatedIllnesses[index] = { ...updatedIllnesses[index], trial: value };
            setLocalDrug({ ...localDrug, illnesses: updatedIllnesses });
        }
    };

    return (
        <div className="drug-page">
            <div className="drug-detail">
                <h1 className="drug-name-fix">Название услуги</h1>
                <input
                    value={localDrug?.name || ''}
                    type="text"
                    className={`drug-name-input ${formErrors.name ? 'error' : ''}`}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditable}
                />

                <h1 className="drug-price-fix">Описание</h1>
                <input
                    value={localDrug?.description || ''}
                    type="string"
                    className={`drug-description-input ${formErrors.description ? 'error' : ''}`}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!isEditable}
                />
                <div className="button-container">
                {isEditable && (
                    <>
                        <button className="drug-save-changes" onClick={handleSaveChanges} disabled={!isEditable}> Сохранить изменения </button>
                        <button className="drug-submit" onClick={handleSubmit} disabled={!isFormValid}>Оформить</button>
                        <button className="drug-delete" onClick={handleDelete}>Удалить</button>
                    </>
                )}
            </div>
            </div>
            <div className="illness-container">
                {localDrug?.illnesses.map(({ illness, trial }, index) => (
                    <div key={index} className="illness-row">
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
                                value={trial || ''}
                                type="text"
                                className={`trial-input ${formErrors.trial[index] ? 'error' : ''}`}
                                onChange={(e) => handleInputChange('trial', e.target.value, index)}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DrugPage;