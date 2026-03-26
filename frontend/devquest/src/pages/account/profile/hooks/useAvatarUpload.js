import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { uploadFileWithProgress } from '@/api/fileApi'
import { useUserActions } from '@/hooks/useUserActions'
import { getRequestErrorMessage } from '../profile.helpers'

function isImageFile(file) {
  return Boolean(file?.type?.startsWith('image/'))
}

export function useAvatarUpload({ onSuccess } = {}) {
  const { handleUploadAvatar } = useUserActions()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('')
      return undefined
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(nextPreviewUrl)

    return () => {
      URL.revokeObjectURL(nextPreviewUrl)
    }
  }, [selectedFile])

  const resetState = () => {
    setIsDragging(false)
    setSelectedFile(null)
    setUploadProgress(0)
    setErrorMessage('')
  }

  const openDialog = () => {
    setIsOpen(true)
  }

  const closeDialog = () => {
    if (isUploading) return

    setIsOpen(false)
    resetState()
  }

  const selectFile = (file) => {
    if (!file) {
      return
    }

    if (!isImageFile(file)) {
      const nextMessage = 'Please choose an image file.'
      setErrorMessage(nextMessage)
      toast.error(nextMessage)
      return
    }

    setSelectedFile(file)
    setUploadProgress(0)
    setErrorMessage('')
  }

  const handleInputChange = (event) => {
    selectFile(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  const handleDragOver = (event) => {
    event.preventDefault()

    if (!isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    selectFile(event.dataTransfer.files?.[0] ?? null)
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      const nextMessage = 'Please choose an image before saving.'
      setErrorMessage(nextMessage)
      toast.error(nextMessage)
      return
    }

    setIsUploading(true)
    setErrorMessage('')
    setUploadProgress(0)

    try {
      const uploadedUrl = await uploadFileWithProgress(selectedFile, (percent) => {
        setUploadProgress(percent)
      })
      const result = await handleUploadAvatar({ avatarUrl: uploadedUrl })
      const nextAvatarUrl = result.data?.avatarUrl ?? result.data?.user?.avatarUrl ?? uploadedUrl

      onSuccess?.(nextAvatarUrl, result)
      toast.success(result.message)
      setIsOpen(false)
      resetState()
    } catch (error) {
      const nextMessage = getRequestErrorMessage(error, 'Unable to update avatar.')
      setErrorMessage(nextMessage)
      toast.error(nextMessage)
    } finally {
      setIsUploading(false)
    }
  }

  return {
    errorMessage,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    handleSubmit,
    isDragging,
    isOpen,
    isUploading,
    openDialog,
    closeDialog,
    previewUrl,
    selectedFile,
    uploadProgress,
  }
}

export default useAvatarUpload
