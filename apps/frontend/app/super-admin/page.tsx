'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/auth.service';
import { routes } from '@/config/routes';
import { superAdminService, User, UserDetails, Teacher, Subscription } from '@/services/super-admin/super-admin.service';
import { Users, Building2, CreditCard, FileText, Search, Filter, ChevronRight, Mail, Calendar, CheckCircle, XCircle, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';

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
  const [allActiveSubscriptions, setAllActiveSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
  
  // Reassign teacher section
  const [allAdmins, setAllAdmins] = useState<User[]>([]);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [teacherToReassign, setTeacherToReassign] = useState<User | null>(null);
  const [selectedNewAdminId, setSelectedNewAdminId] = useState<string>('');
  const [isReassigning, setIsReassigning] = useState(false);

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

  const loadAllActiveSubscriptions = async () => {
    try {
      setIsLoadingSubscriptions(true);
      const subscriptions = await superAdminService.getAllActiveSubscriptions();
      setAllActiveSubscriptions(subscriptions);
    } catch (error) {
      console.error('Error loading active subscriptions:', error);
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'subscriptions') {
      loadAllActiveSubscriptions();
    }
  }, [activeSection]);

  const loadAllAdmins = async () => {
    try {
      const admins = await superAdminService.getAllAdmins();
      setAllAdmins(admins);
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  useEffect(() => {
    loadAllAdmins();
  }, []);

  const handleReassignTeacher = async () => {
    if (!teacherToReassign || !selectedNewAdminId) {
      alert('Veuillez sélectionner un admin');
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir réassigner ${teacherToReassign.firstName} ${teacherToReassign.lastName} à un autre admin ?`)) {
      return;
    }

    try {
      setIsReassigning(true);
      await superAdminService.reassignTeacherToAdmin(teacherToReassign.id, selectedNewAdminId);
      
      // Recharger les données
      if (selectedUser?.role === 'ADMIN' && selectedUser.id) {
        await loadUserDetails(selectedUser.id);
      }
      await loadUsers();
      await loadAllAdmins();
      
      alert('Responsable pédagogique réassigné avec succès');
      setShowReassignModal(false);
      setTeacherToReassign(null);
      setSelectedNewAdminId('');
    } catch (error: any) {
      alert(`Erreur: ${error.message || 'Impossible de réassigner le responsable pédagogique'}`);
    } finally {
      setIsReassigning(false);
    }
  };

  const openReassignModal = (teacher: User) => {
    setTeacherToReassign(teacher);
    setShowReassignModal(true);
    setSelectedNewAdminId('');
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return '';
      case 'ADMIN':
        return '';
      case 'RESPONSABLE_PEDAGOGIQUE':
        return '';
      default:
        return '';
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { backgroundColor: '#F69D04', color: '#FFFFFF' };
      case 'ADMIN':
        return { backgroundColor: '#FFE552', color: '#2F2E2C' };
      case 'RESPONSABLE_PEDAGOGIQUE':
        return { backgroundColor: '#F69D04', color: '#FFFFFF' };
      default:
        return { backgroundColor: '#E5E5E5', color: '#2F2E2C' };
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#F69D04' }}></div>
          <p className="mt-4" style={{ color: '#2F2E2C' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#E5E5E5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold" style={{ color: '#2F2E2C' }}>Dashboard Super Admin</h1>
          <p className="mt-2 text-sm" style={{ color: '#2F2E2C' }}>Gestion globale des utilisateurs, abonnements et facturation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveSection('users')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === 'users'
                    ? ''
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={activeSection === 'users' 
                  ? { borderColor: '#F69D04', color: '#F69D04' }
                  : { color: '#2F2E2C' }
                }
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
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === 'subscriptions'
                    ? ''
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={activeSection === 'subscriptions' 
                  ? { borderColor: '#F69D04', color: '#F69D04' }
                  : { color: '#2F2E2C' }
                }
              >
                <CreditCard className="inline-block mr-2 h-5 w-5" />
                Abonnements
              </button>
              <button
                onClick={() => setActiveSection('billing')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === 'billing'
                    ? ''
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={activeSection === 'billing' 
                  ? { borderColor: '#F69D04', color: '#F69D04' }
                  : { color: '#2F2E2C' }
                }
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
                <h2 className="text-xl font-semibold" style={{ color: '#2F2E2C' }}>Tous les utilisateurs</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#E5E5E5', color: '#2F2E2C' }}
                    onFocus={(e) => e.target.style.borderColor = '#F69D04'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#E5E5E5', color: '#2F2E2C' }}
                    onFocus={(e) => e.target.style.borderColor = '#F69D04'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
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
                        ? ''
                        : 'hover:border-gray-300'
                    }`}
                    style={selectedUser?.id === user.id
                      ? { borderColor: '#F69D04', backgroundColor: '#FFE552' }
                      : { borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium" style={{ color: '#2F2E2C' }}>
                            {user.firstName} {user.lastName}
                          </h3>
                          <span className="px-2 py-1 rounded text-xs font-medium" style={getRoleBadgeStyle(user.role)}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: '#2F2E2C' }}>{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#2F2E2C' }}>
                          <span>{user._count.classes} classes</span>
                          <span>{user._count.subjects} matières</span>
                          {user._count.subscriptions > 0 && (
                            <span>{user._count.subscriptions} abonnements</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.role === 'RESPONSABLE_PEDAGOGIQUE' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openReassignModal(user);
                            }}
                            className="px-2 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1"
                            style={{ color: '#F69D04', backgroundColor: '#FFE552' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#F69D04';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#FFE552';
                              e.currentTarget.style.color = '#F69D04';
                            }}
                            title="Réassigner à un autre admin"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Réassigner
                          </button>
                        )}
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {selectedUser ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: '#2F2E2C' }}>Détails de l'utilisateur</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium" style={{ color: '#2F2E2C' }}>Nom complet</label>
                      <p style={{ color: '#2F2E2C' }}>{selectedUser.firstName} {selectedUser.lastName}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium" style={{ color: '#2F2E2C' }}>Email</label>
                      <p style={{ color: '#2F2E2C' }}>{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium" style={{ color: '#2F2E2C' }}>Rôle</label>
                      <p>
                        <span className="px-2 py-1 rounded text-xs font-medium" style={getRoleBadgeStyle(selectedUser.role)}>
                          {selectedUser.role}
                        </span>
                      </p>
                    </div>
                    
                    {selectedUser.establishment && (
                      <div>
                        <label className="text-sm font-medium" style={{ color: '#2F2E2C' }}>Établissement</label>
                        <p style={{ color: '#2F2E2C' }}>{selectedUser.establishment.name}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium" style={{ color: '#2F2E2C' }}>Statut</label>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedUser.isActive ? (
                          <CheckCircle className="h-4 w-4" style={{ color: '#10B981' }} />
                        ) : (
                          <XCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
                        )}
                        <span className="text-sm" style={{ color: '#2F2E2C' }}>
                          {selectedUser.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>

                    {selectedUser.role === 'ADMIN' && selectedAdminTeachers.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: '#2F2E2C' }}>
                          Professeurs associés ({selectedAdminTeachers.length})
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {selectedAdminTeachers.map((teacher) => (
                            <div key={teacher.id} className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: '#F5F5F5' }}>
                              <div className="flex-1">
                                <p className="font-medium text-sm" style={{ color: '#2F2E2C' }}>
                                  {teacher.firstName} {teacher.lastName}
                                </p>
                                <p className="text-xs" style={{ color: '#2F2E2C' }}>{teacher.email}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#2F2E2C' }}>
                                  <span>{teacher._count.classes} classes</span>
                                  <span>{teacher._count.subjects} matières</span>
                                </div>
                              </div>
                              <button
                                onClick={() => openReassignModal(teacher)}
                                className="ml-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                style={{ color: '#F69D04', backgroundColor: '#FFE552' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#F69D04';
                                  e.currentTarget.style.color = '#FFFFFF';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFE552';
                                  e.currentTarget.style.color = '#F69D04';
                                }}
                                title="Réassigner à un autre admin"
                              >
                                <ArrowRight className="h-3 w-3" />
                                Réassigner
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedUser.role === 'RESPONSABLE_PEDAGOGIQUE' && (
                      <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E5E5E5' }}>
                        <button
                          onClick={() => openReassignModal(selectedUser)}
                          className="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                          style={{ color: '#F69D04', backgroundColor: '#FFE552' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F69D04';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFE552';
                            e.currentTarget.style.color = '#F69D04';
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                          Réassigner à un autre admin
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: '#2F2E2C' }}>
                  <Users className="h-12 w-12 mx-auto mb-4" style={{ color: '#E5E5E5' }} />
                  <p>Sélectionnez un utilisateur pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscriptions Section */}
        {activeSection === 'subscriptions' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#2F2E2C' }}>Tous les abonnements actifs</h2>
            
            {isLoadingSubscriptions ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#F69D04' }}></div>
                <p className="mt-4" style={{ color: '#2F2E2C' }}>Chargement des abonnements...</p>
              </div>
            ) : allActiveSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {allActiveSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow" style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg" style={{ color: '#2F2E2C' }}>
                            {subscription.user?.firstName} {subscription.user?.lastName}
                          </h3>
                          <span className="px-2 py-1 rounded text-xs font-medium" style={getRoleBadgeStyle(subscription.user?.role || '')}>
                            {subscription.user?.role}
                          </span>
                        </div>
                        <p className="text-sm mb-1" style={{ color: '#2F2E2C' }}>{subscription.user?.email}</p>
                        {subscription.user?.establishment && (
                          <p className="text-sm" style={{ color: '#2F2E2C' }}>Établissement: {subscription.user.establishment.name}</p>
                        )}
                      </div>
                      {getStatusBadge(subscription.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                      <div>
                        <label className="text-xs font-medium uppercase" style={{ color: '#2F2E2C' }}>Date de début</label>
                        <p className="text-sm font-medium mt-1" style={{ color: '#2F2E2C' }}>
                          {new Date(subscription.currentPeriodStart).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase" style={{ color: '#2F2E2C' }}>Date de fin</label>
                        <p className="text-sm font-medium mt-1" style={{ color: '#2F2E2C' }}>
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase" style={{ color: '#2F2E2C' }}>Montant</label>
                        <p className="text-lg font-bold mt-1" style={{ color: '#F69D04' }}>
                          {(subscription.totalAmount / 100).toFixed(2)}€
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#2F2E2C' }}>
                          {subscription.billingPeriod === 'MONTHLY' ? 'Mensuel' : 'Annuel'} • {subscription.classCount} classe{subscription.classCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {subscription.payments && subscription.payments.length > 0 && (
                      <div className="mb-4 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                        <label className="text-sm font-medium" style={{ color: '#2F2E2C' }}>Dernier paiement</label>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm" style={{ color: '#2F2E2C' }}>
                            {(subscription.payments[0].amount / 100).toFixed(2)}€ le{' '}
                            {new Date(subscription.payments[0].createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            subscription.payments[0].status === 'SUCCEEDED' 
                              ? '' 
                              : ''
                          }`}
                          style={subscription.payments[0].status === 'SUCCEEDED' 
                            ? { backgroundColor: '#10B981', color: '#FFFFFF' }
                            : { backgroundColor: '#EF4444', color: '#FFFFFF' }
                          }>
                            {subscription.payments[0].status === 'SUCCEEDED' ? 'Payé' : subscription.payments[0].status}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                      {subscription.status === 'ACTIVE' && (
                        <button
                          onClick={() => {
                            handleCancelSubscription(subscription.id);
                            setTimeout(() => loadAllActiveSubscriptions(), 1000);
                          }}
                          className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                          style={{ backgroundColor: '#EF4444' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                        >
                          Annuler l'abonnement
                        </button>
                      )}
                      {subscription.status === 'CANCELED' && (
                        <button
                          onClick={() => {
                            handleRenewSubscription(subscription.id);
                            setTimeout(() => loadAllActiveSubscriptions(), 1000);
                          }}
                          className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                          style={{ backgroundColor: '#10B981' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                        >
                          Renouveler l'abonnement
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" style={{ color: '#2F2E2C' }}>
                <CreditCard className="h-12 w-12 mx-auto mb-4" style={{ color: '#E5E5E5' }} />
                <p>Aucun abonnement actif trouvé</p>
              </div>
            )}
          </div>
        )}

        {/* Billing Section */}
        {activeSection === 'billing' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#2F2E2C' }}>Facturation</h2>
            <div className="text-center py-12" style={{ color: '#2F2E2C' }}>
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: '#E5E5E5' }} />
              <p>Section Facturation</p>
              <p className="text-sm mt-2">Le contenu fonctionnel sera implémenté ultérieurement</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de réassignation */}
      {showReassignModal && teacherToReassign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#2F2E2C' }}>
              Réassigner un Responsable pédagogique
            </h2>
            
            <div className="mb-4">
              <p className="text-sm mb-2" style={{ color: '#2F2E2C' }}>
                Responsable pédagogique à réassigner :
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                <p className="font-medium" style={{ color: '#2F2E2C' }}>
                  {teacherToReassign.firstName} {teacherToReassign.lastName}
                </p>
                <p className="text-sm" style={{ color: '#2F2E2C' }}>{teacherToReassign.email}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F2E2C' }}>
                Nouvel Admin :
              </label>
              <select
                value={selectedNewAdminId}
                onChange={(e) => setSelectedNewAdminId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#E5E5E5', color: '#2F2E2C' }}
                onFocus={(e) => e.target.style.borderColor = '#F69D04'}
                onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
              >
                <option value="">Sélectionner un admin</option>
                {allAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.firstName} {admin.lastName} ({admin.email})
                    {admin.establishment && ` - ${admin.establishment.name}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setTeacherToReassign(null);
                  setSelectedNewAdminId('');
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: '#2F2E2C', backgroundColor: '#E5E5E5' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D1D5DB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E5E5E5'}
                disabled={isReassigning}
              >
                Annuler
              </button>
              <button
                onClick={handleReassignTeacher}
                disabled={!selectedNewAdminId || isReassigning}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: '#F69D04' }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#E88A00')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#F69D04')}
              >
                {isReassigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Réassignation...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Réassigner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

