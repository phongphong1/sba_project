import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { octomCardClass, octomLoadingCardClass } from '@/constants/uiStyles'
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'
import { useUserActions } from '@/hooks/useUserActions'
import {
  createEmptyProfileData,
  createPasswordErrors,
  createPasswordForm,
  createProfileForm,
  getRequestErrorMessage,
  getRoleLabel,
  hasPasswordErrors,
  normalizeProfileData,
  normalizeWorkspaceList,
  profileTabs,
  validatePasswordForm,
} from './profile.helpers'
import ProfileGeneralSection from './sections/ProfileGeneralSection'
import ProfileOverviewCard from './sections/ProfileOverviewCard'
import ProfileSecuritySection from './sections/ProfileSecuritySection'
import ProfileWorkspacesSection from './sections/ProfileWorkspacesSection'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { getPreferredBoardId, refreshWorkspaces } = useWorkspaceShell()
  const {
    handleGetMe,
    handleUpdateProfile,
    handleChangePassword,
    handleGetWorkspaces,
    handleCreateWorkspace,
  } = useUserActions()
  const [activeTab, setActiveTab] = useState('general')
  const [profileData, setProfileData] = useState(createEmptyProfileData)
  const [profileForm, setProfileForm] = useState(() =>
    createProfileForm(createEmptyProfileData().user),
  )
  const [passwordForm, setPasswordForm] = useState(createPasswordForm)
  const [passwordErrors, setPasswordErrors] = useState(createPasswordErrors)
  const [workspaceList, setWorkspaceList] = useState([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false)
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)
  const [hasLoadedWorkspaceList, setHasLoadedWorkspaceList] = useState(false)
  const [hasProfileError, setHasProfileError] = useState(false)

  const roleLabel = useMemo(
    () => getRoleLabel(profileData.user.systemRole),
    [profileData.user.systemRole],
  )

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      setIsLoadingProfile(true)
      setHasProfileError(false)

      try {
        const result = await handleGetMe()
        const nextData = normalizeProfileData(result.data)

        if (!isMounted || !nextData) return

        setProfileData(nextData)
        setProfileForm(createProfileForm(nextData.user))
      } catch {
        if (!isMounted) return

        setProfileData(createEmptyProfileData())
        setProfileForm(createProfileForm(createEmptyProfileData().user))
        setHasProfileError(true)
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [handleGetMe])

  useEffect(() => {
    let isMounted = true

    // Workspaces are fetched lazily when the tab is opened the first time.
    if (activeTab !== 'workspaces' || hasLoadedWorkspaceList) {
      return () => {
        isMounted = false
      }
    }

    const loadWorkspaces = async () => {
      setIsLoadingWorkspaces(true)

      try {
        const result = await handleGetWorkspaces()

        if (!isMounted) return

        setWorkspaceList(normalizeWorkspaceList(result.data))
      } catch {
        if (!isMounted) return

        setWorkspaceList([])
      } finally {
        if (isMounted) {
          setIsLoadingWorkspaces(false)
          setHasLoadedWorkspaceList(true)
        }
      }
    }

    void loadWorkspaces()

    return () => {
      isMounted = false
    }
  }, [activeTab, handleGetWorkspaces, hasLoadedWorkspaceList])

  const handleProfileFieldChange = (field, value) => {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handlePasswordFieldChange = (field, value) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }))
    setPasswordErrors((current) => ({
      ...current,
      [field]: '',
    }))
  }

  const handleResetProfile = () => {
    setProfileForm(createProfileForm(profileData.user))
  }

  const handleReloadProfile = () => {
    window.location.reload()
  }

  const handleAvatarUpdated = (avatarUrl) => {
    setProfileData((current) => ({
      ...current,
      user: {
        ...current.user,
        avatarUrl,
      },
    }))
  }

  const handleResetPassword = () => {
    setPasswordForm(createPasswordForm())
    setPasswordErrors(createPasswordErrors())
  }

  const handleRefreshWorkspaces = () => {
    setHasLoadedWorkspaceList(false)
  }

  const handleCreateWorkspaceSubmit = async (values) => {
    setIsCreatingWorkspace(true)

    try {
      const result = await handleCreateWorkspace(values)
      const workspaceResult = await handleGetWorkspaces()

      setWorkspaceList(normalizeWorkspaceList(workspaceResult.data))
      setHasLoadedWorkspaceList(true)
      await refreshWorkspaces()

      toast.success(result.message)
    } catch (error) {
      toast.error(getRequestErrorMessage(error, 'Unable to create workspace.'))
      throw error
    } finally {
      setIsCreatingWorkspace(false)
    }
  }

  const handleOpenWorkspace = (workspaceId) => {
    navigate(`/w/${workspaceId}/dashboard`)
  }

  const handleOpenBoard = (workspaceId, boardId) => {
    navigate(boardId ? `/w/${workspaceId}/boards/${boardId}` : `/w/${workspaceId}/boards`)
  }

  const handleSaveProfile = async () => {
    const payload = {
      fullName: profileForm.fullName,
      bio: profileForm.bio,
      emailNotifications: profileForm.emailNotifications,
    }

    setIsSavingProfile(true)

    try {
      const result = await handleUpdateProfile(payload)
      const nextUser = {
        ...profileData.user,
        ...payload,
        ...result.data?.user,
      }

      setProfileData((current) => ({
        ...current,
        user: nextUser,
      }))
      setProfileForm(createProfileForm(nextUser))
      toast.success(result.message)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSavePassword = async () => {
    const nextErrors = validatePasswordForm(passwordForm)

    setPasswordErrors(nextErrors)

    if (hasPasswordErrors(nextErrors)) {
      toast.error('Please review the password fields and try again.')
      return
    }

    const payload = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword,
    }

    setIsSavingPassword(true)

    try {
      const result = await handleChangePassword(payload)
      setPasswordForm(createPasswordForm())
      setPasswordErrors(createPasswordErrors())
      toast.success(result.message)
    } catch (error) {
      toast.error(getRequestErrorMessage(error, 'Unable to update password.'))
    } finally {
      setIsSavingPassword(false)
    }
  }

  const hasProfileIdentity = Boolean(
    profileData.user.id || profileData.user.email || profileData.user.fullName,
  )

  if (isLoadingProfile && !hasProfileIdentity) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <Card className={octomLoadingCardClass}>Loading profile...</Card>
      </div>
    )
  }

  if (!hasProfileIdentity) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Profile data"
          title={hasProfileError ? 'Unable to load your profile' : 'No profile data available'}
          description={
            hasProfileError
              ? 'The profile request failed, so the page is not falling back to mock data anymore.'
              : 'The API did not return a user profile for this account.'
          }
          primaryActionLabel="Refresh"
          onPrimaryAction={handleReloadProfile}
        />
      </main>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
      <div className="space-y-6">
        <ProfileOverviewCard
          profileData={profileData}
          profileForm={profileForm}
          roleLabel={roleLabel}
          onAvatarUpdated={handleAvatarUpdated}
        />
      </div>

      <Card className={`space-y-6 ${octomCardClass}`}>
        <div className="flex flex-wrap items-center gap-2">
          {profileTabs.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <Button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                variant={isActive ? 'default' : 'outline'}
                className={`rounded-full px-4 text-sm font-semibold ${isActive
                  ? 'bg-[#5051F9] text-white shadow-lg shadow-indigo-200'
                  : 'border-slate-200 bg-white text-slate-500 shadow-none hover:bg-slate-50'
                  }`}
              >
                {tab.label}
              </Button>
            )
          })}
        </div>

        {activeTab === 'general' ? (
          <ProfileGeneralSection
            profileForm={profileForm}
            isLoadingProfile={isLoadingProfile}
            isSavingProfile={isSavingProfile}
            onFieldChange={handleProfileFieldChange}
            onReset={handleResetProfile}
            onSubmit={handleSaveProfile}
          />
        ) : null}

        {activeTab === 'security' ? (
          <ProfileSecuritySection
            passwordForm={passwordForm}
            passwordErrors={passwordErrors}
            isSavingPassword={isSavingPassword}
            onFieldChange={handlePasswordFieldChange}
            onReset={handleResetPassword}
            onSubmit={handleSavePassword}
          />
        ) : null}

        {activeTab === 'workspaces' ? (
          <ProfileWorkspacesSection
            workspaceList={workspaceList}
            isLoadingWorkspaces={isLoadingWorkspaces}
            isCreatingWorkspace={isCreatingWorkspace}
            activeSinceFallback={profileData.stats.activeSince}
            getPreferredBoardId={getPreferredBoardId}
            onOpenWorkspace={handleOpenWorkspace}
            onOpenBoard={handleOpenBoard}
            onRefresh={handleRefreshWorkspaces}
            onCreateWorkspace={handleCreateWorkspaceSubmit}
          />
        ) : null}
      </Card>
    </div>
  )
}
