import React, { useState, useEffect } from 'react';
import { Building2, Save, Upload, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Company } from '../../types';

export function CompanySettings() {
  const { company, appUser, loadUserData } = useAuth();
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          siret: formData.siret,
          industry: formData.industry,
          website: formData.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', company.id);

      if (error) {
        throw error;
      }

      // Recharger les données utilisateur pour mettre à jour le contexte
      if (appUser?.id) {
        await loadUserData(appUser.id);
      }

      setMessage({ type: 'success', text: 'Informations de l\'entreprise mises à jour avec succès' });
    } catch (error) {
      console.error('Error updating company:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des informations' });
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    'Commerce de détail',
    'Restauration',
    'Services',
    'Artisanat',
    'Technologie',
    'Santé',
    'Éducation',
    'Construction',
    'Agriculture',
    'Autre'
  ];

  if (!company) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Aucune information d'entreprise disponible.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-blue-600" />
          Informations de l'entreprise
        </h2>
        <p className="text-gray-600 mt-1">
          Gérez les informations de votre entreprise et votre profil public
        </p>
      </div>

      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Logo de l'entreprise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo de l'entreprise
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              {company.logo_url ? (
                <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Changer le logo
            </button>
          </div>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secteur d'activité
            </label>
            <select
              name="industry"
              value={formData.industry || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un secteur</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de l'entreprise
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@entreprise.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Adresse complète de l'entreprise"
            />
          </div>
        </div>

        {/* Informations légales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SIRET
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="siret"
                value={formData.siret || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345678901234"
                maxLength={14}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.entreprise.com"
              />
            </div>
          </div>
        </div>

        {/* Abonnement */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Abonnement</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Plan actuel</p>
              <p className="font-medium text-gray-900 capitalize">{company.subscription_plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                company.subscription_status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {company.subscription_status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Gérer l'abonnement
            </button>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
