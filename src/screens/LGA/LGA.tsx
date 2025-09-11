import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Phone,
  Mail,
  Star,
  Lock as LockIcon,
  EyeOff as EyeOffIcon,
  Eye as EyeIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "../../components/ui/dialog";
import { Sidebar } from "../../components/Sidebar";

const lgaData = [
  {
    id: "LGA001",
    name: "Ikeja",
    state: "Lagos",
    chairman: "Hon. Adebayo Johnson",
    email: "chairman@ikeja.gov.ng",
    phone: "+234 801 234 5678",
    status: "Active",
    totalOperators: 45,
    totalRevenue: "₦2,450,000",
    monthlyRevenue: "₦245,000",
    lastActivity: "2 hours ago",
    dateRegistered: "2024-01-15",
    population: "313,196",
    area: "49.92 km²",
    rating: 4.8,
    growth: "+12.5%",
    avatar: "IK"
  },
  {
    id: "LGA002",
    name: "Victoria Island",
    state: "Lagos",
    chairman: "Hon. Sarah Adebisi",
    email: "chairman@vi.gov.ng",
    phone: "+234 802 345 6789",
    status: "Active",
    totalOperators: 32,
    totalRevenue: "₦1,890,000",
    monthlyRevenue: "₦189,000",
    lastActivity: "1 day ago",
    dateRegistered: "2024-02-20",
    population: "267,988",
    area: "8.4 km²",
    rating: 4.6,
    growth: "+8.2%",
    avatar: "VI"
  },
  {
    id: "LGA003",
    name: "Surulere",
    state: "Lagos",
    chairman: "Hon. Michael Okafor",
    email: "chairman@surulere.gov.ng",
    phone: "+234 803 456 7890",
    status: "Pending",
    totalOperators: 0,
    totalRevenue: "₦0",
    monthlyRevenue: "₦0",
    lastActivity: "3 days ago",
    dateRegistered: "2024-03-10",
    population: "503,975",
    area: "23.0 km²",
    rating: 0,
    growth: "0%",
    avatar: "SU"
  },
  {
    id: "LGA004",
    name: "Alimosho",
    state: "Lagos",
    chairman: "Hon. Fatima Bello",
    email: "chairman@alimosho.gov.ng",
    phone: "+234 804 567 8901",
    status: "Suspended",
    totalOperators: 28,
    totalRevenue: "₦1,250,000",
    monthlyRevenue: "₦0",
    lastActivity: "1 week ago",
    dateRegistered: "2023-11-05",
    population: "1,277,714",
    area: "137.8 km²",
    rating: 3.2,
    growth: "-5.1%",
    avatar: "AL"
  },
  {
    id: "LGA005",
    name: "Ikorodu",
    state: "Lagos",
    chairman: "Hon. David Adeyemi",
    email: "chairman@ikorodu.gov.ng",
    phone: "+234 805 678 9012",
    status: "Active",
    totalOperators: 38,
    totalRevenue: "₦1,680,000",
    monthlyRevenue: "₦168,000",
    lastActivity: "5 hours ago",
    dateRegistered: "2024-01-28",
    population: "535,619",
    area: "345.5 km²",
    rating: 4.4,
    growth: "+15.3%",
    avatar: "IK"
  },
  {
    id: "LGA006",
    name: "Epe",
    state: "Lagos",
    chairman: "Hon. Aisha Mohammed",
    email: "chairman@epe.gov.ng",
    phone: "+234 806 789 0123",
    status: "Active",
    totalOperators: 15,
    totalRevenue: "₦890,000",
    monthlyRevenue: "₦89,000",
    lastActivity: "30 minutes ago",
    dateRegistered: "2024-02-14",
    population: "181,409",
    area: "1,426.0 km²",
    rating: 4.1,
    growth: "+6.8%",
    avatar: "EP"
  }
];

