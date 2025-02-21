import { useEffect, FC } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route.tsx";
import { fetchIllnessDetails } from "../../slices/illnessSlice";
import { AppDispatch } from "../../store";
import { RootState } from "../../store";
import "./IllnessPage.css";

const IllnessPage: FC = () => {
    const { illnessId } = useParams<{ illnessId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { illnessDetails, loading, error } = useSelector((state: RootState) => state.illness);
    const { isStaff } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (illnessId) {
            dispatch(fetchIllnessDetails(illnessId));
        }
    }, [dispatch, illnessId]);
    
    useEffect(() => {
        console.log(illnessDetails);  // Добавьте лог для проверки
    }, [illnessDetails]);

    if (loading) {
        return (
            <div className="loading-gif">
                <img src="/loading.webp" alt="Loading" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!illnessDetails) {
        return <div>Болезнь не найдена.</div>;
    }

    return (
        <div>
            <div className="breadcrumbs-illness">
                <BreadCrumbs
                    crumbs={[
                        { label: isStaff ? ROUTE_LABELS.MODER_ILLNESSES : ROUTE_LABELS.ILLNESSES, path: isStaff ? "/moderator-illnesses" : "/illnesses" },
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
                        <h1>{illnessDetails.name}</h1>
                        <p><strong>Описание:</strong> {illnessDetails.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IllnessPage;
