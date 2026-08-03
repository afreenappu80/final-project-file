import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { FiAward, FiTarget, FiTrendingUp } from 'react-icons/fi';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler
);

const StudentAnalytics = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/analytics/student', { withCredentials: true });
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch student analytics', error);
      }
    };
    fetchAnalytics();
  }, []);

  // Chart 1: Area Chart (Personal Attendance Trend)
  const areaData = {
    labels: chartData?.areaData?.labels || [],
    datasets: [
      {
        fill: true,
        label: 'My Attendance %',
        data: chartData?.areaData?.data || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4
      }
    ]
  };

  // Chart 2: Radar Chart (Personal Strengths)
  const radarData = {
    labels: chartData?.radarData?.labels || [],
    datasets: [
      {
        label: 'My Skills',
        data: chartData?.radarData?.mySkills || [],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)'
      },
      {
        label: 'Class Average',
        data: chartData?.radarData?.classAverage || [],
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        borderColor: 'rgb(107, 114, 128)',
        pointBackgroundColor: 'rgb(107, 114, 128)'
      }
    ]
  };

  // Chart 3: Bar Chart (Subject Marks vs Average)
  const barData = {
    labels: chartData?.barData?.labels || [],
    datasets: [
      {
        label: 'My Marks',
        data: chartData?.barData?.myMarks || [],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderRadius: 6
      },
      {
        label: 'Class Average',
        data: chartData?.barData?.classAverage || [],
        backgroundColor: 'rgba(229, 231, 235, 0.8)',
        borderRadius: 6
      }
    ]
  };

  // Chart 4: Doughnut (Assignment Completion)
  const doughnutData = {
    labels: chartData?.doughnutData?.labels || [],
    datasets: [
      {
        data: chartData?.doughnutData?.data || [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  if (!chartData) {
    return <DashboardLayout title="My Progress & Analytics"><div className="p-8 text-center text-gray-500">Loading Analytics...</div></DashboardLayout>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#6b7280' } }
    },
    scales: {
      x: { ticks: { color: '#6b7280' }, grid: { display: false } },
      y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(107, 114, 128, 0.1)' } }
    }
  };

  return (
    <DashboardLayout title="My Progress & Analytics">
      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <FiTarget className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
          <h3 className="text-blue-100 font-medium">CGPA Progress</h3>
          <p className="text-4xl font-bold mt-2">{chartData.overview?.cgpa || 0}</p>
          <p className="text-sm text-blue-200 mt-2 flex items-center">Overall CGPA</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <FiAward className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
          <h3 className="text-emerald-100 font-medium">Best Subject</h3>
          <p className="text-3xl font-bold mt-2">{chartData.overview?.bestSubject || 'None'}</p>
          <p className="text-sm text-emerald-200 mt-2">Highest scored subject</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <FiTrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
          <h3 className="text-purple-100 font-medium">Total Attendance</h3>
          <p className="text-4xl font-bold mt-2">{chartData.overview?.attendance || 0}%</p>
          <p className="text-sm text-purple-200 mt-2">Overall classes attended</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Attendance Area Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">My Attendance Trend</h3>
          <div className="h-64">
            <Line data={areaData} options={chartOptions} />
          </div>
        </div>

        {/* Subject Marks Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Marks vs Class Average</h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skill Assessment (Radar)</h3>
          <div className="h-72">
            <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { r: { ticks: { display: false } } } }} />
          </div>
        </div>

        {/* Assignment Doughnut */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Assignment Completion</h3>
          <div className="h-72 flex-1 flex items-center justify-center">
            <div className="w-full h-full max-w-sm">
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentAnalytics;
