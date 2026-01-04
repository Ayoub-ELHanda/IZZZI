'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/auth.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/assets/Logo';
import { ArrowLeft, Edit, Bell, Check, ArrowRight, Trash2, Upload, UserPlus } from 'lucide-react';
import { InviteUserModal } from '@/components/admin/InviteUserModal';

export default function ProfilePage() {
  const router = useRouter();
  const authState = useAuth();
  const { user: authUser, logout, loadUser } = authState;
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    establishmentName: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
        setProfileForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          establishmentName: profile.establishment?.name || '',
        });
        // Set avatar preview if profile picture exists
        if (profile.profilePicture) {
          setAvatarPreview(profile.profilePicture);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        router.push(routes.auth.login);
      } finally {
        setIsLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      loadProfile();
    } else {
      router.push(routes.auth.login);
    }
  }, [router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setErrors({});
    setSuccessMessage('');

    try {
      await authService.updateProfile(profileForm);
      const updatedProfile = await authService.getProfile();
      setUser(updatedProfile);
      setSuccessMessage('Profil modifié avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrors({ profile: error.message || 'Erreur lors de la modification du profil' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setErrors({});
    setSuccessMessage('');

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ password: 'Les mots de passe ne correspondent pas' });
      setIsChangingPassword(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setErrors({ password: 'Le mot de passe doit contenir au moins 8 caractères' });
      setIsChangingPassword(false);
      return;
    }

    try {
      await authService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccessMessage('Mot de passe modifié avec succès');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrors({ password: error.message || 'Erreur lors de la modification du mot de passe' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }
    // TODO: Implement account deletion
    alert('Suppression de compte non implémentée pour le moment');
  };

  const handleLogout = async () => {
    await logout();
    router.push(routes.auth.login);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return '';
    const first = user.firstName?.charAt(0).toUpperCase() || '';
    const last = user.lastName?.charAt(0).toUpperCase() || '';
    return first + last;
  };

  // Handle profile picture upload
  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploadingPicture(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for now (in production, upload to cloud storage)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      // Update profile with picture URL (storing base64 for now)
      await authService.updateProfile({
        ...profileForm,
        profilePicture: base64,
      });

      // Reload profile to get updated data
      const updatedProfile = await authService.getProfile();
      setUser(updatedProfile);
      
      // Update auth state so header shows new picture
      await loadUser();
      
      setSuccessMessage('Photo de profil mise à jour avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error uploading picture:', error);
      alert(error.message || 'Erreur lors de l\'upload de la photo');
      setAvatarPreview(null);
    } finally {
      setIsUploadingPicture(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}

        {user.role === 'ADMIN' ? (
          // Admin layout: 3 columns
          <>
            {/* Page Title for Admin */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Admin</h1>
            <Link
              href={routes.dashboard}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Billing */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {(avatarPreview || user.profilePicture) ? (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img
                          src={avatarPreview || user.profilePicture || ''}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
                        {getInitials()}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        className="hidden"
                        disabled={isUploadingPicture}
                      />
                      {isUploadingPicture ? (
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4 text-gray-900" />
                      )}
                    </label>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {user.establishment?.name || 'Non défini'}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center gap-2"
                >
                  Déconnexion
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Billing Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gérer la facturation</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    Gère tes informations de paiement
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    Télécharge tes factures
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    Arrête ton abonnement
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-gray-900 border-gray-300 hover:bg-gray-50"
                  onClick={() => router.push(routes.account.billing)}
                >
                  Accéder au tableau de bord
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Invite User Card - Only for Admin */}
              {user.role === 'ADMIN' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Inviter un utilisateur</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Invitez un responsable pédagogique à rejoindre votre établissement.
                  </p>
                  <Button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="w-full bg-[#FFD93D] hover:bg-[#FFC93D] text-gray-900 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Inviter un responsable pédagogique
                  </Button>
                </div>
              )}
            </div>

            {/* Middle Column - Personal Info */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Modifier mes informations personnelles
                </h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <Input
                    label="Prénom"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Nom"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, lastName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Établissement"
                    name="establishmentName"
                    value={profileForm.establishmentName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, establishmentName: e.target.value })
                    }
                  />
                  {errors.profile && (
                    <p className="text-sm text-red-600">{errors.profile}</p>
                  )}
                  <Button
                    type="submit"
                    isLoading={isUpdatingProfile}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center gap-2"
                  >
                    Modifier
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Column - Password & Delete */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Modifier mon mot de passe
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    label="Ancien mot de passe"
                    type="password"
                    name="oldPassword"
                    placeholder="Entrez votre ancien mot de passe"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                    }
                    required
                  />
                  <div>
                    <Input
                      label="Nouveau"
                      type="password"
                      name="newPassword"
                      placeholder="Entrez votre nouveau mot de passe"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      required
                    />
                    <ul className="mt-2 text-xs text-gray-500 space-y-1">
                      <li>• 8 caractères</li>
                      <li>• 1 minuscule</li>
                      <li>• 1 majuscule</li>
                    </ul>
                  </div>
                  <Input
                    label="Confirmez votre nouveau mot de passe"
                    type="password"
                    name="confirmPassword"
                    placeholder="Entrez votre nouveau mot de passe"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                  <Button
                    type="submit"
                    isLoading={isChangingPassword}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center gap-2"
                  >
                    Modifier
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Supprimer mon compte et toutes mes données
                </h3>
                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Je supprime mon compte
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          </>
        ) : (
          // Non-admin layout: 3 columns side-by-side (like Image 2)
          <>
            {/* Retour link above all cards */}
            <Link
              href={routes.dashboard}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Card - Profile Card (NO title inside) */}
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {(avatarPreview || user.profilePicture) ? (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img
                          src={avatarPreview || user.profilePicture || ''}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
                        {getInitials()}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        className="hidden"
                        disabled={isUploadingPicture}
                      />
                      {isUploadingPicture ? (
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4 text-gray-900" />
                      )}
                    </label>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {user.establishment?.name || 'Non défini'}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center gap-2"
                >
                  Déconnexion
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Middle Card - Personal Information Form */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Modifier mes informations personnelles
                </h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <Input
                    label="Prénom"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Nom"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, lastName: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    required
                  />
                  {errors.profile && (
                    <p className="text-sm text-red-600">{errors.profile}</p>
                  )}
                  <Button
                    type="submit"
                    isLoading={isUpdatingProfile}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center gap-2"
                  >
                    Modifier
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Card - Password Change Form */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Modifier mon mot de passe
                  </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    label="Ancien mot de passe"
                    type="password"
                    name="oldPassword"
                    placeholder="Entrez votre ancien mot de passe"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                    }
                    required
                  />
                  <div>
                    <Input
                      label="Nouveau"
                      type="password"
                      name="newPassword"
                      placeholder="Entrez votre nouveau mot de passe"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      required
                    />
                    <ul className="mt-2 text-xs text-gray-500 space-y-1">
                      <li>• 8 caractères</li>
                      <li>• 1 minuscule</li>
                      <li>• 1 majuscule</li>
                    </ul>
                  </div>
                  <Input
                    label="Confirmez votre nouveau mot de passe"
                    type="password"
                    name="confirmPassword"
                    placeholder="Entrez votre nouveau mot de passe"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                  <Button
                    type="submit"
                    isLoading={isChangingPassword}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center gap-2"
                  >
                    Modifier
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Invite User Modal */}
      {user?.role === 'ADMIN' && (
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}
    </div>
  );
}
