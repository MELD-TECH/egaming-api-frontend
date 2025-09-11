import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  GamepadIcon,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Sidebar } from "../../components/Sidebar";

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

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.operator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOperator = operatorFilter === "all-operators" || 
                           report.operator.toLowerCase().includes(operatorFilter.toLowerCase());
    
    const matchesStatus = statusFilter === "all-status" || 
                         report.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesOperator && matchesStatus;
  });

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
            
            <Button className="bg-primary-500 hover:bg-primary-600 text-white h-12 px-6 rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Generate New Report
            </Button>
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
                <Button variant="outline" className="h-10">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
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
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                    <Button variant="outline" size="sm" className="h-8">
                      <LineChart className="w-4 h-4 mr-2" />
                      Line
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="h-64 bg-gray-5 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-gray-40 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-60 mb-2">Revenue Analytics Chart</h4>
                    <p className="text-sm text-gray-40 max-w-xs">
                      Interactive revenue chart showing trends over time
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Distribution */}
            <div className="bg-white rounded-xl border border-gray-20">
              <div className="p-6 border-b border-gray-20">
                <h3 className="text-lg font-bold text-gray-80">Performance Distribution</h3>
              </div>
              
              <div className="p-6">
                <div className="h-64 bg-gray-5 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-40 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-60 mb-2">Distribution Chart</h4>
                    <p className="text-sm text-gray-40 max-w-xs">
                      Performance distribution across operators
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};