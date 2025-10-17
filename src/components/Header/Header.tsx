import {ArrowLeft, Bell, ChevronDown, Search} from "lucide-react";
import {Input} from "../ui/input.tsx";
import {Button} from "../ui/button.tsx";
import React, {useEffect, useState} from "react";
import {getAvatarProps} from "../../lib/utils.ts";
import {getProfile} from "../../lib/checkPrivilege.ts";
import {UserProfile} from "../../lib/appModels.ts";
import {useNavigate} from "react-router-dom";
import {getAuthToken} from "../../lib/httpClient.ts";

interface HeaderProps {
    title?: string;
    backMessage?: string;
    hasBackButton?: boolean;
    targetScreen?: string;
}

export const Header: React.FC<HeaderProps> = ({
                                                  title,
                                                  targetScreen,
                                                  hasBackButton,
                                                  backMessage
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const user: UserProfile = getProfile();
    const nameOrEmail = `${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`.trim() || user?.profile?.email;
    const { initials, bgClass, textClass } = getAvatarProps(nameOrEmail);
    const navigate = useNavigate();

    const validToken = () => {
        const stillValid = getAuthToken();
        if (!stillValid) {
            navigate('/logout', {replace: true});
        }
    }

    useEffect(() => {
        validToken();
    }, [navigate, validToken]);

    return (
        <header className="bg-white border-b border-gray-20 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
                <div className={`${!hasBackButton? 'flex items-center gap-4' : 'hidden'}`}>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-80">
                        {title}
                    </h1>
                </div>

                <div className={`${hasBackButton? 'flex items-center gap-4': 'hidden'}`}>
                    <Button
                        variant="ghost"
                        size="sm"
                        // @ts-ignore
                        onClick={() => navigate(targetScreen)}
                        className="flex items-center gap-2 text-gray-60 hover:text-gray-80"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {backMessage}
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-40 w-4 h-4" />
                        <Input
                            placeholder="Search settings..."
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
                        <div className={`w-8 h-8 ${bgClass} rounded-full flex items-center justify-center`}>
                            {/*<User className="w-4 h-4 text-white" />*/}
                            {(user?.profile?.profilePicture) ? (
                                    <span><img src={user?.profile?.profilePicture} alt="Profile Picture" className="w-full h-full rounded-full"/></span>) :
                                (
                                    <span className={`text-xs font-semibold ${textClass}`}>{initials}</span>
                                )
                            }
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-60" />
                    </Button>
                </div>
            </div>
        </header>
    );
}