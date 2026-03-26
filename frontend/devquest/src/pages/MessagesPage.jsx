import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Info,
  MessageSquareText,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
} from 'lucide-react'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomIconButtonClass,
  octomInlineInputClass,
  octomPrimaryButtonClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/data/mockMessages'

const conversationFilters = [
  { id: 'ALL', label: 'All' },
  { id: 'UNREAD', label: 'Unread' },
  { id: 'GROUPS', label: 'Groups' },
]

const messageTransition = {
  initial: { opacity: 0, scale: 0.8, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.94, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
}

function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-[18px] bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/70">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-2 w-2 rounded-full bg-slate-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: dot * 0.12 }}
        />
      ))}
    </div>
  )
}

export default function MessagesPage() {
  const [conversationFilter, setConversationFilter] = useState('ALL')
  const [conversationSearch, setConversationSearch] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [messagesByConversation, setMessagesByConversation] = useState(MOCK_MESSAGES)
  const [activeConversationId, setActiveConversationId] = useState(MOCK_CONVERSATIONS[0]?.id ?? null)
  const messageViewportRef = useRef(null)

  const filteredConversations = useMemo(() => {
    const normalizedQuery = conversationSearch.trim().toLowerCase()

    return conversations.filter((conversation) => {
      const matchesFilter =
        conversationFilter === 'ALL' ||
        (conversationFilter === 'UNREAD' && conversation.unreadCount > 0) ||
        (conversationFilter === 'GROUPS' && conversation.type === 'GROUP')

      const matchesSearch =
        !normalizedQuery ||
        `${conversation.title} ${conversation.lastMessage}`.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesSearch
    })
  }, [conversationFilter, conversationSearch, conversations])

  useEffect(() => {
    if (!filteredConversations.some((conversation) => conversation.id === activeConversationId)) {
      setActiveConversationId(filteredConversations[0]?.id ?? null)
    }
  }, [activeConversationId, filteredConversations])

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

  const activeMessages = useMemo(
    () => (activeConversationId ? messagesByConversation[activeConversationId] ?? [] : []),
    [activeConversationId, messagesByConversation],
  )

  const onMessageReceived = useCallback((incomingMessage) => {
    setMessagesByConversation((current) => {
      const conversationMessages = current[incomingMessage.conversationId] ?? []

      return {
        ...current,
        [incomingMessage.conversationId]: [...conversationMessages, incomingMessage],
      }
    })

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === incomingMessage.conversationId
          ? {
              ...conversation,
              lastMessage: incomingMessage.content,
              updatedAt: incomingMessage.createdAt,
              unreadCount:
                incomingMessage.conversationId === activeConversationId
                  ? conversation.unreadCount
                  : conversation.unreadCount + 1,
            }
          : conversation,
      ),
    )
  }, [activeConversationId])

  useEffect(() => {
    if (!activeConversationId) return

    const websocketConfig = {
      endpoint: '/ws',
      topic: `/topic/messages/${activeConversationId}`,
    }

    void websocketConfig
    // TODO: connect STOMP/SockJS here and route every payload into onMessageReceived(incomingMessage)

    return () => {
      // TODO: disconnect websocket subscription for this conversation
    }
  }, [activeConversationId, onMessageReceived])

  useEffect(() => {
    const viewport =
      messageViewportRef.current?.querySelector('[data-slot="scroll-area-viewport"]')

    if (!viewport) return

    viewport.scrollTop = viewport.scrollHeight
  }, [activeMessages.length, activeConversationId])

  const handleConversationSelect = (conversationId) => {
    setActiveConversationId(conversationId)
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation,
      ),
    )
  }

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim()

    if (!trimmedMessage || !activeConversationId) return

    const outgoingMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: 'user-1',
      senderName: 'Phong Nguyen',
      content: trimmedMessage,
      type: 'TEXT',
      createdAt: 'Now',
      isMine: true,
    }

    onMessageReceived(outgoingMessage)
    setMessageInput('')
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_320px] xl:items-start">
      <Card className={`overflow-hidden ${octomCardClass}`}>
        <div className="space-y-5">
          <div className="space-y-4">
            <label className="flex w-full items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200 transition focus-within:ring-[#5051F9]">
              <Search className="h-4 w-4" />
              <Input
                value={conversationSearch}
                onChange={(event) => setConversationSearch(event.target.value)}
                placeholder="Search conversations..."
                className={octomInlineInputClass}
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {conversationFilters.map((filter) => {
                const isActive = conversationFilter === filter.id

                return (
                  <Button
                    key={filter.id}
                    type="button"
                    onClick={() => setConversationFilter(filter.id)}
                    variant={isActive ? 'default' : 'outline'}
                    className={`rounded-full px-4 text-sm font-semibold ${
                      isActive
                        ? 'bg-[#5051F9] text-white shadow-lg shadow-indigo-200'
                        : 'border-slate-200 bg-white text-slate-500 shadow-none hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          <ScrollArea className="h-[680px] pr-2">
            <div className="space-y-2">
              {filteredConversations.map((conversation) => {
                const isActive = activeConversationId === conversation.id

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleConversationSelect(conversation.id)}
                    className={`flex w-full items-start gap-3 rounded-[22px] px-4 py-4 text-left transition ${
                      isActive
                        ? 'bg-indigo-50 ring-1 ring-indigo-100'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <Avatar
                      className={`${octomAvatarBaseClass} h-12 w-12 rounded-[18px]`}
                      style={{ backgroundColor: conversation.color }}
                    >
                      <AvatarFallback
                        className={octomAvatarFallbackClass}
                        style={{ backgroundColor: conversation.color }}
                      >
                        {conversation.avatar}
                      </AvatarFallback>
                      {conversation.online ? <AvatarBadge className="bg-emerald-500" /> : null}
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {conversation.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className="text-xs font-medium text-slate-400">
                            {conversation.updatedAt}
                          </span>
                          {conversation.unreadCount ? (
                            <Badge className="rounded-full bg-[#5051F9] px-2 py-0.5 text-white">
                              {conversation.unreadCount}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </Card>

      <Card className={`overflow-hidden ${octomCardClass}`}>
        {activeConversation ? (
          <div className="flex h-[760px] flex-col">
            <div className="flex items-center justify-between gap-4 pb-5">
              <div className="flex items-center gap-3">
                <Avatar
                  className={`${octomAvatarBaseClass} h-12 w-12 rounded-[18px]`}
                  style={{ backgroundColor: activeConversation.color }}
                >
                  <AvatarFallback
                    className={octomAvatarFallbackClass}
                    style={{ backgroundColor: activeConversation.color }}
                  >
                    {activeConversation.avatar}
                  </AvatarFallback>
                  {activeConversation.online ? <AvatarBadge className="bg-emerald-500" /> : null}
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{activeConversation.title}</p>
                  <p className="text-sm text-slate-500">
                    {activeConversation.online ? 'Online now' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon-lg" className={`h-11 w-11 ${octomIconButtonClass}`}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon-lg" className={`h-11 w-11 ${octomIconButtonClass}`}>
                  <Video className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon-lg" className={`h-11 w-11 ${octomIconButtonClass}`}>
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <ScrollArea ref={messageViewportRef} className="mt-5 flex-1 pr-2">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeConversation.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="space-y-4 pb-4"
                >
                  {activeMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      {...messageTransition}
                      className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <Card
                        className={`max-w-[72%] rounded-[24px] border-0 px-4 py-3 shadow-sm ${
                          message.isMine
                            ? 'bg-[#5051F9] text-white'
                            : 'bg-white text-slate-900 ring-1 ring-slate-200/70'
                        }`}
                      >
                        {!message.isMine ? (
                          <p className="mb-1 text-xs font-semibold text-slate-400">
                            {message.senderName}
                          </p>
                        ) : null}
                        <p className="text-sm leading-7">{message.content}</p>
                        <p className={`mt-2 text-right text-[11px] ${message.isMine ? 'text-white/70' : 'text-slate-400'}`}>
                          {message.createdAt}
                        </p>
                      </Card>
                    </motion.div>
                  ))}

                  {activeConversation.typingUsers.length ? (
                    <div className="flex items-center gap-3">
                      <TypingIndicator />
                      <p className="text-xs text-slate-400">
                        {activeConversation.typingUsers.join(', ')} typing...
                      </p>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>

            <Separator className="mt-4" />

            <div className="mt-5 flex items-center gap-3">
              <Button type="button" variant="outline" size="icon-lg" className={`h-12 w-12 ${octomIconButtonClass}`}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon-lg" className={`h-12 w-12 ${octomIconButtonClass}`}>
                <Smile className="h-4 w-4" />
              </Button>
              <label className="flex flex-1 items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200 transition focus-within:ring-[#5051F9]">
                <MessageSquareText className="h-4 w-4" />
                <Input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  className={octomInlineInputClass}
                />
              </label>
              <Button type="button" onClick={handleSendMessage} className={`h-12 w-12 rounded-[20px] px-0 ${octomPrimaryButtonClass}`}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className={`overflow-hidden ${octomCardClass}`}>
        {activeConversation ? (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-400">Conversation info</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{activeConversation.title}</h3>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold text-slate-900">Members</p>
              <div className="mt-4 space-y-3">
                {activeConversation.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3">
                    <Avatar
                      className={`${octomAvatarBaseClass} h-10 w-10 rounded-[16px]`}
                      style={{ backgroundColor: member.color }}
                    >
                      <AvatarFallback
                        className={octomAvatarFallbackClass}
                        style={{ backgroundColor: member.color }}
                      >
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold text-slate-900">Shared files</p>
              <div className="mt-4 space-y-3">
                {activeConversation.sharedFiles.map((file) => (
                  <div key={file.id} className="rounded-[20px] bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{file.meta}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold text-slate-900">Shared links</p>
              <div className="mt-4 space-y-3">
                {activeConversation.sharedLinks.length ? (
                  activeConversation.sharedLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      className="block rounded-[20px] bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
                    >
                      <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{link.url}</p>
                    </a>
                  ))
                ) : (
                  <div className="rounded-[20px] bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No shared links yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
