import { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import { toast } from 'react-toastify';
import { FiDownload, FiFileText } from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AdminReports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [loading, setLoading] = useState(false);

  const generateReport = async (format) => {
    setLoading(true);
    try {
      if (reportType === 'attendance') {
        const { data } = await axios.get('/api/attendance', { withCredentials: true });
        if (format === 'pdf') generateAttendancePDF(data);
        if (format === 'excel') generateAttendanceExcel(data);
      } else if (reportType === 'marks') {
        const { data } = await axios.get('/api/marks', { withCredentials: true });
        if (format === 'pdf') generateMarksPDF(data);
        if (format === 'excel') generateMarksExcel(data);
      }
      toast.success(`${format.toUpperCase()} report generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateAttendancePDF = (data) => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 14, 15);
    
    const tableData = data.map(row => [
      new Date(row.attendance_date).toLocaleDateString(),
      row.full_name,
      row.roll_number,
      row.subject_name,
      row.attendance_status
    ]);

    doc.autoTable({
      head: [['Date', 'Student Name', 'Roll No', 'Subject', 'Status']],
      body: tableData,
      startY: 20,
    });
    doc.save('attendance_report.pdf');
  };

  const generateAttendanceExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data.map(row => ({
      Date: new Date(row.attendance_date).toLocaleDateString(),
      'Student Name': row.full_name,
      'Roll No': row.roll_number,
      Subject: row.subject_name,
      Status: row.attendance_status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "attendance_report.xlsx");
  };

  const generateMarksPDF = (data) => {
    const doc = new jsPDF();
    doc.text('Performance Report', 14, 15);
    
    const tableData = data.map(row => [
      row.full_name,
      row.subject_name,
      row.semester,
      row.total_marks,
      row.percentage + '%',
      row.grade
    ]);

    doc.autoTable({
      head: [['Student Name', 'Subject', 'Semester', 'Total Marks', 'Percentage', 'Grade']],
      body: tableData,
      startY: 20,
    });
    doc.save('performance_report.pdf');
  };

  const generateMarksExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data.map(row => ({
      'Student Name': row.full_name,
      Subject: row.subject_name,
      Semester: row.semester,
      'Total Marks': row.total_marks,
      Percentage: row.percentage + '%',
      Grade: row.grade
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Performance");
    XLSX.writeFile(wb, "performance_report.xlsx");
  };

  return (
    <DashboardLayout title="Reports">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto mt-10">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg mr-4">
            <FiFileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generate Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Export attendance and performance data</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Report Type</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="attendance">Attendance Report</option>
              <option value="marks">Performance Report</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => generateReport('pdf')}
              disabled={loading}
              className="flex-1 flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-medium disabled:opacity-50"
            >
              <FiDownload className="mr-2" /> Export to PDF
            </button>
            <button 
              onClick={() => generateReport('excel')}
              disabled={loading}
              className="flex-1 flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-medium disabled:opacity-50"
            >
              <FiDownload className="mr-2" /> Export to Excel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
