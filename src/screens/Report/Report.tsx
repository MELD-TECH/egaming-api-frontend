import React, { useState } from "react";
import { Bell, Search, User, ChevronDown, Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign, Users, Activity, Gamepad2 as GamepadIcon, ChartBar as BarChart3, ChartPie as PieChart, ChartLine as LineChart, Eye, MoveHorizontal as MoreHorizontal, FileText, FileSpreadsheet } from "lucide-react";
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Sidebar } from "../../components/Sidebar";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


const reportStats = [
  {
    title: "Total Revenue",
    value: "₦125,430.89",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Total Bets",
    value: "45,231",
    change: "+8.2%",
    trend: "up",
    icon: Activity,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Active Players",
    value: "3,456",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    title: "Games Played",
    value: "23,567",
    change: "-2.1%",
    trend: "down",
    icon: GamepadIcon,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
];

const reportsData = [
  {
    id: "RPT001",
    reportName: "Monthly Revenue Report",
    operator: "Golden Gaming Ltd",
    dateGenerated: "2024-01-15",
    period: "December 2024",
    totalRevenue: "₦125,430",
    totalBets: "12,456",
    activeUsers: "2,345",
    status: "Completed",
    fileSize: "2.4 MB"
  },
  {
    id: "RPT002",
    reportName: "Quarterly Performance",
    operator: "Lucky Strike Entertainment",
    dateGenerated: "2024-01-10",
    period: "Q4 2024",
    totalRevenue: "₦89,250",
    totalBets: "8,765",
    activeUsers: "1,876",
    status: "Completed",
    fileSize: "3.1 MB"
  },
  {
    id: "RPT003",
    reportName: "Weekly Activity Summary",
    operator: "Diamond Gaming Corp",
    dateGenerated: "2024-01-08",
    period: "Week 1, Jan 2024",
    totalRevenue: "₦28,940",
    totalBets: "3,432",
    activeUsers: "1,210",
    status: "Processing",
    fileSize: "1.8 MB"
  },
  {
    id: "RPT004",
    reportName: "Annual Compliance Report",
    operator: "Royal Casino Group",
    dateGenerated: "2024-01-05",
    period: "2024",
    totalRevenue: "₦456,780",
    totalBets: "45,678",
    activeUsers: "5,432",
    status: "Completed",
    fileSize: "5.2 MB"
  },
  {
    id: "RPT005",
    reportName: "Game Performance Analysis",
    operator: "Ace Gaming Solutions",
    dateGenerated: "2024-01-03",
    period: "December 2024",
    totalRevenue: "₦67,890",
    totalBets: "6,543",
    activeUsers: "987",
    status: "Failed",
    fileSize: "2.9 MB"
  },
  {
    id: "RPT006",
    reportName: "User Engagement Report",
    operator: "Platinum Games Hub",
    dateGenerated: "2024-01-01",
    period: "Q4 2024",
    totalRevenue: "₦156,890",
    totalBets: "15,432",
    activeUsers: "3,210",
    status: "Completed",
    fileSize: "4.1 MB"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return "✓";
    case "Processing":
      return "⏳";
    case "Failed":
      return "✗";
    default:
      return "•";
  }
};

export const Report = (): JSX.Element => {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [operatorFilter, setOperatorFilter] = useState("all-operators");
  const [reportType, setReportType] = useState("all-reports");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [distributionChartType, setDistributionChartType] = useState<'pie' | 'doughnut'>('pie');

  // Download functions
  const downloadCSV = (data: typeof reportsData, filename: string) => {
    try {
      const csvData = data.map(report => ({
        'Report ID': report.id,
        'Report Name': report.reportName,
        'Operator': report.operator,
        'Period': report.period,
        'Total Revenue': report.totalRevenue,
        'Total Bets': report.totalBets,
        'Active Users': report.activeUsers,
        'Status': report.status,
        'Date Generated': report.dateGenerated,
        'File Size': report.fileSize
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const downloadPDF = (data: typeof reportsData, filename: string) => {
    try {
      // Create a temporary div with the report content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Create the HTML content
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #056232; padding-bottom: 20px;">
          <h1 style="color: #056232; margin: 0; font-size: 24px;">ESGC Game Staking</h1>
          <h2 style="color: #333; margin: 5px 0; font-size: 18px;">Reports & Analytics</h2>
          <p style="color: #666; margin: 5px 0; font-size: 12px;">Generated on: ${new Date().toLocaleDateString()}</p>
          <p style="color: #666; margin: 5px 0; font-size: 12px;">Total Records: ${data.length}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #056232; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Report ID</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Report Name</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Operator</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Period</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Revenue</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Total Bets</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Active Users</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Status</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px;">Date Generated</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((report, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#f8fafc' : 'white'};">
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.id}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.reportName}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.operator}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.period}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.totalRevenue}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.totalBets}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.activeUsers}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px; color: ${
                  report.status === 'Completed' ? '#059669' : 
                  report.status === 'Processing' ? '#d97706' : '#dc2626'
                }; font-weight: bold;">${report.status}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-size: 10px;">${report.dateGenerated}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      // Add to DOM temporarily
      document.body.appendChild(tempDiv);
      
      // Convert to canvas and then to PDF
      html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        // Remove temporary div
        document.body.removeChild(tempDiv);
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save(`${filename}.pdf`);
      }).catch(error => {
        // Remove temporary div in case of error
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  const handleExportAll = (format: 'csv' | 'pdf') => {
    const filename = `All_Reports_${new Date().toISOString().split('T')[0]}`;
    if (format === 'csv') {
      downloadCSV(filteredReports, filename);
    } else {
      downloadPDF(filteredReports, filename);
    }
  };

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.operator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOperator = operatorFilter === "all-operators" || 
                           report.operator.toLowerCase().includes(operatorFilter.toLowerCase());
    
    const matchesStatus = statusFilter === "all-status" || 
                         report.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesOperator && matchesStatus;
  });

  // Chart data and options
  const chartData = {
    labels: filteredReports.map(report => report.operator.split(' ')[0]), // Use first word of operator name
    datasets: [
      {
        label: 'Revenue (₦)',
        data: filteredReports.map(report => parseFloat(report.totalRevenue.replace('₦', '').replace(',', ''))),
        borderColor: '#056232',
        backgroundColor: 'rgba(5, 98, 50, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Bets',
        data: filteredReports.map(report => parseFloat(report.totalBets.replace(',', ''))),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // Performance Distribution Chart Data
  const distributionData = {
    labels: filteredReports.map(report => report.operator),
    datasets: [
      {
        label: 'Revenue Distribution',
        data: filteredReports.map(report => parseFloat(report.totalRevenue.replace('₦', '').replace(',', ''))),
        backgroundColor: [
          '#056232', // Primary green
          '#7c3aed', // Purple
          '#dc2626', // Red
          '#ea580c', // Orange
          '#0891b2', // Cyan
          '#7c2d12', // Brown
          '#4338ca', // Indigo
          '#be185d', // Pink
        ],
        borderColor: [
          '#056232',
          '#7c3aed',
          '#dc2626',
          '#ea580c',
          '#0891b2',
          '#7c2d12',
          '#4338ca',
          '#be185d',
        ],
        borderWidth: 2,
      }
    ]
  };

  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₦${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-5">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-20 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-80">
                Reports & Analytics
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-40 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 h-10 bg-gray-5 border-gray-30 rounded-full"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-60" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-60" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-80 mb-2">
                Reports & Analytics
              </h2>
              <p className="text-gray-60">
                Generate and manage comprehensive reports for all gaming operations
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {reportStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success-50" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        stat.trend === "up" ? "text-success-50" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-60">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-80">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-60" />
                  <span className="text-sm font-semibold text-gray-80">Filter by:</span>
                </div>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={operatorFilter} onValueChange={setOperatorFilter}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="All Operators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-operators">All Operators</SelectItem>
                    <SelectItem value="golden-gaming">Golden Gaming Ltd</SelectItem>
                    <SelectItem value="lucky-strike">Lucky Strike Entertainment</SelectItem>
                    <SelectItem value="diamond-gaming">Diamond Gaming Corp</SelectItem>
                    <SelectItem value="royal-casino">Royal Casino Group</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="h-10"
                  onClick={() => handleExportAll('csv')}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  className="h-10"
                  onClick={() => handleExportAll('pdf')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Export Actions */}
          <div className="bg-white rounded-xl border border-gray-20 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-80 mb-1">Quick Export</h4>
                <p className="text-xs text-gray-60">Export filtered reports ({filteredReports.length} records)</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportAll('csv')}
                  className="h-9"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportAll('pdf')}
                  className="h-9"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white h-9"
                  onClick={() => {
                    handleExportAll('csv');
                    setTimeout(() => handleExportAll('pdf'), 500);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Both
                </Button>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-xl border border-gray-20">
            <div className="p-6 border-b border-gray-20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-80">All Reports</h3>
                <div className="text-sm text-gray-60">
                  Showing {filteredReports.length} of {reportsData.length} reports
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Report Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Operator
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Period
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Revenue
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Total Bets
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Active Users
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Generated
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-80 text-sm">
                              {report.reportName}
                            </p>
                            <p className="text-xs text-gray-60">
                              {report.id} • {report.fileSize}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-80">
                        {report.operator}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {report.period}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-80">
                        {report.totalRevenue}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {report.totalBets}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {report.activeUsers}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {getStatusIcon(report.status)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {report.dateGenerated}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => downloadCSV([report], `${report.reportName.replace(/\s+/g, '_')}_${report.id}`)}
                            title="Download CSV"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => downloadPDF([report], `${report.reportName.replace(/\s+/g, '_')}_${report.id}`)}
                            title="Download PDF"
                          >
                            <FileText className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const filename = `${report.reportName.replace(/\s+/g, '_')}_${report.id}`;
                              downloadCSV([report], filename);
                              setTimeout(() => downloadPDF([report], filename), 500);
                            }}
                            title="Download Both"
                          >
                            <Download className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4 text-gray-60" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends Chart */}
            <div className="bg-white rounded-xl border border-gray-20">
              <div className="p-6 border-b border-gray-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-80">Revenue Trends</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={chartType === 'line' ? 'default' : 'outline'} 
                      size="sm" 
                      className="h-8"
                      onClick={() => setChartType('line')}
                    >
                      <LineChart className="w-4 h-4 mr-2" />
                      Line
                    </Button>
                    <Button 
                      variant={chartType === 'bar' ? 'default' : 'outline'} 
                      size="sm" 
                      className="h-8"
                      onClick={() => setChartType('bar')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Bar
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="h-80">
                  {filteredReports.length > 0 ? (
                    chartType === 'line' ? (
                      <Line data={chartData} options={chartOptions} />
                    ) : (
                      <Bar data={chartData} options={chartOptions} />
                    )
                  ) : (
                    <div className="h-full bg-gray-5 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-gray-40 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-60 mb-2">No Data Available</h4>
                        <p className="text-sm text-gray-40 max-w-xs">
                          No reports match the current filters
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Distribution */}
            <div className="bg-white rounded-xl border border-gray-20">
              <div className="p-6 border-b border-gray-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-80">Performance Distribution</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={distributionChartType === 'pie' ? 'default' : 'outline'} 
                      size="sm" 
                      className="h-8"
                      onClick={() => setDistributionChartType('pie')}
                    >
                      <PieChart className="w-4 h-4 mr-2" />
                      Pie
                    </Button>
                    <Button 
                      variant={distributionChartType === 'doughnut' ? 'default' : 'outline'} 
                      size="sm" 
                      className="h-8"
                      onClick={() => setDistributionChartType('doughnut')}
                    >
                      <PieChart className="w-4 h-4 mr-2" />
                      Doughnut
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="h-80">
                  {filteredReports.length > 0 ? (
                    distributionChartType === 'pie' ? (
                      <Pie data={distributionData} options={distributionOptions} />
                    ) : (
                      <Doughnut data={distributionData} options={distributionOptions} />
                    )
                  ) : (
                    <div className="h-full bg-gray-5 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-gray-40 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-60 mb-2">No Data Available</h4>
                        <p className="text-sm text-gray-40 max-w-xs">
                          No reports match the current filters
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};