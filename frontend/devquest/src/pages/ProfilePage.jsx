import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  FolderKanban,
  Mail,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomInputClass,
  octomMutedPanelClass,
  octomPrimaryButtonClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'
import { MOCK_TASKS_DATA } from '@/data/mockTasksBoard'
import { MOCK_USER_DATA } from '@/data/mockUser'

const profileTabs = [
  { id: 'general', label: 'General' },
  { id: 'my-project', label: 'My project' },
  { id: 'security', label: 'Security' },
]

const projectRoleMap = {
  'board-1': 'Owner',
  'board-2': 'Owner',
  'board-3': 'Member',
  'board-4': 'Member',
}

function getRoleLabel(systemRole) {
  return systemRole === 'ROLE_ADMIN' ? 'Admin' : 'User'
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general')
  const [profileForm, setProfileForm] = useState({
    username: MOCK_USER_DATA.user.username,
    email: MOCK_USER_DATA.user.email,
    bio: MOCK_USER_DATA.user.bio,
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [preferences, setPreferences] = useState(MOCK_USER_DATA.preferences)

  const roleLabel = useMemo(
    () => getRoleLabel(MOCK_USER_DATA.user.system_role),
    [],
  )

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
  }

  const handlePreferenceChange = (field, value) => {
    setPreferences((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleUpdateProfile = async () => {
    const payload = {
      username: profileForm.username,
      email: profileForm.email,
      bio: profileForm.bio,
      preferences,
    }

    void payload
    // Ready for PUT /api/users/profile
  }

  const handleChangePassword = async () => {
    const payload = {
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
      confirm_password: passwordForm.confirmPassword,
    }

    void payload
    // Ready for PUT /api/users/profile/password
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
      <div className="space-y-6">
        <Card className={`space-y-6 ${octomCardClass}`}>
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar
                className={`${octomAvatarBaseClass} h-28 w-28 rounded-[32px]`}
                style={{ backgroundColor: '#E0E7FF' }}
              >
                <AvatarFallback
                  className={`${octomAvatarFallbackClass} text-xl`}
                  style={{ backgroundColor: '#E0E7FF' }}
                >
                  {MOCK_USER_DATA.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-10 w-10 rounded-[16px] border border-white bg-white text-slate-600 shadow-lg hover:bg-slate-50"
                aria-label="Edit avatar"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
              {profileForm.username}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{profileForm.email}</p>
            <Badge className="mt-3 rounded-full bg-indigo-100 px-3 py-1 text-indigo-600">
              {roleLabel}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
              <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                <Users className="h-4 w-4 text-[#5051F9]" />
                Workspaces Joined
              </div>
              <span className="text-lg font-semibold text-slate-900">
                {MOCK_USER_DATA.stats.workspacesCount}
              </span>
            </div>

            <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
              <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-[#5051F9]" />
                Tasks Completed
              </div>
              <span className="text-lg font-semibold text-slate-900">
                {MOCK_USER_DATA.stats.tasksCompleted}
              </span>
            </div>

            <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
              <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                <MessageSquare className="h-4 w-4 text-[#5051F9]" />
                Total Comments
              </div>
              <span className="text-lg font-semibold text-slate-900">
                {MOCK_USER_DATA.stats.totalComments}
              </span>
            </div>
          </div>

          <Card className="rounded-[20px] border-0 bg-slate-50 px-4 py-4 shadow-none">
            <p className="text-sm font-medium text-slate-400">Active since</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {MOCK_USER_DATA.stats.activeSince}
            </p>
          </Card>
        </Card>
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
                className={`rounded-full px-4 text-sm font-semibold ${
                  isActive
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
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-400">General information</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Update your profile details
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Username</label>
                <Input
                  value={profileForm.username}
                  onChange={(event) => handleProfileFieldChange('username', event.target.value)}
                  className={octomInputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Email</label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => handleProfileFieldChange('email', event.target.value)}
                  className={octomInputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Bio</label>
              <Textarea
                value={profileForm.bio}
                onChange={(event) => handleProfileFieldChange('bio', event.target.value)}
                className="rounded-[18px] border-slate-200 bg-slate-50 shadow-none focus-visible:border-[#5051F9] focus-visible:ring-[#5051F9]/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className={`border-0 md:col-span-2 ${octomMutedPanelClass}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Mail className="h-4 w-4 text-[#5051F9]" />
                      Email notifications
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Receive updates about tasks, mentions, and workspace activity.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('emailNotifications', checked)
                    }
                  />
                </div>
              </Card>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="button" variant="secondary" className={`h-12 ${octomSecondaryButtonClass}`}>
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdateProfile} className={`h-12 ${octomPrimaryButtonClass}`}>
                Save changes
              </Button>
            </div>
          </div>
        ) : null}

        {activeTab === 'security' ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-400">Security</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Change your password
              </h2>
            </div>

            <div className="grid gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Current password</label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    handlePasswordFieldChange('currentPassword', event.target.value)
                  }
                  className={octomInputClass}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">New password</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      handlePasswordFieldChange('newPassword', event.target.value)
                    }
                    className={octomInputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Confirm password</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      handlePasswordFieldChange('confirmPassword', event.target.value)
                    }
                    className={octomInputClass}
                  />
                </div>
              </div>
            </div>

            <Card className={`border-0 ${octomMutedPanelClass}`}>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-[#5051F9]" />
                Security note
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use a unique password with at least 8 characters, numbers, and symbols for stronger account protection.
              </p>
            </Card>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button type="button" onClick={handleChangePassword} className={`h-12 ${octomPrimaryButtonClass}`}>
                Update password
              </Button>
            </div>
          </div>
        ) : null}

        {activeTab === 'my-project' ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-400">My projects</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Projects you are following
              </h2>
            </div>

            <div className="space-y-3">
              {MOCK_TASKS_DATA.projects.map((project) => (
                <Card
                  key={project.id}
                  className="rounded-[22px] border-0 bg-white px-5 py-5 shadow-sm ring-1 ring-slate-200/70"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-indigo-100 text-[#5051F9]">
                          <FolderKanban className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-[#5051F9]" />
                          Active since {MOCK_USER_DATA.stats.activeSince}
                        </span>
                        <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                          {projectRoleMap[project.id] ?? 'Member'}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      className={`h-11 shrink-0 ${octomSecondaryButtonClass}`}
                    >
                      Open project
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

      </Card>
    </div>
  )
}
