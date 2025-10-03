import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCheck,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    id: 'dashboard'
  },
  {
    title: 'Reports',
    icon: FileText,
    path: '/reports',
    id: 'reports'
  },
  {
    title: 'Operators',
    icon: Users,
    path: '/operators',
    id: 'operators'
  },
  {
    title: 'LGA',
    icon: MapPin,
    path: '/lga',
    id: 'lga'
  },
  {
    title: 'Team',
    icon: UserCheck,
    path: '/team',
    id: 'team'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
    id: 'settings'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false, 
  onToggle 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || 
           (path === '/operators' && (location.pathname.startsWith('/operators/') || location.pathname.startsWith('/operator-details/')));
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-20 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-20">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-10 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-6 h-8 bg-white rounded-sm opacity-90"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-80">ESGC</h1>
              <p className="text-xs text-gray-60">Game Staking</p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-10 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <div className="w-6 h-8 bg-white rounded-sm opacity-90"></div>
          </div>
        )}

        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 hover:bg-gray-5"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-60" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-60" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          
          return (
            <div key={item.id}>
              <Button
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "w-full justify-start h-12 px-3 rounded-xl transition-all duration-200",
                  isCollapsed ? "px-0 justify-center" : "justify-start",
                  isActive 
                    ? "bg-primary-500 text-white hover:bg-primary-600" 
                    : "text-gray-60 hover:bg-gray-5 hover:text-gray-80"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isCollapsed ? "" : "mr-3"
                )} />
                {!isCollapsed && (
                  <>
                    <span className="font-medium text-sm flex-1 text-left">{item.title}</span>
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-20">
        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-5 rounded-xl">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-80 truncate">John Smith</p>
              <p className="text-xs text-gray-60 truncate">System Administrator</p>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JS</span>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start h-12 px-3 rounded-xl text-gray-60 hover:bg-red-50 hover:text-red-600 transition-all duration-200",
            isCollapsed ? "px-0 justify-center" : "justify-start"
          )}
        >
          <LogOut className={cn(
            "w-5 h-5 flex-shrink-0",
            isCollapsed ? "" : "mr-3"
          )} />
          {!isCollapsed && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </Button>
      </div>
    </div>
  );
};