import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Building,
  Eye,
  MoreHorizontal,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Sidebar } from "../../components/Sidebar";

const dashboardStats = [
  {
    title: "Total Revenue",
    value: "₦2,420,000",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Total Operators",
    value: "24",
    change: "+12.5%",
    trend: "up",
    icon: Building,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Active Users",
    value: "3,456",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    title: "Total Transactions",
    value: "45,231",
    change: "-2.1%",
    trend: "down",
    icon: Activity,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  }
];

const recentOperators = [
  {
    id: "OP001",
    name: "Golden Gaming Ltd",
    status: "Active",
    revenue: "₦125,430",
    joinDate: "Jan 15, 2024",
    avatar: "GG"
  },
  {
    id: "OP002", 
    name: "Lucky Strike Entertainment",
    status: "Active",
    revenue: "₦89,250",
    joinDate: "Feb 20, 2024",
    avatar: "LS"
  },
  {
    id: "OP003",
    name: "Ace Gaming Solutions", 
    status: "Pending",
    revenue: "₦0",
    joinDate: "Mar 10, 2024",
    avatar: "AG"
  },
  {
    id: "OP004",
    name: "Royal Casino Group",
    status: "Suspended", 
    revenue: "₦67,890",
    joinDate: "Nov 5, 2023",
    avatar: "RC"
  }
];

const recentTransactions = [
  {
    id: "TXN001",
    operator: "Golden Gaming Ltd",
    amount: "₦15,000",
    type: "Deposit",
    status: "Completed",
    date: "2 hours ago"
  },
  {
    id: "TXN002",
    operator: "Lucky Strike Entertainment", 
    amount: "₦8,500",
    type: "Withdrawal",
    status: "Pending",
    date: "4 hours ago"
  },
  {
    id: "TXN003",
    operator: "Diamond Gaming Corp",
    amount: "₦22,300",
    type: "Deposit", 
    status: "Completed",
    date: "6 hours ago"
  },
  {
    id: "TXN004",
    operator: "Royal Casino Group",
    amount: "₦5,750",
    type: "Withdrawal",
    status: "Failed",
    date: "1 day ago"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Suspended":
      return "bg-red-100 text-red-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const Dashboard = (): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

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
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-40 w-4 h-4" />
                <Input
                  placeholder="Search..."
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
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-500 to-brand-60 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, Admin!
                </h2>
                <p className="text-white/80 text-lg">
                  Here's what's happening with your gaming platform today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                  <Activity className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-20 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-success-50" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
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
                  <p className="text-xs text-gray-40">from last month</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Operators */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-20">
              <div className="p-6 border-b border-gray-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-80">
                    Recent Operators
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/operators')}
                  >
                    View All
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {recentOperators.map((operator, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-5 rounded-lg hover:bg-gray-20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {operator.avatar}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-80 text-sm">
                          {operator.name}
                        </h4>
                        <p className="text-xs text-gray-60">
                          ID: {operator.id} • Joined {operator.joinDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-80 text-sm">
                          {operator.revenue}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operator.status)}`}
                        >
                          {operator.status}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/operators/${operator.id}`)}
                      >
                        <Eye className="w-4 h-4 text-gray-60" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-20">
              <div className="p-6 border-b border-gray-20">
                <h3 className="text-lg font-bold text-gray-80">Quick Actions</h3>
              </div>
              
              <div className="p-6 space-y-3">
                <Button 
                  className="w-full justify-start h-12 bg-primary-500 hover:bg-primary-600 text-white"
                  onClick={() => navigate('/operators')}
                >
                  <Building className="w-5 h-5 mr-3" />
                  Add New Operator
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12"
                  onClick={() => navigate('/reports')}
                >
                  <Activity className="w-5 h-5 mr-3" />
                  Generate Report
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Manage Users
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12"
                >
                  <DollarSign className="w-5 h-5 mr-3" />
                  View Transactions
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-gray-20">
            <div className="p-6 border-b border-gray-20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-80">
                  Recent Transactions
                </h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Transaction ID
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Operator
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Amount
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Type
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Date
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-80">
                        {transaction.id}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {transaction.operator}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-80">
                        {transaction.amount}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === "Deposit" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {transaction.date}
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4 text-gray-60" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-80">Revenue Overview</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 days
                </Button>
              </div>
            </div>
            
            <div className="h-80 bg-gray-5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-40 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-60 mb-2">Revenue Analytics Chart</h4>
                <p className="text-sm text-gray-40 max-w-xs">
                  Interactive revenue chart showing trends and performance metrics over time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};