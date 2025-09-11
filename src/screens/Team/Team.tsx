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
  UserPlus,
  Shield,
  ShieldCheck,
  Crown,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UserIcon,
  BuildingIcon
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

const teamData = [
  {
    id: "USR001",
    name: "John Smith",
    email: "john.smith@esgc.com",
    phone: "+234 801 234 5678",
    role: "Super Admin",
    department: "Management",
    status: "Active",
    lastLogin: "2 hours ago",
    dateJoined: "2024-01-15",
    permissions: ["All Access"],
    avatar: "JS"
  },
  {
    id: "USR002",
    name: "Sarah Johnson",
    email: "sarah.j@esgc.com",
    phone: "+234 802 345 6789",
    role: "Admin",
    department: "Operations",
    status: "Active",
    lastLogin: "1 day ago",
    dateJoined: "2024-02-20",
    permissions: ["User Management", "Reports", "Operators"],
    avatar: "SJ"
  },
  {
    id: "USR003",
    name: "Michael Brown",
    email: "m.brown@esgc.com",
    phone: "+234 803 456 7890",
    role: "Manager",
    department: "Compliance",
    status: "Active",
    lastLogin: "3 hours ago",
    dateJoined: "2024-03-10",
    permissions: ["Reports", "Compliance"],
    avatar: "MB"
  },
  {
    id: "USR004",
    name: "Emma Wilson",
    email: "emma.w@esgc.com",
    phone: "+234 804 567 8901",
    role: "Analyst",
    department: "Analytics",
    status: "Inactive",
    lastLogin: "1 week ago",
    dateJoined: "2023-11-05",
    permissions: ["Reports", "Analytics"],
    avatar: "EW"
  },
  {
    id: "USR005",
    name: "David Lee",
    email: "david.lee@esgc.com",
    phone: "+234 805 678 9012",
    role: "Support",
    department: "Customer Service",
    status: "Active",
    lastLogin: "5 hours ago",
    dateJoined: "2024-01-28",
    permissions: ["Support", "Basic Reports"],
    avatar: "DL"
  },
  {
    id: "USR006",
    name: "Lisa Chen",
    email: "lisa.c@esgc.com",
    phone: "+234 806 789 0123",
    role: "Developer",
    department: "Technology",
    status: "Active",
    lastLogin: "30 minutes ago",
    dateJoined: "2024-02-14",
    permissions: ["System Access", "Technical Reports"],
    avatar: "LC"
  }
];

