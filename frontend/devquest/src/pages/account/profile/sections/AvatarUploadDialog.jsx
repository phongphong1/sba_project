import { useRef } from 'react'
import { ImagePlus, Loader2, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { octomPrimaryButtonClass, octomSecondaryButtonClass } from '@/constants/uiStyles'

function formatFileSize(size) {
  if (!size) return '0 B'

  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function AvatarUploadDialog({ fullName, upload }) {
  const fileInputRef = useRef(null)
  const {
    closeDialog,
    errorMessage,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleInputChange,
    handleSubmit,
    isDragging,
    isOpen,
    isUploading,
    previewUrl,
    selectedFile,
    uploadProgress,
  } = upload

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeDialog()
        }
      }}
    >
      <DialogContent className="max-w-xl rounded-[28px] border-0 bg-white p-0 shadow-2xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Change avatar</DialogTitle>
          <DialogDescription>
            Upload a new profile image for {fullName || 'this account'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          <button
            type="button"
            onClick={openFilePicker}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            disabled={isUploading}
            className={`flex min-h-64 w-full flex-col items-center justify-center rounded-[24px] border border-dashed px-6 py-8 text-center transition ${
              isDragging
                ? 'border-[#5051F9] bg-indigo-50'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
            }`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="h-40 w-40 rounded-[28px] object-cover shadow-sm"
              />
            ) : (
              <div className="rounded-[24px] bg-white p-4 text-slate-500 shadow-sm">
                <ImagePlus className="h-8 w-8" />
              </div>
            )}

            <p className="mt-4 text-base font-semibold text-slate-900">
              {selectedFile ? selectedFile.name : 'Drop an image here'}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {selectedFile
                ? `${formatFileSize(selectedFile.size)} selected. Click the area or choose another file below to replace it.`
                : 'Drag and drop a JPG, PNG, WEBP, or any image file here, or click to browse from your device.'}
            </p>
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-slate-50 p-4">
            <div className="text-sm text-slate-500">
              Images only. The uploaded file will be used as your new avatar.
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={openFilePicker}
              disabled={isUploading}
              className={`h-11 ${octomSecondaryButtonClass}`}
            >
              Choose image
            </Button>
          </div>

          {isUploading || uploadProgress > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                <span>Uploading</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#5051F9] transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        </div>

        <DialogFooter className="rounded-b-[28px] border-slate-200 bg-slate-50/80">
          <Button
            type="button"
            variant="secondary"
            onClick={closeDialog}
            disabled={isUploading}
            className={`h-11 ${octomSecondaryButtonClass}`}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
            className={`h-11 ${octomPrimaryButtonClass}`}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                Save avatar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
