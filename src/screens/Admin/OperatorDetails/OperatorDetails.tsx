import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {
  Building,
  FileText,
  DollarSign,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Star,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";
import { Label } from "../../../components/ui/label.tsx";

import { Sidebar } from "../../../components/Sidebar";
import {Header} from "../../../components/Header";
import {OperatorData, OperatorSummary} from "../../../lib/appModels.ts";
import {formatCompactNumber, formatCurrencyCompact} from "../../../lib/utils.ts";
import {fetchOperatorMetric} from "../../../lib/api.ts";

const performanceMetrics = [
  {
    title: "Total Winnings",
    value: "₦125,430.89",
    change: "+1.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Total Players",
    value: "2,350",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Total Games",
    value: "45",
    change: "+3",
    trend: "up",
    icon: Activity,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Total Stakes",
    value: "3.2%",
    change: "-0.3%",
    trend: "down",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

const recentActivities = [
  {
    id: 1,
    action: "Game Added",
    description: "Added new slot game 'Lucky Sevens'",
    timestamp: "2 hours ago",
    type: "game",
    status: "success"
  },
  {
    id: 2,
    action: "Revenue Update",
    description: "Monthly revenue report generated",
    timestamp: "1 day ago",
    type: "revenue",
    status: "info"
  },
  {
    id: 3,
    action: "User Registration",
    description: "150 new users registered this week",
    timestamp: "3 days ago",
    type: "users",
    status: "success"
  },
  {
    id: 4,
    action: "Compliance Check",
    description: "Passed quarterly compliance audit",
    timestamp: "1 week ago",
    type: "compliance",
    status: "success"
  }
];


const getStatusIcon = (status: string | undefined) => {
  switch (status) {
    case "VERIFIED":
      return <CheckCircle className="w-4 h-4 text-success-50" />;
    case "UNVERIFIED":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "UNKNOWN":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "Maintenance":
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-40" />;
  }
};

const getStatusColor = (status: string | undefined) => {
  switch (status) {
    case "VERIFIED":
      return "bg-green-100 text-green-800";
    case "UNVERIFIED":
      return "bg-yellow-100 text-yellow-800";
    case "UNKNOWN":
      return "bg-red-100 text-red-800";
    case "Maintenance":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function useOperatorMetrics(operatorId: string | undefined): OperatorSummary | undefined {
  const [operatorMetrics, setOperatorMetrics] = useState<OperatorSummary>();

    useEffect(() => {
      const getOperatorMetrics = async () => {
          const response = await fetchOperatorMetric(operatorId);
          setOperatorMetrics(response?.data?.data);
      }
      getOperatorMetrics();
  }, [operatorId]);
    console.log("Operator Metrics:", operatorMetrics);
    return operatorMetrics;
}

// Helper to get operator from router state or query
function useOperatorFromRoute(): OperatorData | null {
    const navigate = useNavigate();
    const { state, } = useLocation();
    const operatorFromState = (state as any)?.operator as OperatorData | undefined;
    const operator = operatorFromState || null;

    useEffect(() => {
        if (!operator) {
            // If the user landed here without an operator, redirect back to operators list
            navigate("/operators");
        }
    }, [operator, navigate]);

    return operator;
}

export const OperatorDetails = (): JSX.Element => {
  const operatorData = useOperatorFromRoute();
  const operatorSummary = useOperatorMetrics(operatorData?.publicId);
  const [isEditing,] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  performanceMetrics[0].value =  formatCurrencyCompact(operatorData?.totalStakeWinningAmountByOperator || 0, 'NGN', { locale: 'en-NG' });
  performanceMetrics[1].value =  formatCompactNumber(operatorData?.totalUniquePlayersByOperator || 0);
  performanceMetrics[2].value =  formatCompactNumber(operatorData?.totalUniqueGamesPlayedByOperator || 0);
  performanceMetrics[3].value =  formatCurrencyCompact(operatorData?.totalStakeAmountByOperator || 0, 'NGN', { locale: 'en-NG' });

    return (
    <div className="flex min-h-screen bg-gray-5">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
          <Header
              title={"Operator Details"}
              targetScreen={'/operators'}
              hasBackButton={true}
              backMessage={'Back to Operators'} />

        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Operator Header Card */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-brand-60 rounded-xl flex items-center justify-center">
                  <Building className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-80 mb-1">
                      {operatorData?.name || "Unknown Operator"}
                    </h1>
                    <p className="text-gray-60 mb-2">
                      {operatorData?.registrationNumber} • Contact: {operatorData?.contactPerson}
                    </p>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(operatorData?.status)}
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(operatorData?.status)}`}>
                        {operatorData?.status}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-60">Registered</p>
                      <p className="font-semibold text-gray-80">{ //@ts-ignore
                          new Date(operatorData?.createdOn * 1000).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-60">Total Transactions</p>
                      <p className="font-semibold text-gray-80">{formatCompactNumber(operatorSummary?.totalWinnings)}</p>
                    </div>
                    <div>
                          <p className="text-gray-60">Total Amount</p>
                          <p className="font-semibold text-gray-80">{formatCurrencyCompact(operatorSummary?.totalWinningAmount,'NGN', { locale: 'en-NG' })}</p>
                    </div>
                    <div>
                      <p className="text-gray-60">Total Stakes </p>
                      <p className="font-semibold text-success-50">{formatCompactNumber(operatorSummary?.totalStakes)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="h-11 px-6"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    {/*<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>*/}
                    {/*  <DialogTrigger asChild>*/}
                    {/*    <Button */}
                    {/*      variant="outline" */}
                    {/*      className="h-11 px-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"*/}
                    {/*    >*/}
                    {/*      <Trash2 className="w-4 h-4 mr-2" />*/}
                    {/*      Delete*/}
                    {/*    </Button>*/}
                    {/*  </DialogTrigger>*/}
                    {/*  <DialogContent className="sm:max-w-md bg-white">*/}
                    {/*    <DialogHeader className="text-center pb-4">*/}
                    {/*      <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">*/}
                    {/*        <AlertTriangle className="w-6 h-6 text-red-600" />*/}
                    {/*      </div>*/}
                    {/*      <DialogTitle className="text-xl font-bold text-gray-80">*/}
                    {/*        Delete Operator*/}
                    {/*      </DialogTitle>*/}
                    {/*      <DialogDescription className="text-gray-60 mt-2">*/}
                    {/*        Are you sure you want to delete "{formData.companyName}"? This action cannot be undone.*/}
                    {/*      </DialogDescription>*/}
                    {/*    </DialogHeader>*/}
                    {/*    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">*/}
                    {/*      <Button*/}
                    {/*        variant="outline"*/}
                    {/*        onClick={() => setShowDeleteDialog(false)}*/}
                    {/*        className="flex-1 h-11"*/}
                    {/*      >*/}
                    {/*        Cancel*/}
                    {/*      </Button>*/}
                    {/*      <Button*/}
                    {/*        onClick={handleDelete}*/}
                    {/*        className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white"*/}
                    {/*      >*/}
                    {/*        <Trash2 className="w-4 h-4 mr-2" />*/}
                    {/*        Delete*/}
                    {/*      </Button>*/}
                    {/*    </DialogFooter>*/}
                    {/*  </DialogContent>*/}
                    {/*</Dialog>*/}
                    {/*<Button */}
                    {/*  onClick={() => setIsEditing(true)}*/}
                    {/*  className="bg-primary-500 hover:bg-primary-600 text-white h-11 px-6"*/}
                    {/*>*/}
                    {/*  <Edit className="w-4 h-4 mr-2" />*/}
                    {/*  Edit Details*/}
                    {/*</Button>*/}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-20">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${metric.bgColor} rounded-lg`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success-50" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${
                      metric.trend === "up" ? "text-success-50" : "text-red-500"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-60 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-80">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs Navigation */}
              <div className="bg-white rounded-xl border border-gray-20">
                <div className="border-b border-gray-20">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: "overview", label: "Overview" },
                      // { id: "games", label: "Games" },
                      { id: "transactions", label: "Transactions" },
                      // { id: "documents", label: "Documents" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? "border-primary-500 text-primary-500"
                            : "border-transparent text-gray-60 hover:text-gray-80"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-80 mb-4">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                                Company Name
                              </Label>
                              {isEditing ? (<></>
                                // <Input
                                //   value={operatorData?.name}
                                //   onChange={(e) => handleInputChange("companyName", e.target.value)}
                                //   className="h-10 bg-gray-5 border-gray-30 rounded-lg"
                                // />
                              ) : (
                                <p className="text-gray-60">{operatorData?.name}</p>
                              )}
                            </div>

                            <div>
                              <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                                Contact Person
                              </Label>
                              {isEditing ? (
                                // <Input
                                //   value={operatorData?.contactPerson}
                                //   onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                                //   className="h-10 bg-gray-5 border-gray-30 rounded-lg"
                                // />
                                  <></>
                              ) : (
                                <p className="text-gray-60">{operatorData?.contactPerson}</p>
                              )}
                            </div>

                            <div>
                              <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                                Email Address
                              </Label>
                              {isEditing ? (
                                // <Input
                                //   value={operatorData?.email}
                                //   onChange={(e) => handleInputChange("email", e.target.value)}
                                //   className="h-10 bg-gray-5 border-gray-30 rounded-lg"
                                // />
                                  <></>
                              ) : (
                                <p className="text-gray-60">{operatorData?.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                                Phone Number
                              </Label>
                              {isEditing ? (
                                // <Input
                                //   value={operatorData?.phone}
                                //   onChange={(e) => handleInputChange("phone", e.target.value)}
                                //   className="h-10 bg-gray-5 border-gray-30 rounded-lg"
                                // />
                                  <></>
                              ) : (
                                <p className="text-gray-60">{operatorData?.phone}</p>
                              )}
                            </div>

                            <div>
                              <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                                Business Registration
                              </Label>
                              {isEditing ? (
                                // <Input
                                //   value={operatorData?.registrationNumber}
                                //   onChange={(e) => handleInputChange("businessRegNo", e.target.value)}
                                //   className="h-10 bg-gray-5 border-gray-30 rounded-lg"
                                // />
                                  <></>
                              ) : (
                                <p className="text-gray-60">{operatorData?.registrationNumber}</p>
                              )}
                            </div>

                            <div>
                              <Label className="text-sm font-semibold text-gray-80 mb-2 block">
                                Address
                              </Label>
                              {isEditing ? (
                                // <Input
                                //   value={operatorData?.address}
                                //   onChange={(e) => handleInputChange("address", e.target.value)}
                                //   className="h-10 bg-gray-5 border-gray-30 rounded-lg"
                                // />
                                  <></>
                              ) : (
                                <p className="text-gray-60">{operatorData?.address}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/*{activeTab === "games" && (*/}
                  {/*  <div>*/}
                  {/*    <div className="flex items-center justify-between mb-6">*/}
                  {/*      <h3 className="text-lg font-bold text-gray-80">Games Portfolio</h3>*/}
                  {/*      <Button className="bg-primary-500 hover:bg-primary-600 text-white h-10">*/}
                  {/*        Add New Game*/}
                  {/*      </Button>*/}
                  {/*    </div>*/}

                  {/*    <div className="space-y-4">*/}
                  {/*      {gamesList.map((game) => (*/}
                  {/*        <div key={game.id} className="flex items-center justify-between p-4 bg-gray-5 rounded-lg">*/}
                  {/*          <div className="flex items-center gap-4">*/}
                  {/*            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">*/}
                  {/*              <Activity className="w-6 h-6 text-white" />*/}
                  {/*            </div>*/}
                  {/*            <div>*/}
                  {/*              <h4 className="font-semibold text-gray-80">{game.name}</h4>*/}
                  {/*              <p className="text-sm text-gray-60">{game.type}</p>*/}
                  {/*            </div>*/}
                  {/*          </div>*/}
                  {/*          */}
                  {/*          <div className="flex items-center gap-6">*/}
                  {/*            <div className="text-center">*/}
                  {/*              <p className="text-sm text-gray-60">Players</p>*/}
                  {/*              <p className="font-semibold text-gray-80">{game.players}</p>*/}
                  {/*            </div>*/}
                  {/*            <div className="text-center">*/}
                  {/*              <p className="text-sm text-gray-60">Revenue</p>*/}
                  {/*              <p className="font-semibold text-gray-80">{game.revenue}</p>*/}
                  {/*            </div>*/}
                  {/*            <div className="text-center">*/}
                  {/*              <p className="text-sm text-gray-60">Growth</p>*/}
                  {/*              <p className={`font-semibold ${game.growth.startsWith('+') ? 'text-success-50' : 'text-red-500'}`}>*/}
                  {/*                {game.growth}*/}
                  {/*              </p>*/}
                  {/*            </div>*/}
                  {/*            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(game.status)}`}>*/}
                  {/*              {game.status}*/}
                  {/*            </span>*/}
                  {/*            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">*/}
                  {/*              <MoreHorizontal className="w-4 h-4 text-gray-60" />*/}
                  {/*            </Button>*/}
                  {/*          </div>*/}
                  {/*        </div>*/}
                  {/*      ))}*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*)}*/}

                  {activeTab === "transactions" && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-80 mb-6">Recent Transactions</h3>
                      <div className="text-center py-12">
                        <DollarSign className="w-12 h-12 text-gray-40 mx-auto mb-4" />
                        <p className="text-gray-60">Transaction history will be displayed here</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-80 mb-6">Documents & Compliance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: "Business Registration Certificate", status: "Verified", date: "2024-01-15" },
                          { name: "Gaming License", status: "Verified", date: "2024-01-20" },
                          { name: "Tax Clearance Certificate", status: "Pending", date: "2024-03-01" },
                          { name: "Compliance Report Q1 2024", status: "Verified", date: "2024-03-31" }
                        ].map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-60" />
                              <div>
                                <h4 className="font-semibold text-gray-80 text-sm">{doc.name}</h4>
                                <p className="text-xs text-gray-60">{doc.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                doc.status === "Verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {doc.status}
                              </span>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="w-4 h-4 text-gray-60" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {/*<div className="bg-white rounded-xl border border-gray-20 p-6">*/}
              {/*  <h3 className="text-lg font-bold text-gray-80 mb-4">Quick Actions</h3>*/}
              {/*  <div className="space-y-3">*/}
              {/*    <Button className="w-full justify-start h-11 bg-primary-500 hover:bg-primary-600 text-white">*/}
              {/*      <Activity className="w-5 h-5 mr-3" />*/}
              {/*      Add New Game*/}
              {/*    </Button>*/}
              {/*    <Button variant="outline" className="w-full justify-start h-11">*/}
              {/*      <FileText className="w-5 h-5 mr-3" />*/}
              {/*      Generate Report*/}
              {/*    </Button>*/}
              {/*    <Button variant="outline" className="w-full justify-start h-11">*/}
              {/*      <Users className="w-5 h-5 mr-3" />*/}
              {/*      View Users*/}
              {/*    </Button>*/}
              {/*    <Button variant="outline" className="w-full justify-start h-11">*/}
              {/*      <DollarSign className="w-5 h-5 mr-3" />*/}
              {/*      View Transactions*/}
              {/*    </Button>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-20 p-6">
                <h3 className="text-lg font-bold text-gray-80 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.status === 'success' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Activity className={`w-4 h-4 ${
                          activity.status === 'success' ? 'text-success-50' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-80 text-sm">{activity.action}</h4>
                        <p className="text-gray-60 text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-40 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};