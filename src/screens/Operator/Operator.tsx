import { useState } from "react";
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  Plus,
  Filter,
  // MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  // Building,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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

const operatorData = [
  {
    id: "OP001",
    companyName: "Golden Gaming Ltd",
    businessRegNo: "RC123456789",
    contactPerson: "John Smith",
    email: "john.smith@goldengaming.com",
    phone: "+234 801 234 5678",
    status: "Active",
    dateRegistered: "2024-01-15",
    totalGames: 45,
    totalRevenue: "₦125,430",
    lastActivity: "2 hours ago",
    avatar: "GG"
  },
  {
    id: "OP002",
    companyName: "Lucky Strike Entertainment",
    businessRegNo: "RC987654321",
    contactPerson: "Sarah Johnson",
    email: "sarah.j@luckystrike.com",
    phone: "+234 802 345 6789",
    status: "Active",
    dateRegistered: "2024-02-20",
    totalGames: 32,
    totalRevenue: "₦89,250",
    lastActivity: "1 day ago",
    avatar: "LS"
  },
  {
    id: "OP003",
    companyName: "Ace Gaming Solutions",
    businessRegNo: "RC456789123",
    contactPerson: "Michael Brown",
    email: "m.brown@acegaming.com",
    phone: "+234 803 456 7890",
    status: "Pending",
    dateRegistered: "2024-03-10",
    totalGames: 0,
    totalRevenue: "₦0",
    lastActivity: "3 days ago",
    avatar: "AG"
  },
  {
    id: "OP004",
    companyName: "Royal Casino Group",
    businessRegNo: "RC789123456",
    contactPerson: "Emma Wilson",
    email: "emma.w@royalcasino.com",
    phone: "+234 804 567 8901",
    status: "Suspended",
    dateRegistered: "2023-11-05",
    totalGames: 28,
    totalRevenue: "₦67,890",
    lastActivity: "1 week ago",
    avatar: "RC"
  },
  {
    id: "OP005",
    companyName: "Diamond Gaming Corp",
    businessRegNo: "RC321654987",
    contactPerson: "David Lee",
    email: "david.lee@diamondgaming.com",
    phone: "+234 805 678 9012",
    status: "Active",
    dateRegistered: "2024-01-28",
    totalGames: 38,
    totalRevenue: "₦98,760",
    lastActivity: "5 hours ago",
    avatar: "DG"
  },
  {
    id: "OP006",
    companyName: "Platinum Games Hub",
    businessRegNo: "RC654321987",
    contactPerson: "Lisa Chen",
    email: "lisa.c@platinumgames.com",
    phone: "+234 806 789 0123",
    status: "Active",
    dateRegistered: "2024-02-14",
    totalGames: 52,
    totalRevenue: "₦156,890",
    lastActivity: "30 minutes ago",
    avatar: "PG"
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

export const Operator = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState<typeof operatorData[0] | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const filteredOperators = operatorData.filter(operator => {
    const matchesSearch = operator.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operator.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operator.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || operator.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (operator: typeof operatorData[0]) => {
    setOperatorToDelete(operator);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (operatorToDelete) {
      console.log("Deleting operator:", operatorToDelete.id);
      setShowDeleteDialog(false);
      setOperatorToDelete(null);
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
                Operators
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-40 w-4 h-4" />
                <Input
                  placeholder="Search operators..."
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
                Operator Management
              </h2>
              <p className="text-gray-60">
                Manage and monitor all registered gaming operators
              </p>
            </div>
            
            <Button className="bg-primary-500 hover:bg-primary-600 text-white h-12 px-6 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Operator
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-60" />
                  <span className="text-sm font-semibold text-gray-80">Filter by:</span>
                </div>
                
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
                Showing {filteredOperators.length} of {operatorData.length} operators
              </div>
            </div>
          </div>

          {/* Operators Table */}
          <div className="bg-white rounded-xl border border-gray-20">
            <div className="p-6 border-b border-gray-20">
              <h3 className="text-lg font-bold text-gray-80">All Operators</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Company
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Contact Person
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Email
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Phone
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Revenue
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Games
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
                  {filteredOperators.map((operator, index) => (
                    <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {operator.avatar}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-80 text-sm">
                              {operator.companyName}
                            </p>
                            <p className="text-xs text-gray-60">
                              {operator.businessRegNo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-80">
                        {operator.contactPerson}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {operator.email}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {operator.phone}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(operator.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operator.status)}`}>
                            {operator.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-80">
                        {operator.totalRevenue}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {operator.totalGames}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {operator.dateRegistered}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => navigate(`/operator-details/${operator.id}`)}
                          >
                            <Eye className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4 text-gray-60" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteClick(operator)}
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
                  Delete Operator
                </DialogTitle>
                <DialogDescription className="text-gray-60 mt-2">
                  Are you sure you want to delete "{operatorToDelete?.companyName}"? This action cannot be undone and will permanently remove all operator data, games, and associated records.
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
                  Delete Operator
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};