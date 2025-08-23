import React, { useState } from 'react';
import { Settings, Building2, Users, Shield, Bell, Palette, Database } from 'lucide-react';
import { CompanySettings } from './CompanySettings';
import { UserManagement } from './UserManagement';
import { useAuth } from '../../hooks/useAuth';

type SettingsTab = 'company' | 'users' | 'security' | 'notifications' | 'appearance' | 'data';

interface SettingsTabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  requiresPermission?: string;
}

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const { appUser } = useAuth();

  const canManageUsers = appUser?.role === 'owner' || appUser?.role === 'admin';
  const canManageSettings = appUser?.permissions?.settings || appUser?.role === 'owner' || appUser?.role === 'admin';

  const tabs: SettingsTabConfig[] = [
    {
      id: 'company',
      label: 'Entreprise',
      icon: Building2,
      component: CompanySettings
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      component: UserManagement,
      requiresPermission: 'user_management'
    },
    {
      id: 'security',
      label: 'Sécurité',
      icon: Shield,
      component: () => <SecuritySettings />,
      requiresPermission: 'settings'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      component: () => <NotificationSettings />
    },
    {
      id: 'appearance',
      label: 'Apparence',
      icon: Palette,
      component: () => <AppearanceSettings />
    },
    {
      id: 'data',
      label: 'Données',
      icon: Database,
      component: () => <DataSettings />,
      requiresPermission: 'settings'
    }
  ];

  const visibleTabs = tabs.filter(tab => {
    if (!tab.requiresPermission) return true;
    
    switch (tab.requiresPermission) {
      case 'user_management':
        return canManageUsers;
      case 'settings':
        return canManageSettings;
      default:
        return true;
    }
  });

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component || CompanySettings;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-blue-600" />
            Paramètres
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les paramètres de votre entreprise et de votre compte
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation des onglets */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Contenu de l'onglet actif */}
          <div className="flex-1">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants temporaires pour les autres sections
function SecuritySettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Shield className="w-6 h-6 mr-2 text-blue-600" />
        Paramètres de sécurité
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Authentification à deux facteurs</h3>
          <p className="text-gray-600 mb-4">
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Activer 2FA
          </button>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Sessions actives</h3>
          <p className="text-gray-600 mb-4">
            Gérez les appareils connectés à votre compte
          </p>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Voir les sessions
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Bell className="w-6 h-6 mr-2 text-blue-600" />
        Paramètres de notification
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications par email</h3>
          <div className="space-y-3">
            {[
              'Nouvelles ventes',
              'Stock faible',
              'Factures en retard',
              'Rapports hebdomadaires'
            ].map((item) => (
              <label key={item} className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Palette className="w-6 h-6 mr-2 text-blue-600" />
        Paramètres d'apparence
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Thème</h3>
          <div className="space-y-3">
            {[
              { id: 'light', label: 'Clair' },
              { id: 'dark', label: 'Sombre' },
              { id: 'auto', label: 'Automatique' }
            ].map((theme) => (
              <label key={theme.id} className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value={theme.id}
                  defaultChecked={theme.id === 'light'}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{theme.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Database className="w-6 h-6 mr-2 text-blue-600" />
        Gestion des données
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Sauvegarde</h3>
          <p className="text-gray-600 mb-4">
            Exportez vos données pour créer une sauvegarde
          </p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Exporter les données
          </button>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Suppression des données</h3>
          <p className="text-gray-600 mb-4">
            Supprimez définitivement toutes les données de votre entreprise
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Supprimer toutes les données
          </button>
        </div>
      </div>
    </div>
  );
}
