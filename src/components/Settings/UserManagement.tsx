import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { User, UserPermissions } from '../../types';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => void;
  loading: boolean;
}

function NewUserModal({ isOpen, onClose, onSubmit, loading }: NewUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as User['role'],
    permissions: {
      sales: false,
      inventory: false,
      finance: false,
      customers: false,
      production: false,
      reports: false,
      settings: false,
      user_management: false
    } as UserPermissions
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (permission: keyof UserPermissions) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const rolePermissions = {
    owner: { sales: true, inventory: true, finance: true, customers: true, production: true, reports: true, settings: true, user_management: true },
    admin: { sales: true, inventory: true, finance: true, customers: true, production: true, reports: true, settings: true, user_management: true },
    manager: { sales: true, inventory: true, finance: false, customers: true, production: true, reports: true, settings: false, user_management: false },
    employee: { sales: true, inventory: false, finance: false, customers: true, production: false, reports: false, settings: false, user_management: false }
  };

  const handleRoleChange = (role: User['role']) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: rolePermissions[role]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Inviter un nouvel utilisateur</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value as User['role'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="employee">Employé</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(formData.permissions).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handlePermissionChange(key as keyof UserPermissions)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {key.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UserManagement() {
  const { company, appUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (company?.id) {
      loadUsers();
    }
  }, [company?.id]);

  const loadUsers = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des utilisateurs' });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (userData: Partial<User>) => {
    if (!company?.id) return;

    setInviteLoading(true);
    setMessage(null);

    try {
      // Ici, vous pourriez implémenter l'envoi d'invitation par email
      // Pour l'instant, on crée directement l'utilisateur
      const { error } = await supabase
        .from('users')
        .insert([{
          ...userData,
          company_id: company.id,
          is_active: false // L'utilisateur sera activé quand il acceptera l'invitation
        }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Invitation envoyée avec succès' });
      setShowNewUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error inviting user:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi de l\'invitation' });
    } finally {
      setInviteLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: `Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès` 
      });
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la modification du statut' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Propriétaire';
      case 'admin': return 'Administrateur';
      case 'manager': return 'Manager';
      default: return 'Employé';
    }
  };

  const canManageUsers = appUser?.role === 'owner' || appUser?.role === 'admin';

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Gestion des utilisateurs
            </h2>
            <p className="text-gray-600 mt-1">
              Gérez les membres de votre équipe et leurs permissions
            </p>
          </div>
          {canManageUsers && (
            <button
              onClick={() => setShowNewUserModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Inviter un utilisateur
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                {canManageUsers && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(user.last_login).toLocaleDateString('fr-FR')}
                      </div>
                    ) : (
                      'Jamais connecté'
                    )}
                  </td>
                  {canManageUsers && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className={`px-3 py-1 text-xs rounded-lg ${
                            user.is_active 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.role !== 'owner' && (
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      <NewUserModal
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onSubmit={handleInviteUser}
        loading={inviteLoading}
      />
    </div>
  );
}
