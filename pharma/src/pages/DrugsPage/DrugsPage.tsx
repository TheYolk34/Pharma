import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { fetchDrugs, completeDrug, rejectedDrug } from '../../slices/drugsSlice';
import './DrugsPage.css';

interface Drug {
  id: string;
  name: string;
  description: string;
  price?: number;
  created_at: string;
  formed_at: string;
  completed_at: string;
  status: string;
  creator: string;
  qr?: string; // Новое поле для QR-кода
}

const DrugsPage = () => {
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isStaff } = useSelector((state: RootState) => state.user);
  const { drugs, loading, error } = useSelector((state: RootState) => state.drugs);

  useEffect(() => {
    dispatch(fetchDrugs(status));
    const intervalId = setInterval(() => dispatch(fetchDrugs(status)), 10000);
    return () => clearInterval(intervalId);
  }, [status, dispatch]);

  useEffect(() => {
    const filtered = drugs.filter((drug) => {
      const drugDate = new Date(drug.created_at);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      return (
        (!fromDate || drugDate >= fromDate) &&
        (!toDate || drugDate <= toDate) &&
        (!authorFilter || drug.creator.toLowerCase().includes(authorFilter.toLowerCase()))
      );
    });
    setFilteredDrugs(filtered);
  }, [dateFrom, dateTo, drugs, authorFilter]);

  const formatDate = (dateString: string): string =>
    dateString ? dateString.split('T')[0] : '—';

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'f':
        return 'В работе';
      case 'c':
        return 'Завершена';
      case 'r':
        return 'Отклонена';
      default:
        return 'Неизвестен';
    }
  };

  const handleAccept = (id: string) => {
    dispatch(completeDrug(parseInt(id)));
  };

  const handleReject = (id: string) => {
    dispatch(rejectedDrug(parseInt(id)));
  };

  const getPriceText = (price: number | null): string =>
    price && price > 0 ? price.toString() : '—';

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="drugs-page">
      <h1>Ваши Лекарства</h1>
      <div className="filters">
        {isStaff && (
          <label>
            Создатель:
            <input
              type="text"
              className="drugs-page-input"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder="Введите создателя"
            />
          </label>
        )}
        <label>
          Дата от:
          <input
            type="date"
            className="drugs-page-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          Дата до:
          <input
            type="date"
            className="drugs-page-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label>
          Статус:
          <select
            className="drugs-page-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>

      <div className="drugs-list">
        <div className="drugs-header">
          <div className="drug-row-section id-section"><strong>№</strong></div>
          <div className="drug-row-section"><strong>Название</strong></div>
          <div className="drug-row-section"><strong>Статус</strong></div>
          <div className="drug-row-section"><strong>Дата формирования</strong></div>
          <div className="drug-row-section"><strong>Дата завершения</strong></div>
          {isStaff && <div className="drug-row-section"><strong>Создатель</strong></div>}
          <div className="drug-row-section"><strong>QR-код</strong></div> {/* Новый столбец для QR-кода */}
          {isStaff && <div className="drug-row-section"><strong>Действие</strong></div>}
        </div>
        {filteredDrugs.map((drug) => (
          <div
            key={drug.id}
            className="drug-row"
            onClick={() => navigate(`/drugs/${drug.id}`)}
          >
            <div className="drug-row-section id-section">
              <div>{drug.id}</div>
            </div>
            <div className="drug-row-section">
              <div>{drug.name}</div>
            </div>
            <div className="drug-row-section">
              <div>{getStatusText(drug.status)}</div>
            </div>
            <div className="drug-row-section">
              <div>{formatDate(drug.formed_at)}</div>
            </div>
            <div className="drug-row-section">
              <div>{formatDate(drug.completed_at)}</div>
            </div>
            {isStaff && (
              <div className="drug-row-section">
                <div>{drug.creator}</div>
              </div>
            )}
            <div className="drug-row-section">
              {drug.status != 'c' ? (
                <img className="status-icon" src="/time.svg" alt="Time Icon" />
              ) : (
                <div className="qr-hover-wrapper">
                  <img className="status-icon" src="/href.svg" alt="QR Icon" />
                  {drug.qr && (
                    <div className="qr-hover">
                      <img className="qr-code" src={`data:image/png;base64,${drug.qr}`} alt="QR Code" />
                      <p>Цена: {drug.price} ₽</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isStaff && (
              <div className="drug-row-section">
                {drug.status === "f" ? (
                  <div className="drug-row-buttons">
                    <button
                      className="drug-complete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(drug.id);
                      }}
                    >
                      Принять
                    </button>
                    <button
                      className="drug-reject"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(drug.id);
                      }}
                    >
                      Отклонить
                    </button>
                  </div>
                ) : (
                  <div>—</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrugsPage;