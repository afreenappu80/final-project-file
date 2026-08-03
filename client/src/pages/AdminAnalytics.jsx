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
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { FiTrendingUp, FiTrendingDown, FiFilter } from 'react-icons/fi';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler
);

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('This Semester');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/analytics/admin', { withCredentials: true });
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch admin analytics', error);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  // Chart 1: Area Chart (Attendance Trend)
  const areaData = {
    labels: chartData?.areaData?.labels || [],
    datasets: [
      {
        fill: true,
        label: 'Overall Attendance %',
        data: chartData?.areaData?.data || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4
      }
    ]
  };

  // Chart 2: Bar Chart (Department-wise Performance)
  const barData = {
    labels: chartData?.barData?.labels || [],
    datasets: [
      {
        label: 'Average CGPA',
        data: chartData?.barData?.data || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderRadius: 8
      }
    ]
  };

  // Chart 3: Doughnut Chart (Pass vs Fail)
  const doughnutData = {
    labels: chartData?.doughnutData?.labels || [],
    datasets: [
      {
        data: chartData?.doughnutData?.data || [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  // Chart 4: Radar Chart (Skill Assessment)
  const radarData = {
    labels: chartData?.radarData?.labels || [],
    datasets: (chartData?.radarData?.datasets || []).map((ds, index) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(147, 51, 234, 0.2)',
      borderColor: index === 0 ? 'rgb(59, 130, 246)' : 'rgb(147, 51, 234)',
      pointBackgroundColor: index === 0 ? 'rgb(59, 130, 246)' : 'rgb(147, 51, 234)'
    }))
  };

  // Chart 5: Polar Area (Subject Popularity / Enrollment)
  const polarData = {
    labels: chartData?.polarData?.labels || [],
    datasets: [
      {
        data: chartData?.polarData?.data || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ]
      }
    ]
  };

  // Chart 6: Line Chart (Monthly Average Marks)
  const lineData = {
    labels: chartData?.lineData?.labels || [],
    datasets: [
      {
        label: 'University Average',
        data: chartData?.lineData?.data || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.3
      }
    ]
  };

  if (!chartData) {
    return <DashboardLayout title="Advanced Analytics"><div className="p-8 text-center text-gray-500">Loading Analytics...</div></DashboardLayout>;
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

  const radarOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { ticks: { display: false }, grid: { color: 'rgba(107, 114, 128, 0.2)' }, pointLabels: { color: '#6b7280' } } },
    plugins: { legend: { position: 'bottom', labels: { color: '#6b7280' } } }
  };

  const noAxesOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#6b7280' } } }
  };

  return (
    <DashboardLayout title="Advanced Analytics">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Institution Performance</h2>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive data visualization of academic metrics.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
          <FiFilter className="text-gray-400 ml-2" />
          <select 
            className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>This Semester</option>
            <option>Last Semester</option>
            <option>This Academic Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Enrollment</p>
          <div className="flex items-end mt-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{chartData.overview?.totalStudents || 0}</h3>
            <span className="ml-2 flex items-center text-sm font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md mb-1">
              <FiTrendingUp className="mr-1" /> Active
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Attendance</p>
          <div className="flex items-end mt-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{chartData.overview?.attendance || 0}%</h3>
            <span className="ml-2 flex items-center text-sm font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md mb-1">
              Live
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average CGPA</p>
          <div className="flex items-end mt-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{chartData.overview?.cgpa || 0}</h3>
            <span className="ml-2 flex items-center text-sm font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md mb-1">
              <FiTrendingUp className="mr-1" /> Avg
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignment Completion</p>
          <div className="flex items-end mt-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{chartData.overview?.completion || 0}%</h3>
            <span className="ml-2 flex items-center text-sm font-bold text-gray-500 bg-gray-50 dark:bg-gray-900/20 px-2 py-0.5 rounded-md mb-1">
              Data
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Attendance Area Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Attendance Trend (Area Chart)</h3>
          <div className="h-64">
            <Line data={areaData} options={chartOptions} />
          </div>
        </div>

        {/* Dept Performance Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Department-wise Performance</h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Department Skill Analysis (Radar)</h3>
          <div className="h-72">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Pass vs Fail Doughnut */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Results Distribution</h3>
          <div className="h-72 flex-1 flex items-center justify-center">
            <div className="w-full h-full max-w-sm">
              <Doughnut data={doughnutData} options={noAxesOptions} />
            </div>
          </div>
        </div>

        {/* Polar Area */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Subject Enrollment (Polar Area)</h3>
          <div className="h-72 flex-1 flex items-center justify-center">
            <div className="w-full h-full max-w-sm">
              <PolarArea data={polarData} options={noAxesOptions} />
            </div>
          </div>
        </div>

        {/* Marks Trend Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Average Marks Timeline</h3>
          <div className="h-72">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
