import React, { useState } from 'react';
import { X, Settings, User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'Jean Dupont',
      email: 'jean.dupont@exemple.com',
      company: 'Ma PME',
      phone: '06 12 34 56 78'
    },
    notifications: {
      stockAlerts: true,
      paymentReminders: true,
      salesReports: true,
      motivationalMessages: true,
      emailNotifications: false
    },
    appearance: {
      theme: 'light',
      language: 'fr',
      currency: 'EUR',
      dateFormat: 'dd/mm/yyyy'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90'
    }
  });

  if (!isOpen) return null;

  const handleSave = () => {
    // Ici vous pourriez sauvegarder les paramètres dans Supabase
    alert('Paramètres sauvegardés avec succès !');
    onClose();
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
        <input
          type="text"
          value={settings.profile.name}
          onChange={(e) => setSettings({
            ...settings,
            profile: { ...settings.profile, name: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => setSettings({
            ...settings,
            profile: { ...settings.profile, email: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
        <input
          type="text"
          value={settings.profile.company}
          onChange={(e) => setSettings({
            ...settings,
            profile: { ...settings.profile, company: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
        <input
          type="tel"
          value={settings.profile.phone}
          onChange={(e) => setSettings({
            ...settings,
            profile: { ...settings.profile, phone: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">
              {key === 'stockAlerts' ? 'Alertes de stock' :
               key === 'paymentReminders' ? 'Rappels de paiement' :
               key === 'salesReports' ? 'Rapports de ventes' :
               key === 'motivationalMessages' ? 'Messages motivationnels' :
               'Notifications par email'}
            </h4>
            <p className="text-sm text-gray-600">
              {key === 'stockAlerts' ? 'Recevoir des alertes quand le stock est faible' :
               key === 'paymentReminders' ? 'Rappels pour les paiements en retard' :
               key === 'salesReports' ? 'Rapports quotidiens et hebdomadaires' :
               key === 'motivationalMessages' ? 'Messages d\'encouragement quotidiens' :
               'Recevoir les notifications par email'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, [key]: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
        <select
          value={settings.appearance.theme}
          onChange={(e) => setSettings({
            ...settings,
            appearance: { ...settings.appearance, theme: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
          <option value="auto">Automatique</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
        <select
          value={settings.appearance.language}
          onChange={(e) => setSettings({
            ...settings,
            appearance: { ...settings.appearance, language: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
        <select
          value={settings.appearance.currency}
          onChange={(e) => setSettings({
            ...settings,
            appearance: { ...settings.appearance, currency: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="EUR">Euro (€)</option>
          <option value="USD">Dollar ($)</option>
          <option value="GBP">Livre (£)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
        <select
          value={settings.appearance.dateFormat}
          onChange={(e) => setSettings({
            ...settings,
            appearance: { ...settings.appearance, dateFormat: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="dd/mm/yyyy">DD/MM/YYYY</option>
          <option value="mm/dd/yyyy">MM/DD/YYYY</option>
          <option value="yyyy-mm-dd">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
          <p className="text-sm text-gray-600">Sécurité renforcée pour votre compte</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, twoFactorAuth: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Délai d'expiration de session (minutes)</label>
        <select
          value={settings.security.sessionTimeout}
          onChange={(e) => setSettings({
            ...settings,
            security: { ...settings.security, sessionTimeout: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 heure</option>
          <option value="120">2 heures</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expiration du mot de passe (jours)</label>
        <select
          value={settings.security.passwordExpiry}
          onChange={(e) => setSettings({
            ...settings,
            security: { ...settings.security, passwordExpiry: e.target.value }
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="30">30 jours</option>
          <option value="60">60 jours</option>
          <option value="90">90 jours</option>
          <option value="never">Jamais</option>
        </select>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors">
          Changer le mot de passe
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex shadow-2xl">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-50 rounded-l-2xl p-6 border-r border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings size={24} className="text-blue-600" />
              Paramètres
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'profile' ? 'Gérez vos informations personnelles' :
               activeTab === 'notifications' ? 'Configurez vos préférences de notification' :
               activeTab === 'appearance' ? 'Personnalisez l\'apparence de l\'application' :
               'Configurez les paramètres de sécurité'}
            </p>
          </div>

          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'security' && renderSecurityTab()}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}