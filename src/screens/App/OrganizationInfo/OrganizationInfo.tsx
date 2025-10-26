import {Sidebar} from "../../../components/Sidebar";
import {useEffect, useState} from "react";
import {Header} from "../../../components/Header";
import {OperatorData} from "../../../lib/appModels.ts";
import {useLocation, useNavigate} from "react-router-dom";

// Helper to get operator from router state or query
function useOperatorFromRoute(): OperatorData | null {
    const navigate = useNavigate();
    const { state, } = useLocation();
    const operatorFromState = (state as any)?.operator as OperatorData | undefined;
    const operator = operatorFromState || null;

    useEffect(() => {
        if (!operator) {
            // If the user landed here without an operator, redirect back to operators list
            navigate("/app/dashboard", { replace: true });
        }
    }, [operator, navigate]);

    return operator;
}

export const OrganizationInfo = (): JSX.Element => {
    const operatorData = useOperatorFromRoute();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-5">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col">
                <Header title={'Organization Details'} />

                <div className="flex-1 p-4 md:p-6">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-80 mb-2">
                            {operatorData?.name} Details
                        </h2>
                        <p className="text-gray-60">
                            View your organization's details
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Organization Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={operatorData?.name}
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Registration Number
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={operatorData?.registrationNumber}
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Industry
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                            <option>Gaming & Entertainment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={operatorData?.phone}
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            defaultValue={operatorData?.address}
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            defaultValue="N/A"
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue={operatorData?.email}
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Person
                                        </label>
                                        <input
                                            type="url"
                                            defaultValue={operatorData?.contactPerson}
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Person Number
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue={operatorData?.contactPersonPhone}
                                            readOnly={true}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}