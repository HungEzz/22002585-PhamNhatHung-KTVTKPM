import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
