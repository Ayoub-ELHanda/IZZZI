'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MoveUpLeft, Pen, ArrowUpRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/auth.service';
import { Button } from '@/components/ui/Button';
import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal';
import { AvatarUploadModal } from '@/components/modals/AvatarUploadModal';
import { ProfileForm, ProfileFormData } from '@/components/forms/ProfileForm';
import { PasswordForm, PasswordFormData } from '@/components/forms/PasswordForm';
import { useModal } from '@/hooks/useModal';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { InviteUserModal } from '@/components/admin/InviteUserModal';
import { UserPlus } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout, loadUser } = useAuth();
  const deleteAccountModal = useModal();
  const avatarUploadModal = useModal();
  const inviteUserModal = useModal();

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [isEditingPassword, setIsEditingPassword] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const profileInitialData = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      organization: user?.establishment?.name || '',
    }),
    [user]
  );

  useEffect(() => {
    const loadProfile = async () => {
      if (authUser) {
        setUser(authUser);
        setIsLoading(false);
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
        }
      } else {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          router.push(routes.auth.login);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (authService.isAuthenticated()) {
      loadProfile();
    } else {
      router.push(routes.auth.login);
    }
  }, [router, authUser]);

  const handleBack = () => {
    router.push(routes.dashboard);
  };

  const handleLogout = async () => {
    await logout();
    router.push(routes.home);
  };

  const handleEditProfilePhoto = () => {
    setAvatarUploadError(null);
    avatarUploadModal.onOpen();
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileError(null);
  };

  const handleSaveProfile = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    setProfileError(null);

    try {
      await authService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        establishmentName: data.organization,
      });
      const updatedProfile = await authService.getProfile();
      setUser(updatedProfile);
      await loadUser();
      setIsEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      setProfileError(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSavePassword = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    setPasswordError(null);

    try {
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setIsEditingPassword(false);
      toast.success('Mot de passe modifié avec succès');
    } catch (error: any) {
      setPasswordError(error.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    deleteAccountModal.onOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeletingAccount(true);
      await authService.deleteAccount();
      toast.success('Votre compte a été supprimé avec succès');
      deleteAccountModal.onClose();
      logout();
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression du compte');
      setIsDeletingAccount(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingPicture(true);
    setUploadProgress(0);
    setAvatarUploadError(null);

    try {
      
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      await authService.updateProfile({
        firstName: profileInitialData.firstName,
        lastName: profileInitialData.lastName,
        email: profileInitialData.email,
        establishmentName: profileInitialData.organization || undefined,
        profilePicture: base64,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const updatedProfile = await authService.getProfile();
      setUser(updatedProfile);
      await loadUser();

      avatarUploadModal.onClose();
      toast.success('Photo de profil mise à jour avec succès');
    } catch (error: any) {
      setAvatarUploadError(error.message || "Erreur lors de l'upload de la photo");
    } finally {
      setIsUploadingPicture(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const getInitials = () => {
    const first = profileInitialData.firstName?.charAt(0) || '';
    const last = profileInitialData.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              border: '4px solid #2F2E2C',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto',
            }}
          />
          <p style={{ fontFamily: 'Poppins, sans-serif', color: '#6B6B6B' }}>
            Chargement du profil...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'ADMIN';

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F8F8F8',
          paddingTop: '80px',
        }}
        className="sm:pt-[100px]"
      >
        <div style={{ maxWidth: '1650px', width: '100%', margin: '0 auto', padding: '0 16px' }} className="sm:p-0 sm:px-8">
          <div className="flex items-center gap-3 md:gap-[13px] mb-6 md:mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 md:gap-3 bg-none border-none cursor-pointer p-0"
            >
              <div
                className="w-10 h-10 md:w-[43px] md:h-[43px] bg-white rounded-full flex items-center justify-center border border-[#E5E5E5] transition-colors hover:bg-[#F5F5F5]"
              >
                <MoveUpLeft size={16} color="#2F2E2C" />
              </div>
              <span
                className="text-sm md:text-sm font-poppins text-[#2F2E2C] underline underline-offset-2"
              >
                Retour
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3" style={{ alignItems: 'start' }}>
            <div className="flex flex-col gap-6 md:gap-6">
              <div
                className="p-6 md:p-12"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div className="w-full md:w-[164px]" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      className="w-32 h-32 md:w-[164px] md:h-[164px]"
                      style={{
                        borderRadius: '50%',
                        backgroundColor: '#F5F5F5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {user.profilePicture || (avatarUploadModal.open && null) ? (
                        <img
                          src={user.profilePicture || ''}
                          alt={`${profileInitialData.firstName} ${profileInitialData.lastName}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span
                          className="text-2xl md:text-[32px]"
                          style={{
                            fontFamily: 'Mochiy Pop One, sans-serif',
                            color: '#6B6B6B',
                          }}
                        >
                          {getInitials()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleEditProfilePhoto}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: '#FFD93D',
                        borderRadius: '50%',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFE566';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFD93D';
                      }}
                      title="Modifier la photo"
                    >
                      <Pen size={16} color="#2F2E2C" />
                    </button>
                  </div>

                  <p
                    className="text-sm md:text-base"
                    style={{
                      fontFamily: 'Mochiy Pop One, sans-serif',
                      fontWeight: 700,
                      color: '#2F2E2C',
                      textAlign: 'center',
                      margin: 0,
                    }}
                  >
                    {profileInitialData.firstName} {profileInitialData.lastName}
                  </p>
                  <p
                    className="text-xs md:text-sm"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: '#2F2E2C',
                      margin: 0,
                    }}
                  >
                    {profileInitialData.email}
                  </p>
                  <p
                    className="text-[10px] md:text-[10px]"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      color: '#2F2E2C',
                      textAlign: 'center',
                      margin: 0,
                    }}
                  >
                    {profileInitialData.organization}
                  </p>
                </div>

                <Button
                  onClick={handleLogout}
                  isLoading={false}
                  disabled={false}
                  className="text-sm md:text-base py-4 px-6 md:py-4 md:px-[26px] gap-4 md:gap-[29px]"
                  style={{
                    backgroundColor: '#FFD93D',
                    color: '#2F2E2C',
                    fontFamily: 'Poppins, sans-serif',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'center',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFE566';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFD93D';
                  }}
                >
                  Déconnexion
                  <ArrowUpRight size={16} />
                </Button>
              </div>
              {isAdmin && (
                <div
                  className="p-6 md:p-12"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <p
                    className="text-base md:text-lg"
                    style={{
                      fontFamily: 'Mochiy Pop One, sans-serif',
                      color: '#2F2E2C',
                      margin: 0,
                    }}
                  >
                    Gérer la facturation
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <Check size={16} color="#22C55E" style={{ flexShrink: 0 }} />
                      <p
                        className="text-sm md:text-base"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          color: '#2F2E2C',
                          margin: 0,
                        }}
                      >
                        Gère tes informations de paiement
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <Check size={16} color="#22C55E" style={{ flexShrink: 0 }} />
                      <p
                        className="text-sm md:text-base"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          color: '#2F2E2C',
                          margin: 0,
                        }}
                      >
                        Télécharge tes factures
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <Check size={16} color="#22C55E" style={{ flexShrink: 0 }} />
                      <p
                        className="text-sm md:text-base"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          color: '#2F2E2C',
                          margin: 0,
                        }}
                      >
                        Arrête ton abonnement
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(routes.dashboard)}
                    variant="outline"
                    className="text-sm md:text-base py-4 px-6 md:py-4 md:px-[26px] gap-4 md:gap-[29px]"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      color: '#2F2E2C',
                      fontFamily: 'Poppins, sans-serif',
                      height: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F5F5F5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    Accéder au tableau de bord
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              )}

            </div>
            <div className="flex flex-col gap-6 md:gap-6">
              <div
                className="p-6 md:p-14"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'flex-start',
                  width: '100%',
                  minHeight: 'fit-content',
                }}
              >
                <p
                  className="text-base md:text-lg"
                  style={{
                    fontFamily: 'Mochiy Pop One, sans-serif',
                    fontWeight: 700,
                    color: '#2F2E2C',
                    margin: 0,
                    lineHeight: '1.2',
                  }}
                >
                  Modifier mes informations personnelles
                </p>
                <ErrorAlert
                  title="Erreur lors de la mise à jour du profil"
                  message={profileError}
                />
                <div style={{ width: '100%' }}>
                  <ProfileForm
                    initialData={profileInitialData}
                    onSubmit={handleSaveProfile}
                    onCancel={() => {
                      setIsEditingProfile(false);
                      setProfileError(null);
                    }}
                    isLoading={isUpdatingProfile}
                    isEditing={isEditingProfile}
                    onEdit={handleEditProfile}
                    userInitials={getInitials()}
                  />
                </div>
              </div>
              {isAdmin && (
                <div
                  className="p-6 md:p-12"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <p
                    className="text-base md:text-lg"
                    style={{
                      fontFamily: 'Mochiy Pop One, sans-serif',
                      color: '#2F2E2C',
                      margin: 0,
                    }}
                  >
                    Inviter un utilisateur
                  </p>
                  <p
                    className="text-xs md:text-sm"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      color: '#6B6B6B',
                      margin: 0,
                    }}
                  >
                    Invitez un responsable pédagogique à rejoindre votre établissement.
                  </p>
                  <Button
                    onClick={() => inviteUserModal.onOpen()}
                    className="text-sm md:text-base py-4 px-6 md:py-4 md:px-[26px] gap-2 md:gap-2"
                    style={{
                      backgroundColor: '#FFD93D',
                      color: '#2F2E2C',
                      fontFamily: 'Poppins, sans-serif',
                      height: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'center',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFE566';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFD93D';
                    }}
                  >
                    <UserPlus size={16} />
                    Inviter un responsable pédagogique
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6 md:gap-6">
              <div
                className="p-6 md:p-14"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'flex-start',
                }}
              >
                <p
                  className="text-base md:text-lg"
                  style={{
                    fontFamily: 'Mochiy Pop One, sans-serif',
                    color: '#2F2E2C',
                    margin: 0,
                  }}
                >
                  Modifier mon mot de passe
                </p>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <ErrorAlert
                    title="Erreur lors de la modification du mot de passe"
                    message={passwordError}
                  />

                  <PasswordForm
                    onSubmit={handleSavePassword}
                    onCancel={() => {
                      setIsEditingPassword(false);
                      setPasswordError(null);
                    }}
                    isLoading={isChangingPassword}
                    isEditing={isEditingPassword}
                    onEdit={() => setIsEditingPassword(true)}
                  />
                </div>
              </div>
              <div
                className="p-6 md:p-12"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
              >
                <p
                  className="text-base md:text-lg"
                  style={{
                    fontFamily: 'Mochiy Pop One, sans-serif',
                    color: '#2F2E2C',
                    margin: 0,
                  }}
                >
                  Supprimer mon compte et toutes mes données
                </p>
                <Button
                  type="button"
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="text-sm md:text-base py-4 px-6 md:py-4 md:px-6 gap-4 md:gap-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    color: '#2F2E2C',
                    fontFamily: 'Poppins, sans-serif',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F5F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  Je supprime mon compte
                  <ArrowUpRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        open={deleteAccountModal.open}
        onOpenChange={deleteAccountModal.onOpenChange}
        isLoading={isDeletingAccount}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeletingAccount) {
            deleteAccountModal.onClose();
          }
        }}
      />

      <AvatarUploadModal
        open={avatarUploadModal.open}
        onOpenChange={avatarUploadModal.onOpenChange}
        onUpload={handleAvatarUpload}
        onCancel={() => {
          setAvatarUploadError(null);
          avatarUploadModal.onClose();
        }}
        isLoading={isUploadingPicture}
        uploadProgress={uploadProgress}
        error={avatarUploadError}
      />

      <InviteUserModal
        isOpen={inviteUserModal.open}
        onClose={inviteUserModal.onClose}
        onSuccess={() => {
          
        }}
      />
    </>
  );
}
