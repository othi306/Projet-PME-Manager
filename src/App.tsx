import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/Auth/AuthForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import SalesManager from './components/Sales/SalesManager';
import CustomersManager from './components/Customers/CustomersManager';
import InventoryManager from './components/Inventory/InventoryManager';
import FinanceManager from './components/Finance/FinanceManager';
import JournalManager from './components/Journal/JournalManager';
import ProductionManager from './components/Production/ProductionManager';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Chargement de votre espace...</div>
          <div className="text-white/70 text-sm mt-2">Initialisation en cours</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
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
