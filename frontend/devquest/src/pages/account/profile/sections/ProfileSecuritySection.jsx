import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  octomInputClass,
  octomMutedPanelClass,
  octomPrimaryButtonClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'

export default function ProfileSecuritySection({
  passwordForm,
  passwordErrors,
  isSavingPassword,
  onFieldChange,
  onReset,
  onSubmit,
}) {
  const [visibleField, setVisibleField] = useState(null)

  const getInputClassName = (error) =>
    error
      ? `${octomInputClass} border-red-300 focus-visible:border-red-500 focus-visible:ring-red-200`
      : octomInputClass

  const toggleVisibility = (field) => {
    setVisibleField((current) => (current === field ? null : field))
  }

  const renderPasswordField = ({ field, label, autoComplete, error }) => {
    const isVisible = visibleField === field

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-500">{label}</label>
        <div className="relative">
          <Input
            type={isVisible ? 'text' : 'password'}
            value={passwordForm[field]}
            autoComplete={autoComplete}
            onChange={(event) => onFieldChange(field, event.target.value)}
            disabled={isSavingPassword}
            className={`${getInputClassName(error)} pr-12`}
          />
          <button
            type="button"
            onClick={() => toggleVisibility(field)}
            disabled={isSavingPassword}
            className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
            aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    )
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div>
        <p className="text-sm font-medium text-slate-400">Security</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Change your password
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update your password here. You can press Enter to submit once everything is filled in.
        </p>
      </div>

      <div className="grid gap-5">
        {renderPasswordField({
          field: 'currentPassword',
          label: 'Current password',
          autoComplete: 'current-password',
          error: passwordErrors.currentPassword,
        })}

        <div className="grid gap-5 md:grid-cols-2">
          {renderPasswordField({
            field: 'newPassword',
            label: 'New password',
            autoComplete: 'new-password',
            error: passwordErrors.newPassword,
          })}

          {renderPasswordField({
            field: 'confirmPassword',
            label: 'Confirm password',
            autoComplete: 'new-password',
            error: passwordErrors.confirmPassword,
          })}
        </div>
      </div>

      <Card className={`border-0 ${octomMutedPanelClass}`}>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ShieldCheck className="h-4 w-4 text-[#5051F9]" />
          Security note
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use a unique password with at least 8 characters, and avoid reusing the current password.
        </p>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          disabled={isSavingPassword}
          className={`h-12 ${octomSecondaryButtonClass}`}
        >
          Clear
        </Button>
        <Button
          type="submit"
          disabled={isSavingPassword}
          className={`h-12 ${octomPrimaryButtonClass}`}
        >
          {isSavingPassword ? 'Updating...' : 'Update password'}
        </Button>
      </div>
    </form>
  )
}
