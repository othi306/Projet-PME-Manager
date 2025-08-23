import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthContainer } from './components/Auth/AuthContainer';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import SalesManager from './components/Sales/SalesManager';
import CustomersManager from './components/Customers/CustomersManager';
import InventoryManager from './components/Inventory/InventoryManager';
import FinanceManager from './components/Finance/FinanceManager';
import JournalManager from './components/Journal/JournalManager';
import ProductionManager from './components/Production/ProductionManager';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { NotificationProvider } from './context/NotificationContext';
import NotificationsPanel from './components/Layout/NotificationsPanel';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Particules d'arrière-plan */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          {/* Logo animé */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          
          {/* Texte principal */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white mb-2">
              PME Manager
              <span className="text-blue-400 ml-2">✨</span>
            </h1>
            <div className="text-white text-xl font-semibold animate-pulse">
              Chargement de votre espace...
            </div>
            <div className="text-white/70 text-sm">
              Initialisation des modules IA et gamification
            </div>
            
            {/* Barre de progression */}
            <div className="w-64 mx-auto mt-6">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Messages motivationnels */}
          <div className="mt-8 text-white/60 text-sm italic">
            "Votre succès commence ici..."
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthContainer />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'sales':
        return <SalesManager />;
      case 'customers':
        return <CustomersManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'production':
        return <ProductionManager />;
      case 'finance':
        return <FinanceManager />;
      case 'journal':
        return <JournalManager />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onToggleNotifications={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
      />
    </div>
  );
}

function AppWithNotifications() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}

export default AppWithNotifications;