const lgaStats = [
  {
    title: "Total LGAs",
    value: "20",
    change: "+2",
    trend: "up",
    icon: MapPin,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Active LGAs",
    value: "18",
    change: "+1",
    trend: "up",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Total Operators",
    value: "158",
    change: "+12",
    trend: "up",
    icon: Building,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    title: "Total Revenue",
    value: "₦8,160,000",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="w-4 h-4 text-success-50" />;
    case "Pending":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "Suspended":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-40" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Suspended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const LGA = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lgaToDelete, setLgaToDelete] = useState<typeof lgaData[0] | null>(null);
  const [showCreateLGADialog, setShowCreateLGADialog] = useState(false);
  const [showEditLGADialog, setShowEditLGADialog] = useState(false);
  const [lgaToEdit, setLgaToEdit] = useState<typeof lgaData[0] | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [formData, setFormData] = useState({
    lgaName: "",
    state: "",
    chairmanFirstName: "",
    chairmanLastName: "",
    email: "",
    phone: "",
    password: "",
    population: "",
    area: ""
  });
  const [editFormData, setEditFormData] = useState({
    lgaName: "",
    state: "",
    chairmanFirstName: "",
    chairmanLastName: "",
    email: "",
    phone: "",
    password: "",
    population: "",
    area: ""
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const filteredLGAs = lgaData.filter(lga => {
    const matchesSearch = lga.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lga.chairman.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lga.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lga.status.toLowerCase() === statusFilter;
    const matchesState = stateFilter === "all" || lga.state.toLowerCase() === stateFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesState;
  });

  const handleDeleteClick = (lga: typeof lgaData[0]) => {
    setLgaToDelete(lga);
    setShowDeleteDialog(true);
  };

  const handleEditClick = (lga: typeof lgaData[0]) => {
    setLgaToEdit(lga);
    // Pre-populate form with existing data
    const chairmanNames = lga.chairman.replace('Hon. ', '').split(' ');
    setEditFormData({
      lgaName: lga.name,
      state: lga.state.toLowerCase(),
      chairmanFirstName: chairmanNames[0] || '',
      chairmanLastName: chairmanNames.slice(1).join(' ') || '',
      email: lga.email,
      phone: lga.phone.replace('+234 ', ''),
      password: '',
      population: lga.population.replace(',', ''),
      area: lga.area.replace(' km²', '')
    });
    setShowEditLGADialog(true);
  };

  const handleDelete = () => {
    if (lgaToDelete) {
      console.log("Deleting LGA:", lgaToDelete.id);
      setShowDeleteDialog(false);
      setLgaToDelete(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateLGA = () => {
    console.log("Creating LGA:", formData);
    // Reset form
    setFormData({
      lgaName: "",
      state: "",
      chairmanFirstName: "",
      chairmanLastName: "",
      email: "",
      phone: "",
      password: "",
      population: "",
      area: ""
    });
    setShowCreateLGADialog(false);
  };

  const handleUpdateLGA = () => {
    if (lgaToEdit) {
      console.log("Updating LGA:", lgaToEdit.id, editFormData);
      // Here you would typically update the LGA in your data store
      // For now, we'll just close the dialog
      setShowEditLGADialog(false);
      setLgaToEdit(null);
      // Reset form
      setEditFormData({
        lgaName: "",
        state: "",
        chairmanFirstName: "",
        chairmanLastName: "",
        email: "",
        phone: "",
        password: "",
        population: "",
        area: ""
      });
    }
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
                LGA Management
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-40 w-4 h-4" />
                <Input
                  placeholder="Search LGAs..."
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
                Local Government Areas
              </h2>
              <p className="text-gray-60">
                Manage and monitor all registered Local Government Areas
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-12 px-6 rounded-full border-gray-30">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button 
                className="bg-primary-500 hover:bg-primary-600 text-white h-12 px-6 rounded-full"
                onClick={() => setShowCreateLGADialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New LGA
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lgaStats.map((stat, index) => (
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
                  <p className="text-xs text-gray-40">from last month</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-60" />
                  <span className="text-sm font-semibold text-gray-80">Filter by:</span>
                </div>
                
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="rivers">Rivers</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="revenue-desc">Highest Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-60">
                Showing {filteredLGAs.length} of {lgaData.length} LGAs
              </div>
            </div>
          </div>

          {/* LGA Table */}
          <div className="bg-white rounded-xl border border-gray-20">
            <div className="p-6 border-b border-gray-20">
              <h3 className="text-lg font-bold text-gray-80">All LGAs</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      LGA Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      State
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Chairman
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Contact
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Operators
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Revenue
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Population
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Registered
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLGAs.map((lga, index) => (
                    <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {lga.avatar}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-80 text-sm">
                              {lga.name}
                            </p>
                            <p className="text-xs text-gray-60">
                              {lga.id} • {lga.area}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-80">
                        {lga.state}
                      </td>
                      <td className="p-4 text-sm text-gray-80">
                        {lga.chairman}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-40" />
                            <span className="text-xs text-gray-60">{lga.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-40" />
                            <span className="text-xs text-gray-60">{lga.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(lga.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lga.status)}`}>
                            {lga.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-80">
                        {lga.totalOperators}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-80">{lga.monthlyRevenue}</p>
                          <p className="text-xs text-gray-60">Monthly</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {lga.population}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-40" />
                          <span className="text-sm text-gray-60">{lga.dateRegistered}</span>
                        </div>
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
                            onClick={() => handleEditClick(lga)}
                          >
                            <Edit className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteClick(lga)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-80">
                  Delete LGA
                </DialogTitle>
                <DialogDescription className="text-gray-60 mt-2">
                  Are you sure you want to delete "{lgaToDelete?.name}"? This action cannot be undone and will permanently remove all LGA data and associated records.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 h-11 border-gray-30 text-gray-80 hover:bg-gray-5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete LGA
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit LGA Dialog */}
          <Dialog open={showEditLGADialog} onOpenChange={setShowEditLGADialog}>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Edit className="w-6 h-6 text-primary-500" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-80">
                  Edit LGA
                </DialogTitle>
                <DialogDescription className="text-gray-60 mt-2">
                  Update the details for {lgaToEdit?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* LGA Name Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    LGA Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-600" />
                    </div>
                    <Input
                      value={editFormData.lgaName}
                      onChange={(e) => handleEditInputChange("lgaName", e.target.value)}
                      placeholder="Enter LGA Name"
                      className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                    />
                  </div>
                </div>
          {/* Create LGA Dialog */}
          <Dialog open={showCreateLGADialog} onOpenChange={setShowCreateLGADialog}>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-primary-500" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-80">
                  Add New LGA
                </DialogTitle>
                <DialogDescription className="text-gray-60 mt-2">
                  Fill in the details to register a new Local Government Area
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* LGA Name Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    LGA Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-600" />
                    </div>
                    <Input
                      value={formData.lgaName}
                      onChange={(e) => handleInputChange("lgaName", e.target.value)}
                      placeholder="Enter LGA Name"
                      className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                    />
                  </div>
                </div>

                {/* State Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    State
                  </Label>
                  <Select value={editFormData.state} onValueChange={(value) => handleEditInputChange("state", value)}>
                    <SelectTrigger className="h-12 bg-white border-gray-30 rounded-full">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="rivers">Rivers</SelectItem>
                      <SelectItem value="ogun">Ogun</SelectItem>
                      <SelectItem value="kaduna">Kaduna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Chairman Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Chairman First Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={editFormData.chairmanFirstName}
                        onChange={(e) => handleEditInputChange("chairmanFirstName", e.target.value)}
                        placeholder="First Name"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Chairman Last Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={editFormData.chairmanLastName}
                        onChange={(e) => handleEditInputChange("chairmanLastName", e.target.value)}
                        placeholder="Last Name"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-600" />
                    </div>
                    <Input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => handleEditInputChange("email", e.target.value)}
                      placeholder="example@gmail.com"
                      className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Phone Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    Phone Number
                  </Label>
                  <div className="flex h-12 bg-white rounded-full border border-gray-30">
                    <div className="inline-flex items-center gap-1.5 px-3 bg-gray-5 border-r border-gray-30 rounded-l-full">
                      <span className="text-sm font-bold text-slate-600">+234</span>
                    </div>
                    <Input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => handleEditInputChange("phone", e.target.value)}
                      placeholder="(000) 000-0000"
                      className="flex-1 border-0 bg-transparent rounded-r-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    Update Password (Optional)
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-slate-600" />
                    </div>
                    <Input
                      type={showEditPassword ? "text" : "password"}
                      value={editFormData.password}
                      onChange={(e) => handleEditInputChange("password", e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                    >
                      {showEditPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Population and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Population
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={editFormData.population}
                        onChange={(e) => handleEditInputChange("population", e.target.value)}
                        placeholder="Population Count"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Area (km²)
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={editFormData.area}
                        onChange={(e) => handleEditInputChange("area", e.target.value)}
                        placeholder="Area in km²"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowEditLGADialog(false)}
                  className="flex-1 h-12 border-gray-30 text-gray-80 hover:bg-gray-5 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateLGA}
                  disabled={!editFormData.lgaName || !editFormData.state || !editFormData.chairmanFirstName || !editFormData.chairmanLastName || !editFormData.email}
                  className="flex-1 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update LGA
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

                {/* State Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    State
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger className="h-12 bg-white border-gray-30 rounded-full">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="rivers">Rivers</SelectItem>
                      <SelectItem value="ogun">Ogun</SelectItem>
                      <SelectItem value="kaduna">Kaduna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Chairman Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Chairman First Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={formData.chairmanFirstName}
                        onChange={(e) => handleInputChange("chairmanFirstName", e.target.value)}
                        placeholder="First Name"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Chairman Last Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={formData.chairmanLastName}
                        onChange={(e) => handleInputChange("chairmanLastName", e.target.value)}
                        placeholder="Last Name"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-600" />
                    </div>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="example@gmail.com"
                      className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Phone Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    Phone Number
                  </Label>
                  <div className="flex h-12 bg-white rounded-full border border-gray-30">
                    <div className="inline-flex items-center gap-1.5 px-3 bg-gray-5 border-r border-gray-30 rounded-l-full">
                      <span className="text-sm font-bold text-slate-600">+234</span>
                    </div>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(000) 000-0000"
                      className="flex-1 border-0 bg-transparent rounded-r-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-80">
                    Create Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-slate-600" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="*****************"
                      className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Population and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Population
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={formData.population}
                        onChange={(e) => handleInputChange("population", e.target.value)}
                        placeholder="Population Count"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Area (km²)
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={formData.area}
                        onChange={(e) => handleInputChange("area", e.target.value)}
                        placeholder="Area in km²"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateLGADialog(false)}
                  className="flex-1 h-12 border-gray-30 text-gray-80 hover:bg-gray-5 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateLGA}
                  disabled={!formData.lgaName || !formData.state || !formData.chairmanFirstName || !formData.chairmanLastName || !formData.email}
                  className="flex-1 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add LGA
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};