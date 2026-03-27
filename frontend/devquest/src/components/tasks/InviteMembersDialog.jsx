import { useState } from 'react'
import { X, Mail, Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import workspaceApi from '@/api/workspaceApi'
import {
  octomInlineInputClass,
  octomPrimaryButtonClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function InviteMembersDialog({ open, onClose, workspaceId }) {
  const [input, setInput] = useState('')
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)

  const addEmail = () => {
    const val = input.trim().toLowerCase()
    if (!val) return
    if (!EMAIL_RE.test(val)) {
      toast.error(`"${val}" is not a valid email`)
      return
    }
    if (emails.includes(val)) {
      toast.error('Email already added')
      return
    }
    setEmails((prev) => [...prev, val])
    setInput('')
  }

  const removeEmail = (email) => setEmails((prev) => prev.filter((e) => e !== email))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addEmail()
    }
    if (e.key === 'Backspace' && !input && emails.length) {
      setEmails((prev) => prev.slice(0, -1))
    }
  }

  const handleSend = async () => {
    const allEmails = [...emails]
    if (input.trim()) {
      const val = input.trim().toLowerCase()
      if (EMAIL_RE.test(val) && !allEmails.includes(val)) allEmails.push(val)
    }
    if (!allEmails.length) {
      toast.error('Add at least one email address')
      return
    }

    setLoading(true)
    try {
      await workspaceApi.inviteMembers(workspaceId, allEmails)
      toast.success(`Invitation${allEmails.length > 1 ? 's' : ''} sent!`)
      setEmails([])
      setInput('')
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to send invitations')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setEmails([])
    setInput('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg rounded-[24px] border-0 bg-white p-8 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">Invite members</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-slate-500">
            Enter one or more email addresses. Press <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">Enter</kbd> after each to add it.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5">
          {/* Email chips + input area */}
          <div className="min-h-[60px] flex flex-wrap gap-2 rounded-[16px] border border-slate-200 bg-slate-50 p-3 focus-within:border-[#5051F9] transition">
            {emails.map((email) => (
              <span
                key={email}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700"
              >
                <Mail className="h-3.5 w-3.5" />
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-indigo-200 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              type="email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addEmail}
              placeholder={emails.length === 0 ? 'colleague@company.com' : 'Add another...'}
              className="min-w-[180px] flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Press <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono">Enter</kbd> or <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono">,</kbd> to add each email
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className={octomSecondaryButtonClass}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={loading || (emails.length === 0 && !input.trim())}
            className={`${octomPrimaryButtonClass} min-w-[130px]`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Send {emails.length > 0 ? `${emails.length} invite${emails.length > 1 ? 's' : ''}` : 'invites'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
