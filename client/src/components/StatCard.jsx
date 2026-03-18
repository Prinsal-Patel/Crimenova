import { useEffect, useState, useRef } from 'react';

export default function StatCard({ icon: Icon, value, label, color = 'cyan', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const numVal = typeof value === 'number' ? value : parseInt(value) || 0;
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    const timer = setTimeout(() => {
      animated.current = true;
      let start = 0;
      const step = Math.max(1, numVal / 40);
      const interval = setInterval(() => {
        start += step;
        if (start >= numVal) {
          setDisplay(numVal);
          clearInterval(interval);
        } else {
          setDisplay(Math.floor(start));
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [numVal, delay]);

  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">
        {Icon && <Icon size={28} />}
      </div>
      <div className="stat-card__value">
        {typeof value === 'number' ? display.toLocaleString() : value}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
