import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    LogOut,
} from "lucide-react";
import {Button} from "../../components/ui/button.tsx";
import {RegistrationFormSection} from "./sections/RegistrationFormSection/RegistrationFormSection.tsx";
import {MainContentSection} from "./sections/MainContentSection/MainContentSection.tsx";
import {checkRole} from "../../lib/checkPrivilege.ts";
import Loader from "../../components/Loader/Loader.tsx";

export const Adjudicator = ():JSX.Element => {
    const [isStandard,] = useState<boolean>(checkRole("standard"));
    const [isOperator,] = useState<boolean>(checkRole("operator"));
    const [isSAdmin,] = useState<boolean>(checkRole("admin"));
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout', {replace: true});
    };

    useEffect(() => {
        if(isOperator) navigate('/app/dashboard', {replace: true});
        if(isSAdmin) navigate('/admin/dashboard', {replace: true});
    }, []);

    return isStandard ? (
        <div className="flex min-h-screen bg-gray-5">

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-20 px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-[42.38px] h-[49px] bg-[url(/vector.png)] bg-[100%_100%]" />
                            <h1 className="text-xl md:text-2xl font-bold text-gray-80">
                                Company Profile Setup
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start h-12 px-3 rounded-xl text-gray-60 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium text-sm">Logout</span>
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
                                Your details are not registered yet. Please take a few minutes to complete the registration
                            </p>
                        </div>
                    </div>

                    {/* Operators Table */}
                    <div className="bg-white rounded-xl border border-gray-20">
                        <div className="flex-1 flex justify-center items-start pt-8 md:pt-[11vh] px-4 md:px-8">
                            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
                                <RegistrationFormSection />
                            </div>
                        </div>
                        <div className="w-full">
                            <MainContentSection />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    ) : (
        <Loader fullscreen message="loading dashboard..." size="md" />
    )
}