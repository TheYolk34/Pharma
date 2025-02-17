import { useEffect, useState } from 'react';
import API from '../../api/API';
import { useNavigate } from 'react-router-dom';
import './DrugsPage.css';

interface Drug {
  id: string;
  name: string;
  price: number;
  created_at: string;
  formed_at: string;
  completed_at: string;
  status: string;
}

const DrugsPage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const navigate = useNavigate();

  // Загрузка данных
  const fetchDrugs = async () => {
    try {
      const response = await API.getDrugs({ status });
      const data = (await response.json()) as Drug[];
      setDrugs(data);
      setFilteredDrugs(data);
    } catch (error) {
      console.error('Ошибка при загрузке сражений:', error);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, [status]);

  // Фильтрация по дате
  useEffect(() => {
    const filtered = drugs.filter((drug) => {
      const createdDate = drug.created_at.split('T')[0]; // Оставляем только YYYY-MM-DD
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      const drugDate = new Date(createdDate);

      return (
        (!fromDate || drugDate >= fromDate) &&
        (!toDate || drugDate <= toDate)
      );
    });

    setFilteredDrugs(filtered);
  }, [dateFrom, dateTo, drugs]);

  const formatDate = (dateString: string): string =>
    dateString ? dateString.split('T')[0] : '—'; // Обрезаем до YYYY-MM-DD

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

  const getSailorsText = (sailors: number | null): string =>
    sailors && sailors > 0 ? sailors.toString() : '—'; // Условие для пустого или нулевого значения

  return (
    <div className="drugs-page">
      <h1>Ваши Лекарства</h1>
      <div className="filters">
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
        {filteredDrugs.map((drug) => (
          <div
            key={drug.id}
            className="drug-row"
            onClick={() => navigate(`/drugs/${drug.id}`)}
          >
            <div className="drug-row-section">
              <strong>№</strong>
              <div>{drug.id}</div>
            </div>
            <div className="drug-row-section">
              <strong>Название</strong>
              <div>{drug.name}</div>
            </div>
            <div className="drug-row-section">
              <strong>Статус</strong>
              <div>{getStatusText(drug.status)}</div>
            </div>
            <div className="drug-row-section">
              <strong>Цена</strong>
              <div>{getSailorsText(drug.price)}</div>
            </div>
            <div className="drug-row-section">
              <strong>Дата создания</strong>
              <div>{formatDate(drug.created_at)}</div>
            </div>
            <div className="drug-row-section">
              <strong>Дата формирования</strong>
              <div>{formatDate(drug.formed_at)}</div>
            </div>
            <div className="drug-row-section">
              <strong>Дата завершения</strong>
              <div>{formatDate(drug.completed_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrugsPage;