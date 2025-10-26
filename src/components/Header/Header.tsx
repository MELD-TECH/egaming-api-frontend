import {ArrowLeft, Bell, ChevronDown, Search} from "lucide-react";
import {Input} from "../ui/input.tsx";
import {Button} from "../ui/button.tsx";
import React, {useEffect, useRef, useState} from "react";
import {getAvatarProps} from "../../lib/utils.ts";
import {getProfile} from "../../lib/checkPrivilege.ts";
import {UserProfile} from "../../lib/appModels.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {getAuthToken} from "../../lib/httpClient.ts";
import {hasPermission} from "../auth/RequirePermission.tsx";
import {getInMemoryOperator} from "../../lib/store.ts";

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
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const user: UserProfile = getProfile();
    const nameOrEmail = `${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`.trim() || user?.profile?.email;
    const { initials, bgClass, textClass } = getAvatarProps(nameOrEmail);

    const navigate = useNavigate();
    const location = useLocation();

    const validToken = () => {
        const stillValid = getAuthToken();
        if (!stillValid) {
            navigate('/logout', {replace: true});
        }
    };

    useEffect(() => {
        validToken();
        // Close the menu on any route change
        setMenuOpen(false);
    }, [navigate, location.pathname]);

    // Close on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (menuRef.current && !menuRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // Close on Escape and support simple arrow navigation
    useEffect(() => {
        if (!menuOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                buttonRef.current?.focus();
            }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
                if (!items || items.length === 0) return;
                const activeIndex = Array.from(items).findIndex(el => el === document.activeElement);
                let nextIndex = 0;
                if (activeIndex === -1) {
                    nextIndex = 0;
                } else if (e.key === 'ArrowDown') {
                    nextIndex = (activeIndex + 1) % items.length;
                } else {
                    nextIndex = (activeIndex - 1 + items.length) % items.length;
                }
                items[nextIndex]?.focus();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [menuOpen]);

    const onOrganization = async () => {
        const result = await getInMemoryOperator();
        navigate('/app/organization', {
            state: {
                // @ts-ignore
                operator: result?.data
            }
        });
        setMenuOpen(false);
    }

    const onDeveloper = async () => {
        const result = await getInMemoryOperator();
        navigate('/app/developer', {
            state: {
                // @ts-ignore
                operator: result?.data
            }
        });
        setMenuOpen(false);
    };

    const onLogout = () => {
        navigate('/logout');
        setMenuOpen(false);
    };

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

                    <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
                        <Bell className="w-5 h-5 text-gray-60" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    </Button>

                    {/* Avatar + Dropdown */}
                    <div className="relative">
                        <Button
                            ref={buttonRef}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            aria-controls="user-menu"
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            <div className={`w-8 h-8 ${bgClass} rounded-full flex items-center justify-center overflow-hidden`}>
                                {(user?.profile?.profilePicture) ? (
                                    <img src={user?.profile?.profilePicture} alt="Profile" className="w-full h-full object-cover"/>
                                ) : (
                                    <span className={`text-xs font-semibold ${textClass}`}>{initials}</span>
                                )}
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-60" />
                            <span className="sr-only">Open user menu</span>
                        </Button>

                        {menuOpen && (
                            <div
                                id="user-menu"
                                ref={menuRef}
                                role="menu"
                                aria-label="User menu"
                                className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none z-50"
                            >
                                {/* Header (optional): show name/email */}
                                <div className="px-3 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900 truncate">{nameOrEmail}</p>
                                    {user?.profile?.email && (
                                        <p className="text-xs text-gray-500 truncate">{user.profile.email}</p>
                                    )}
                                </div>

                                <div className="py-1">
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`w-full ${hasPermission({anyOf: ['CAN_VIEW_MINI_REPORTS']})? '' : 'hidden'} text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none`}
                                        onClick={onOrganization}
                                    >
                                        Organization
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`w-full ${hasPermission({anyOf: ['CAN_VIEW_MINI_REPORTS']})? '' : 'hidden'} text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none`}
                                        onClick={onDeveloper}
                                    >
                                        Developer
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                                        onClick={onLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};