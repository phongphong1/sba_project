import { Calendar, CheckCircle2, MessageSquare, Paperclip, X, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import workspaceApi from '@/api/workspaceApi'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DrawerClose, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomMutedPanelClass,
  octomPillBadgeClass,
} from '@/constants/uiStyles'

export default function TaskDetailDrawerContent({ task }) {
  const taskNumericId = String(task.id).replace('tsk_', '')

  const [localChecklist, setLocalChecklist] = useState(null)
  const [addingSubtask, setAddingSubtask] = useState(false)
  const [newSubtaskText, setNewSubtaskText] = useState('')

  useEffect(() => {
    let isMounted = true
    workspaceApi.getSubtasks(taskNumericId)
      .then((res) => {
        if (isMounted) {
          setLocalChecklist((res.data || []).map((i) => ({ ...i, done: !!i.done })))
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLocalChecklist([])
        }
      })
    return () => { isMounted = false }
  }, [taskNumericId])

  const handleToggleSubtask = async (item) => {
    const updatedDone = !item.done
    setLocalChecklist(prev => prev.map(i => i.id === item.id ? { ...i, done: updatedDone } : i))
    try {
      await workspaceApi.updateSubtask(taskNumericId, item.id, { done: updatedDone })
    } catch (err) {
      setLocalChecklist(prev => prev.map(i => i.id === item.id ? { ...i, done: !updatedDone } : i))
    }
  }

  const handleAddSubtask = async () => {
    if (!newSubtaskText.trim()) {
      setAddingSubtask(false)
      return
    }
    const tempId = Date.now()
    const text = newSubtaskText.trim()
    setNewSubtaskText('')
    setAddingSubtask(false)

    setLocalChecklist((prev) => [...prev, { id: tempId, text, done: false }])
    try {
      const res = await workspaceApi.createSubtask(taskNumericId, { text })
      setLocalChecklist((prev) => prev.map((i) => (i.id === tempId ? { ...res.data, done: !!res.data.done } : i)))
    } catch (err) {
      setLocalChecklist((prev) => prev.filter((i) => i.id !== tempId))
    }
  }

  const handleDeleteSubtask = async (itemId) => {
    const backup = [...(localChecklist ?? [])]
    setLocalChecklist((prev) => prev.filter((i) => i.id !== itemId))
    try {
      await workspaceApi.deleteSubtask(taskNumericId, itemId)
    } catch (err) {
      setLocalChecklist(backup)
    }
  }

  const checklist = localChecklist ?? []
  const completedChecklistItems = checklist.filter((item) => item.done).length
  const checklistProgress = checklist.length
    ? Math.round((completedChecklistItems / checklist.length) * 100)
    : 0

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <DrawerHeader className="sr-only">
        <DrawerTitle>{task.title}</DrawerTitle>
        <DrawerDescription>{task.description}</DrawerDescription>
      </DrawerHeader>

      <Card className={`${octomCardClass} bg-gradient-to-br from-white to-indigo-50/50`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-400">Task detail</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {task.title}
            </h2>
          </div>

          <DrawerClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              className="h-10 w-10 rounded-[18px] bg-slate-100 text-slate-500 shadow-none hover:bg-slate-200 hover:text-slate-800"
              aria-label="Close task detail"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <Badge className={`${octomPillBadgeClass} bg-indigo-100 font-semibold text-indigo-700`}>
            {task.priority}
          </Badge>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#5051F9]" />
            {task.dueDate}
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className={`${octomMutedPanelClass} bg-white/70`}>
            <p className="text-sm leading-7 text-slate-600">{task.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className={`${octomMutedPanelClass} bg-white/70`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Checklist progress
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{checklistProgress}%</p>
              <p className="mt-1 text-sm text-slate-500">
                {completedChecklistItems}/{checklist.length} items done
              </p>
            </div>
            <div className={`${octomMutedPanelClass} bg-white/70`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Comments
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{task.comments.length}</p>
              <p className="mt-1 text-sm text-slate-500">Conversation updates</p>
            </div>
            <div className={`${octomMutedPanelClass} bg-white/70`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Files
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{task.attachments.length}</p>
              <p className="mt-1 text-sm text-slate-500">Attached references</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_320px]">
        <div className="space-y-6">
          <Card className={octomCardClass}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#5051F9]" />
                <p className="text-sm font-medium text-slate-400">Checklist</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full"
                onClick={() => setAddingSubtask(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">Completion</span>
                <span className="font-semibold text-slate-700">{checklistProgress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6C6DFB] to-[#5051F9]"
                  style={{ width: `${checklistProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {localChecklist === null ? (
                <p className="text-sm text-slate-400 italic">Loading...</p>
              ) : checklist.map((item) => (
                <div key={item.id} className="group relative">
                  <label
                    className={`flex items-center gap-3 rounded-[18px] ${octomMutedPanelClass} cursor-pointer`}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleSubtask(item)}
                      className="h-4 w-4 rounded border-slate-300 text-[#5051F9] focus:ring-[#5051F9] cursor-pointer"
                    />
                    <span
                      className={`text-sm flex-1 ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                    >
                      {item.text}
                    </span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSubtask(item.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}

              {addingSubtask && (
                <div className={`flex items-center gap-3 rounded-[18px] ${octomMutedPanelClass}`}>
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 rounded border-slate-300 bg-slate-100"
                  />
                  <input
                    autoFocus
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubtask()
                      if (e.key === 'Escape') {
                        setAddingSubtask(false)
                        setNewSubtaskText('')
                      }
                    }}
                    onBlur={handleAddSubtask}
                    className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none placeholder:text-slate-400"
                    placeholder="Type subtask and press enter..."
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className={octomCardClass}>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#5051F9]" />
              <p className="text-sm font-medium text-slate-400">Comments</p>
            </div>

            <div className="mt-4 space-y-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className={`flex gap-3 ${octomMutedPanelClass}`}>
                  <Avatar
                    className={`${octomAvatarBaseClass} h-11 w-11 shrink-0 rounded-[18px]`}
                    style={{ backgroundColor: comment.color }}
                    title={comment.author}
                  >
                    <AvatarFallback
                      className={octomAvatarFallbackClass}
                      style={{ backgroundColor: comment.color }}
                    >
                      {comment.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
                      <p className="text-xs font-medium text-slate-400">{comment.time}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-0 xl:self-start">
          <Card className={octomCardClass}>
            <p className="text-sm font-medium text-slate-400">Overview</p>

            <div className={`mt-4 flex items-center gap-3 ${octomMutedPanelClass}`}>
              <Avatar
                className={`${octomAvatarBaseClass} h-12 w-12 rounded-[20px]`}
                style={{ backgroundColor: task.assignee.color }}
                title={task.assignee.name}
              >
                <AvatarFallback
                  className={octomAvatarFallbackClass}
                  style={{ backgroundColor: task.assignee.color }}
                >
                  {task.assignee.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-slate-900">{task.assignee.name}</p>
                <p className="text-sm text-slate-400">Assignee</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
                <span className="text-sm text-slate-400">Priority</span>
                <Badge className={`${octomPillBadgeClass} bg-indigo-100 font-semibold text-indigo-700`}>
                  {task.priority}
                </Badge>
              </div>
              <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
                <span className="text-sm text-slate-400">Due date</span>
                <span className="text-sm font-semibold text-slate-700">{task.dueDate}</span>
              </div>
              <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
                <span className="text-sm text-slate-400">Comments</span>
                <span className="text-sm font-semibold text-slate-700">{task.comments.length}</span>
              </div>
              <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
                <span className="text-sm text-slate-400">Attachments</span>
                <span className="text-sm font-semibold text-slate-700">{task.attachments.length}</span>
              </div>
            </div>
          </Card>

          <Card className={octomCardClass}>
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-[#5051F9]" />
              <p className="text-sm font-medium text-slate-400">Attachments</p>
            </div>

            <div className="mt-4 space-y-3">
              {task.attachments.map((attachment) => (
                <div key={attachment.id} className={octomMutedPanelClass}>
                  <p className="text-sm font-semibold text-slate-900">{attachment.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{attachment.meta}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
