import { useState, useEffect } from 'react';
import { getTours } from '../api';
import { useApp } from '../context/AppContext';
import BookingModal from '../components/BookingModal';

export default function ToursPage({ setOrchOnline }) {
  const { addToast } = useApp();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTours();
        setTours(data.tours || []);
        setOrchOnline(true);
      } catch {
        setOrchOnline(false);
        addToast('⚠️ Không kết nối được Orchestrator', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page">
      <div className="section-title">
        🗺️ Danh sách tour du lịch
        <button
          id="reload-tours-btn"
          onClick={() => { setLoading(true); getTours().then(d => { setTours(d.tours || []); setLoading(false); }); }}
          style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          🔄 Tải lại
        </button>
      </div>

      {loading && (
        <>
          <div className="spinner" />
          <p className="loading-text">Đang tải qua Orchestrator...</p>
        </>
      )}

      {!loading && (
        <div className="tours-grid">
          {tours.map((tour) => (
            <div key={tour.id} className="tour-card" id={`tour-card-${tour.id}`}>
              <img
                className="tour-img"
                src={tour.image}
                alt={tour.name}
                onClick={() => setSelectedTour(tour)}
                onError={(e) => { e.target.src = `https://placehold.co/400x190/0d1526/2563eb?text=${encodeURIComponent(tour.destination)}`; }}
              />
              <div className="tour-body" onClick={() => setSelectedTour(tour)}>
                <span className="tour-dest">📍 {tour.destination}</span>
                <div className="tour-name">{tour.name}</div>
                <div className="tour-duration">⏱️ {tour.duration}</div>
                <div className="tour-rating">⭐ {tour.rating}</div>
                <div className="tour-price">{tour.price?.toLocaleString('vi-VN')}₫/người</div>
                <div className={`tour-slots ${tour.slots < 5 ? 'low' : ''}`}>
                  {tour.slots < 5 ? `🔥 Còn ${tour.slots} chỗ!` : `👥 Còn ${tour.slots} chỗ`}
                </div>
              </div>
              <button
                id={`book-btn-${tour.id}`}
                className="btn-book"
                onClick={() => setSelectedTour(tour)}
                disabled={tour.slots === 0}
              >
                {tour.slots === 0 ? 'Hết chỗ' : '📋 Đặt tour'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTour && (
        <BookingModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}
    </div>
  );
}
