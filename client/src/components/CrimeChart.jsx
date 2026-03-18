import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    tooltip: {
      backgroundColor: '#0a1628',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(6, 182, 212, 0.2)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(6, 182, 212, 0.06)' } },
    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(6, 182, 212, 0.06)' } }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter' }, padding: 16 } },
    tooltip: commonOptions.plugins.tooltip
  }
};

export function LineChart({ data, options = {}, ...rest }) {
  return <Line data={data} options={{ ...commonOptions, ...options }} {...rest} />;
}

export function BarChart({ data, options = {}, ...rest }) {
  return <Bar data={data} options={{ ...commonOptions, ...options }} {...rest} />;
}

export function DoughnutChart({ data, options = {}, ...rest }) {
  return <Doughnut data={data} options={{ ...doughnutOptions, ...options }} {...rest} />;
}