const teamStats = [
  {
    title: "Total Team Members",
    value: "24",
    change: "+2",
    trend: "up",
    icon: Users,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Active Users",
    value: "22",
    change: "+1",
    trend: "up",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Admins",
    value: "5",
    change: "0",
    trend: "neutral",
    icon: Shield,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    title: "Pending Invites",
    value: "3",
    change: "+1",
    trend: "up",
    icon: Clock,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  }
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Super Admin":
      return <Crown className="w-4 h-4 text-yellow-600" />;
    case "Admin":
      return <ShieldCheck className="w-4 h-4 text-purple-600" />;
    case "Manager":
      return <Shield className="w-4 h-4 text-blue-600" />;
    default:
      return <User className="w-4 h-4 text-gray-600" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Super Admin":
      return "bg-yellow-100 text-yellow-800";
    case "Admin":
      return "bg-purple-100 text-purple-800";
    case "Manager":
      return "bg-blue-100 text-blue-800";
    case "Analyst":
      return "bg-green-100 text-green-800";
    case "Support":
      return "bg-orange-100 text-orange-800";
    case "Developer":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="w-4 h-4 text-success-50" />;
    case "Inactive":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "Pending":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-40" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const Team = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [departmentFilter, setDepartmentFilter] = useState("all-departments");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<typeof teamData[0] | null>(null);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<typeof teamData[0] | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const filteredTeam = teamData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all-roles" || user.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === "all-status" || user.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDepartment = departmentFilter === "all-departments" || user.department.toLowerCase().includes(departmentFilter.toLowerCase());
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const handleDeleteClick = (user: typeof teamData[0]) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleEditClick = (user: typeof teamData[0]) => {
    setUserToEdit(user);
    // Pre-populate form with existing data
    const nameParts = user.name.split(' ');
    setEditFormData({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email,
      phone: user.phone.replace('+234 ', ''),
      role: user.role.toLowerCase().replace(' ', '-'),
      department: user.department.toLowerCase().replace(' ', '-'),
      password: '',
      confirmPassword: ''
    });
    setShowEditUserDialog(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      console.log("Deleting user:", userToDelete.id);
      setShowDeleteDialog(false);
      setUserToDelete(null);
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

  const handleCreateUser = () => {
    console.log("Creating user:", formData);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      password: "",
      confirmPassword: ""
    });
    setShowCreateUserDialog(false);
  };

  const handleUpdateUser = () => {
    if (userToEdit) {
      console.log("Updating user:", userToEdit.id, editFormData);
      // Here you would typically update the user in your data store
      // For now, we'll just close the dialog
      setShowEditUserDialog(false);
      setUserToEdit(null);
      // Reset form
      setEditFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        password: "",
        confirmPassword: ""
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
                Team Management
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-40 w-4 h-4" />
                <Input
                  placeholder="Search team members..."
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
                Team Management
              </h2>
              <p className="text-gray-60">
                Manage team members, roles, and permissions
              </p>
            </div>
            
            <Button 
              className="bg-primary-500 hover:bg-primary-600 text-white h-12 px-6 rounded-full"
              onClick={() => setShowCreateUserDialog(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-20 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-semibold ${
                      stat.trend === "up" ? "text-success-50" : 
                      stat.trend === "down" ? "text-red-500" : "text-gray-60"
                    }`}>
                      {stat.change !== "0" && (stat.trend === "up" ? "+" : "")}
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

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-60" />
                  <span className="text-sm font-semibold text-gray-80">Filter by:</span>
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-roles">All Roles</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-departments">All Departments</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-60">
                Showing {filteredTeam.length} of {teamData.length} team members
              </div>
            </div>
          </div>

          {/* Team Table */}
          <div className="bg-white rounded-xl border border-gray-20">
            <div className="p-6 border-b border-gray-20">
              <h3 className="text-lg font-bold text-gray-80">Team Members</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Email
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Phone
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Role
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Department
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Last Login
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Joined
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeam.map((user, index) => (
                    <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.avatar}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-80 text-sm">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-60">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-40" />
                          <span className="text-sm text-gray-80">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-40" />
                          <span className="text-sm text-gray-60">{user.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {user.department}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {user.lastLogin}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-40" />
                          <span className="text-sm text-gray-60">{user.dateJoined}</span>
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
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteClick(user)}
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
                  Remove Team Member
                </DialogTitle>
                <DialogDescription className="text-gray-60 mt-2">
                  Are you sure you want to remove "{userToDelete?.name}" from the team? This action cannot be undone and will revoke all access permissions.
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
                  Remove Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Edit className="w-6 h-6 text-primary-500" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-80">
                  Edit User
                </DialogTitle>
                <DialogDescription className="text-gray-60 mt-2">
                  Update the details for {userToEdit?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      First Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={editFormData.firstName}
                        onChange={(e) => handleEditInputChange("firstName", e.target.value)}
                        placeholder="First Name"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Last Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={editFormData.lastName}
                        onChange={(e) => handleEditInputChange("lastName", e.target.value)}
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

                {/* Role and Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Role
                    </Label>
                    <Select value={editFormData.role} onValueChange={(value) => handleEditInputChange("role", value)}>
                      <SelectTrigger className="h-12 bg-white border-gray-30 rounded-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Department
                    </Label>
                    <Select value={editFormData.department} onValueChange={(value) => handleEditInputChange("department", value)}>
                      <SelectTrigger className="h-12 bg-white border-gray-30 rounded-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="customer-service">Customer Service</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Fields - Optional for editing */}
                <div className="border-t border-gray-20 pt-6">
                  <h4 className="text-sm font-bold text-gray-80 mb-4">Update Password (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-80">
                        New Password
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIcon className="h-5 w-5 text-slate-600" />
                        </div>
                        <Input
                          type={showEditPassword ? "text" : "password"}
                          value={editFormData.password}
                          onChange={(e) => handleEditInputChange("password", e.target.value)}
                          placeholder="Leave blank to keep current"
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
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-80">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIcon className="h-5 w-5 text-slate-600" />
                        </div>
                        <Input
                          type={showEditConfirmPassword ? "text" : "password"}
                          value={editFormData.confirmPassword}
                          onChange={(e) => handleEditInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm new password"
                          className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                        >
                          {showEditConfirmPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowEditUserDialog(false)}
                  className="flex-1 h-12 border-gray-30 text-gray-80 hover:bg-gray-5 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateUser}
                  disabled={!editFormData.firstName || !editFormData.lastName || !editFormData.email}
                  className="flex-1 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Create User Dialog */}
          <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-primary-500" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-80">
                  Create New User
                </DialogTitle>
                <DialogDescription className="text-gray-60 mt-2">
                  Fill in the details to create a new team member account
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      First Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="First Name"
                        className="pl-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Last Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
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

                {/* Role and Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Role
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger className="h-12 bg-white border-gray-30 rounded-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Department
                    </Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger className="h-12 bg-white border-gray-30 rounded-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="customer-service">Customer Service</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-80">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon className="h-5 w-5 text-slate-600" />
                      </div>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="*****************"
                        className="pl-10 pr-10 h-12 bg-white border-gray-30 rounded-full"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-slate-600 hover:text-gray-80 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateUserDialog(false)}
                  className="flex-1 h-12 border-gray-30 text-gray-80 hover:bg-gray-5 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="flex-1 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
