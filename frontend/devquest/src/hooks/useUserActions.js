import { useMemo } from 'react'
import userApi from '@/api/userApi'
import workspaceApi from '@/api/workspaceApi'

const resolveMessage = (payload, fallbackMessage) =>
  payload?.message ?? payload?.data?.message ?? fallbackMessage

export function useUserActions() {
  return useMemo(
    () => ({
      handleGetMe: async () => {
        const data = await userApi.getMe()

        return {
          success: true,
          data,
        }
      },
      handleUpdateProfile: async (values) => {
        const data = await userApi.updateProfile(values)

        return {
          success: true,
          data,
          message: resolveMessage(data, 'Profile updated successfully.'),
        }
      },
      handleChangePassword: async (values) => {
        const data = await userApi.changePassword(values)

        return {
          success: true,
          data,
          message: resolveMessage(data, 'Password updated successfully.'),
        }
      },
      handleUploadAvatar: async (values) => {
        const data = await userApi.uploadAvatar(values)

        return {
          success: true,
          data,
          message: resolveMessage(data, 'Avatar uploaded successfully.'),
        }
      },
      handleGetWorkspaces: async () => {
        const data = await userApi.getWorkspaces()

        return {
          success: true,
          data,
        }
      },
      handleCreateWorkspace: async (values) => {
        const data = await workspaceApi.create(values)

        return {
          success: true,
          data,
          message: resolveMessage(data, 'Workspace created successfully.'),
        }
      },
    }),
    [],
  )
}
