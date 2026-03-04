import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    ArrowUp,
    ArrowDown,
    MessageCircle,
    Bookmark,
    MoreHorizontal,
    Send,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

// Types
interface Question {
    id: string
    author: {
        name: string
        username: string
        avatar: string
        isVip: boolean
    }
    title: string
    content: string
    image: string | null
    createdAt: string
    stats: {
        upvotes: number
        downvotes: number
        comments: number
    }
    userVote: 'upvote' | 'downvote' | null
    isBookmarked: boolean
}

interface Comment {
    id: string
    author: {
        name: string
        username: string
        avatar: string
        isVip: boolean
    }
    content: string
    createdAt: string
    upvotes: number
    userVote: 'upvote' | 'downvote' | null
}

// Mock data
const mockQuestion: Question = {
    id: '1',
    author: {
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        isVip: true,
    },
    title: 'How to implement React Context API with TypeScript?',
    content:
        'I am trying to implement React Context API with TypeScript but I am getting type errors. Can someone explain the best practices for typing context providers and consumers? I have tried multiple approaches but none of them seem to work properly.',
    image: null,
    createdAt: '2 hours ago',
    stats: {
        upvotes: 234,
        downvotes: 12,
        comments: 45,
    },
    userVote: null,
    isBookmarked: false,
}

const mockComments: Comment[] = [
    {
        id: '1',
        author: {
            name: 'Jane Smith',
            username: 'janesmith',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            isVip: false,
        },
        content:
            'You should use a generic type for your context. Here\'s an example: `const MyContext = React.createContext<MyContextType | undefined>(undefined)`. This way TypeScript knows what type to expect.',
        createdAt: '1 hour ago',
        upvotes: 45,
        userVote: 'upvote',
    },
    {
        id: '2',
        author: {
            name: 'Mike Johnson',
            username: 'mikej',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            isVip: true,
        },
        content:
            'I recommend creating a custom hook to use the context. This makes it easier to handle the undefined case and provides better type safety.',
        createdAt: '45 minutes ago',
        upvotes: 32,
        userVote: null,
    },
    {
        id: '3',
        author: {
            name: 'Sarah Wilson',
            username: 'sarahw',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            isVip: false,
        },
        content:
            'Check out the official TypeScript documentation for React Context. They have some great examples that cover most use cases.',
        createdAt: '30 minutes ago',
        upvotes: 18,
        userVote: null,
    },
]

