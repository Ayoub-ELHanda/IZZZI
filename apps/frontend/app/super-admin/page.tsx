'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/auth.service';
import { routes } from '@/config/routes';
import { superAdminService, User, UserDetails, Teacher, Subscription } from '@/services/super-admin/super-admin.service';
import { Users, Building2, CreditCard, FileText, Search, Filter, ChevronRight, Mail, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type ActiveSection = 'users' | 'subscriptions' | 'billing';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('users');
  const [isLoading, setIsLoading] = useState(true);
  
  // Users section
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [selectedAdminTeachers, setSelectedAdminTeachers] = useState<Teacher[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Subscriptions section
  const [selectedAdminSubscriptions, setSelectedAdminSubscriptions] = useState<Subscription[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push(routes.auth.login);
        return;
      }

      // Vérifier que l'utilisateur est Super Admin
      if (user?.role !== 'SUPER_ADMIN') {
        router.push(routes.dashboard);
        return;
      }

      try {
        await loadUsers();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, user]);

  const loadUsers = async () => {
    try {
      const role = roleFilter === 'all' ? undefined : roleFilter;
      const data = await superAdminService.getAllUsers(role);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      const details = await superAdminService.getUserById(userId);
      setSelectedUser(details);
      
      // Si c'est un Admin, charger ses professeurs
      if (details.role === 'ADMIN') {
        const teachers = await superAdminService.getTeachersByAdmin(userId);
        setSelectedAdminTeachers(teachers);
        setSelectedAdminId(userId);
      } else {
        setSelectedAdminTeachers([]);
        setSelectedAdminId(null);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const loadAdminSubscriptions = async (adminId: string) => {
    try {
      const subscriptions = await superAdminService.getAdminSubscriptions(adminId);
      setSelectedAdminSubscriptions(subscriptions);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cet abonnement ?')) {
      return;
    }
    
    try {
      await superAdminService.cancelSubscription(subscriptionId);
      if (selectedAdminId) {
        await loadAdminSubscriptions(selectedAdminId);
      }
      alert('Abonnement annulé avec succès');
    } catch (error: any) {
      alert(`Erreur: ${error.message || 'Impossible d\'annuler l\'abonnement'}`);
    }
  };

  const handleRenewSubscription = async (subscriptionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir renouveler cet abonnement ?')) {
      return;
    }
    
    try {
      await superAdminService.renewSubscription(subscriptionId);
      if (selectedAdminId) {
        await loadAdminSubscriptions(selectedAdminId);
      }
      alert('Abonnement renouvelé avec succès');
    } catch (error: any) {
      alert(`Erreur: ${error.message || 'Impossible de renouveler l\'abonnement'}`);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  useEffect(() => {
    if (selectedAdminId && activeSection === 'subscriptions') {
      loadAdminSubscriptions(selectedAdminId);
    }
  }, [selectedAdminId, activeSection]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'RESPONSABLE_PEDAGOGIQUE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Actif</span>;
      case 'CANCELED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Annulé</span>;
      case 'TRIALING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Essai</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
          <p className="mt-2 text-sm text-gray-600">Gestion globale des utilisateurs, abonnements et facturation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveSection('users')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeSection === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline-block mr-2 h-5 w-5" />
                Utilisateurs
              </button>
              <button
                onClick={() => {
                  setActiveSection('subscriptions');
                  if (selectedUser?.role === 'ADMIN' && selectedUser.id) {
                    setSelectedAdminId(selectedUser.id);
                  }
                }}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeSection === 'subscriptions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className="inline-block mr-2 h-5 w-5" />
                Abonnements
              </button>
              <button
                onClick={() => setActiveSection('billing')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeSection === 'billing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="inline-block mr-2 h-5 w-5" />
                Facturation
              </button>
            </nav>
          </div>
        </div>

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Tous les utilisateurs</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous les rôles</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="RESPONSABLE_PEDAGOGIQUE">Responsable Pédagogique</option>
                    <option value="VISITEUR">Visiteur</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => loadUserDetails(user.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{user._count.classes} classes</span>
                          <span>{user._count.subjects} matières</span>
                          {user._count.subscriptions > 0 && (
                            <span>{user._count.subscriptions} abonnements</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {selectedUser ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails de l'utilisateur</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Rôle</label>
                      <p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                      </p>
                    </div>
                    
                    {selectedUser.establishment && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Établissement</label>
                        <p className="text-gray-900">{selectedUser.establishment.name}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Statut</label>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedUser.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-900">
                          {selectedUser.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>

                    {selectedUser.role === 'ADMIN' && selectedAdminTeachers.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          Professeurs associés ({selectedAdminTeachers.length})
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {selectedAdminTeachers.map((teacher) => (
                            <div key={teacher.id} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium text-sm text-gray-900">
                                {teacher.firstName} {teacher.lastName}
                              </p>
                              <p className="text-xs text-gray-600">{teacher.email}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>{teacher._count.classes} classes</span>
                                <span>{teacher._count.subjects} matières</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Sélectionnez un utilisateur pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscriptions Section */}
        {activeSection === 'subscriptions' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des abonnements</h2>
            
            {selectedAdminId ? (
              <div>
                {selectedAdminSubscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedAdminSubscriptions.map((subscription) => (
                      <div key={subscription.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Abonnement {subscription.billingPeriod === 'MONTHLY' ? 'Mensuel' : 'Annuel'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {subscription.classCount} classe{subscription.classCount > 1 ? 's' : ''} • 
                              {(subscription.totalAmount / 100).toFixed(2)}€
                            </p>
                          </div>
                          {getStatusBadge(subscription.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <label className="text-gray-600">Début</label>
                            <p className="text-gray-900">
                              {new Date(subscription.currentPeriodStart).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div>
                            <label className="text-gray-600">Fin</label>
                            <p className="text-gray-900">
                              {new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        {subscription.payments && subscription.payments.length > 0 && (
                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">Derniers paiements</label>
                            <div className="mt-2 space-y-1">
                              {subscription.payments.slice(0, 3).map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {(payment.amount / 100).toFixed(2)}€
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    payment.status === 'SUCCEEDED' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {payment.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {subscription.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleCancelSubscription(subscription.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                            >
                              Annuler
                            </button>
                          )}
                          {subscription.status === 'CANCELED' && (
                            <button
                              onClick={() => handleRenewSubscription(subscription.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                            >
                              Renouveler
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Aucun abonnement trouvé pour cet Admin</p>
                    <p className="text-sm mt-2">Sélectionnez un Admin dans la section Utilisateurs pour voir ses abonnements</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Sélectionnez un Admin dans la section Utilisateurs pour voir ses abonnements</p>
              </div>
            )}
          </div>
        )}

        {/* Billing Section */}
        {activeSection === 'billing' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Facturation</h2>
            <div className="text-center text-gray-500 py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Section Facturation</p>
              <p className="text-sm mt-2">Le contenu fonctionnel sera implémenté ultérieurement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

