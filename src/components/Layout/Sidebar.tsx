import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  BookOpen,
  Settings,
  Bell,
  LogOut,
  Factory
} from 'lucide-react';
import classNames from 'classnames';
import NotificationsPanel from './NotificationsPanel';
import SettingsPanel from './SettingsPanel';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'sales', label: 'Ventes', icon: ShoppingCart },
  { id: 'customers', label: 'Clients', icon: Users },
  { id: 'inventory', label: 'Stock', icon: Package },
  { id: 'production', label: 'Production', icon: Factory },
  { id: 'finance', label: 'Finances', icon: DollarSign },
  { id: 'journal', label: 'Journal', icon: BookOpen },
];

export default function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { signOut } = useAuth();

  return (
    <>
      <div className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
        } min-h-screen flex flex-col shadow-2xl`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PME Manager
                </h1>
                <p className="text-xs text-slate-400 mt-1">Gestion intelligente</p>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <LayoutDashboard size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={classNames(
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    )}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="space-y-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700 transition-all duration-200"
            >
              <Bell size={20} className="text-slate-300" />
              {!isCollapsed && <span className="text-slate-300">Notifications</span>}
            </button>
            <button
              onClick={() => onTabChange('settings')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700 transition-all duration-200"
            >
              <Settings size={20} className="text-slate-300" />
              {!isCollapsed && <span className="text-slate-300">Paramètres</span>}
            </button>
            <button
              onClick={async () => {
                if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                  await signOut();
                }
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-600 transition-all duration-200 text-red-400 hover:text-white"
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Panels */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