export default function QuestionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState<Question>(mockQuestion)
    const [comments, setComments] = useState<Comment[]>(mockComments)
    const [newComment, setNewComment] = useState('')
    const [isAnimatingIn, setIsAnimatingIn] = useState(true)

    useEffect(() => {
        // In a real app, fetch question by id from the API
        console.log('Loading question with id:', id)

        // Trigger animation on mount
        setIsAnimatingIn(true)
        const timer = setTimeout(() => setIsAnimatingIn(false), 300)
        return () => clearTimeout(timer)
    }, [id])

    const handleBack = () => {
        navigate(-1)
    }

    const handleUpvoteQuestion = () => {
        setQuestion((prev) => {
            if (prev.userVote === 'upvote') {
                return {
                    ...prev,
                    userVote: null,
                    stats: { ...prev.stats, upvotes: prev.stats.upvotes - 1 },
                }
            } else if (prev.userVote === 'downvote') {
                return {
                    ...prev,
                    userVote: 'upvote',
                    stats: {
                        ...prev.stats,
                        upvotes: prev.stats.upvotes + 1,
                        downvotes: prev.stats.downvotes - 1,
                    },
                }
            } else {
                return {
                    ...prev,
                    userVote: 'upvote',
                    stats: { ...prev.stats, upvotes: prev.stats.upvotes + 1 },
                }
            }
        })
    }

    const handleDownvoteQuestion = () => {
        setQuestion((prev) => {
            if (prev.userVote === 'downvote') {
                return {
                    ...prev,
                    userVote: null,
                    stats: { ...prev.stats, downvotes: prev.stats.downvotes - 1 },
                }
            } else if (prev.userVote === 'upvote') {
                return {
                    ...prev,
                    userVote: 'downvote',
                    stats: {
                        ...prev.stats,
                        upvotes: prev.stats.upvotes - 1,
                        downvotes: prev.stats.downvotes + 1,
                    },
                }
            } else {
                return {
                    ...prev,
                    userVote: 'downvote',
                    stats: { ...prev.stats, downvotes: prev.stats.downvotes + 1 },
                }
            }
        })
    }

    const handleBookmark = () => {
        setQuestion((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }))
    }

    const handleUpvoteComment = (commentId: string) => {
        setComments((prev) =>
            prev.map((comment) => {
                if (comment.id !== commentId) return comment
                if (comment.userVote === 'upvote') {
                    return { ...comment, userVote: null, upvotes: comment.upvotes - 1 }
                } else {
                    return { ...comment, userVote: 'upvote', upvotes: comment.upvotes + 1 }
                }
            })
        )
    }

    const handleSubmitComment = () => {
        if (!newComment.trim()) return

        const comment: Comment = {
            id: Date.now().toString(),
            author: {
                name: 'Current User',
                username: 'currentuser',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
                isVip: false,
            },
            content: newComment,
            createdAt: 'Just now',
            upvotes: 0,
            userVote: null,
        }

        setComments([comment, ...comments])
        setNewComment('')
    }

    return (
        <div className="fixed top-0 right-0 bottom-0 left-16 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm overflow-hidden">
            {/* Overlay - Click to close */}
            <div
                className="absolute inset-0 bg-black/20"
                onClick={handleBack}
            />

            {/* Content Container with slide-up animation */}
            <div
                className={`relative w-full max-w-4xl h-full flex flex-col transition-all duration-500 ease-out ${isAnimatingIn ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                    }`}
            >
                {/* Header - Fixed at top */}
                <div className="bg-background border-b shadow-sm z-10">
                    <div className="flex items-center gap-3 p-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="shrink-0"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <h2 className="font-semibold text-lg line-clamp-1">Question Details</h2>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-background">
                    <div className="max-w-4xl mx-auto p-4 space-y-6">
                        {/* Question Card - Slides up */}
                        <Card
                            className={`transition-all duration-700 delay-100 ease-out ${isAnimatingIn
                                    ? 'translate-y-8 opacity-0'
                                    : 'translate-y-0 opacity-100'
                                }`}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <Avatar className="size-12">
                                            <AvatarImage
                                                src={question.author.avatar}
                                                alt={question.author.name}
                                            />
                                            <AvatarFallback>
                                                {question.author.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">
                                                    {question.author.name}
                                                </p>
                                                {question.author.isVip && (
                                                    <Badge
                                                        variant="default"
                                                        className="bg-yellow-500 text-white text-xs"
                                                    >
                                                        VIP
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                @{question.author.username} · {question.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                        {question.content}
                                    </p>
                                </div>
                                {question.image && (
                                    <div className="rounded-lg overflow-hidden">
                                        <img
                                            src={question.image}
                                            alt="Question"
                                            className="w-full object-cover"
                                        />
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                                    <span>
                                        {question.stats.upvotes - question.stats.downvotes} points
                                    </span>
                                    <span>{question.stats.comments} answers</span>
                                </div>
                                <div className="flex items-center justify-between w-full pt-3 border-t">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleUpvoteQuestion}
                                            className={
                                                question.userVote === 'upvote'
                                                    ? 'text-green-600'
                                                    : ''
                                            }
                                        >
                                            <ArrowUp className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleDownvoteQuestion}
                                            className={
                                                question.userVote === 'downvote'
                                                    ? 'text-red-600'
                                                    : ''
                                            }
                                        >
                                            <ArrowDown className="size-4" />
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <MessageCircle className="size-4 mr-2" />
                                        Answer
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleBookmark}
                                        className={question.isBookmarked ? 'text-blue-500' : ''}
                                    >
                                        <Bookmark
                                            className={`size-4 ${question.isBookmarked ? 'fill-current' : ''}`}
                                        />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Comments Section - Slides up with delay */}
                        <div
                            className={`space-y-4 transition-all duration-700 delay-300 ease-out ${isAnimatingIn
                                    ? 'translate-y-12 opacity-0'
                                    : 'translate-y-0 opacity-100'
                                }`}
                        >
                            {/* Add Comment */}
                            <Card>
                                <CardHeader>
                                    <h3 className="font-semibold">Write an Answer</h3>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Textarea
                                        placeholder="Share your knowledge..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex justify-end">
                                        <Button size="sm" onClick={handleSubmitComment}>
                                            <Send className="size-4 mr-2" />
                                            Post Answer
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comments List */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4">
                                    {comments.length} Answers
                                </h3>
                                <div className="space-y-4">
                                    {comments.map((comment, index) => (
                                        <Card
                                            key={comment.id}
                                            className={`transition-all duration-500 ease-out ${isAnimatingIn
                                                    ? 'translate-y-8 opacity-0'
                                                    : 'translate-y-0 opacity-100'
                                                }`}
                                            style={{
                                                transitionDelay: `${400 + index * 100}ms`,
                                            }}
                                        >
                                            <CardHeader>
                                                <div className="flex items-start gap-3">
                                                    <Avatar className="size-10">
                                                        <AvatarImage
                                                            src={comment.author.avatar}
                                                            alt={comment.author.name}
                                                        />
                                                        <AvatarFallback>
                                                            {comment.author.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-sm">
                                                                {comment.author.name}
                                                            </p>
                                                            {comment.author.isVip && (
                                                                <Badge
                                                                    variant="default"
                                                                    className="bg-yellow-500 text-white text-xs"
                                                                >
                                                                    VIP
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            @{comment.author.username} ·{' '}
                                                            {comment.createdAt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                    {comment.content}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleUpvoteComment(comment.id)}
                                                        className={
                                                            comment.userVote === 'upvote'
                                                                ? 'text-green-600'
                                                                : ''
                                                        }
                                                    >
                                                        <ArrowUp className="size-4" />
                                                        <span className="text-xs ml-1">
                                                            {comment.upvotes}
                                                        </span>
                                                    </Button>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <MessageCircle className="size-4 mr-1" />
                                                    <span className="text-xs">Reply</span>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
