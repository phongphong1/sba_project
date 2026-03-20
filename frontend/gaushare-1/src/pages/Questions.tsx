import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowUp,
    ArrowDown,
    MessageCircle,
    Bookmark,
    MoreHorizontal,
    Search,
    Plus,
    Image as ImageIcon,
    Send,
    X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import StickyCardLayout from '@/components/layouts/StickyCardLayout'

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
    createdAtTimestamp?: number
    stats: {
        upvotes: number
        downvotes: number
        comments: number
    }
    userVote: 'upvote' | 'downvote' | null
    isBookmarked: boolean
}

type SortType = 'latest' | 'popular' | 'oldest'

// Mock initial data
const initialMockQuestions: Question[] = [
    {
        id: '1',
        author: {
            name: 'John Doe',
            username: 'johndoe',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            isVip: true,
        },
        title: 'Sharing Data Structures and Algorithms Resources',
        content:
            'I just compiled a comprehensive set of materials on Data Structures & Algorithms, including lecture slides and practical exercises. Feel free to check it out and share if you find it useful!',
        image: null,
        createdAt: '2 hours ago',
        createdAtTimestamp: Date.now() - 2 * 60 * 60 * 1000,
        stats: {
            upvotes: 234,
            downvotes: 12,
            comments: 45,
        },
        userVote: null,
        isBookmarked: false,
    },
    {
        id: '2',
        author: {
            name: 'Jane Smith',
            username: 'janesmith',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            isVip: false,
        },
        title: 'Web Development Tips for Beginners',
        content:
            'Here are my top 5 tips for anyone starting their web development journey. These helped me a lot when I was getting started!',
        image: null,
        createdAt: '5 hours ago',
        createdAtTimestamp: Date.now() - 5 * 60 * 60 * 1000,
        stats: {
            upvotes: 567,
            downvotes: 23,
            comments: 89,
        },
        userVote: 'upvote',
        isBookmarked: true,
    },
    {
        id: '3',
        author: {
            name: 'Mike Johnson',
            username: 'mikej',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            isVip: true,
        },
        title: 'New Course: Advanced React Patterns',
        content:
            'Just launched my new course covering advanced React patterns! Learn about render props, compound components, and more. Limited time discount available.',
        image: null,
        createdAt: '1 day ago',
        createdAtTimestamp: Date.now() - 24 * 60 * 60 * 1000,
        stats: {
            upvotes: 1234,
            downvotes: 45,
            comments: 156,
        },
        userVote: null,
        isBookmarked: false,
    },
    {
        id: '4',
        author: {
            name: 'Sarah Wilson',
            username: 'sarahw',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            isVip: false,
        },
        title: 'My Journey Learning Python',
        content:
            'After 6 months of learning Python, I want to share my experience and resources that helped me. This is for anyone considering starting their Python journey!',
        image: null,
        createdAt: '2 days ago',
        createdAtTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        stats: {
            upvotes: 892,
            downvotes: 67,
            comments: 123,
        },
        userVote: 'downvote',
        isBookmarked: false,
    },
]

export default function Questions() {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState<Question[]>(initialMockQuestions)
    const [showCreateQuestion, setShowCreateQuestion] = useState(false)
    const [sort, setSort] = useState<SortType>('latest')
    const [searchQuery, setSearchQuery] = useState('')
    const [questionContent, setQuestionContent] = useState('')
    const [questionTitle, setQuestionTitle] = useState('')

    // Filter and sort questions
    const filteredAndSortedQuestions = useMemo(() => {
        // Filter by search query
        let filtered = questions.filter((question) => {
            const searchLower = searchQuery.toLowerCase()
            return (
                question.title.toLowerCase().includes(searchLower) ||
                question.content.toLowerCase().includes(searchLower) ||
                question.author.name.toLowerCase().includes(searchLower) ||
                question.author.username.toLowerCase().includes(searchLower)
            )
        })

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            switch (sort) {
                case 'latest':
                    return (b.createdAtTimestamp || 0) - (a.createdAtTimestamp || 0)
                case 'oldest':
                    return (a.createdAtTimestamp || 0) - (b.createdAtTimestamp || 0)
                case 'popular':
                    const aScore = a.stats.upvotes - a.stats.downvotes
                    const bScore = b.stats.upvotes - b.stats.downvotes
                    return bScore - aScore
                default:
                    return 0
            }
        })

        return sorted
    }, [questions, searchQuery, sort])

    const handleCreateQuestion = () => {
        if (!questionTitle.trim() || !questionContent.trim()) {
            alert('Please fill in both title and content')
            return
        }

        const newQuestion: Question = {
            id: Date.now().toString(),
            author: {
                name: 'Current User',
                username: 'currentuser',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
                isVip: false,
            },
            title: questionTitle,
            content: questionContent,
            image: null,
            createdAt: 'Just now',
            createdAtTimestamp: Date.now(),
            stats: {
                upvotes: 0,
                downvotes: 0,
                comments: 0,
            },
            userVote: null,
            isBookmarked: false,
        }

        setQuestions([newQuestion, ...questions])
        setQuestionTitle('')
        setQuestionContent('')
        setShowCreateQuestion(false)
    }

    const handleUpvote = (questionId: string) => {
        setQuestions(
            questions.map((question) => {
                if (question.id !== questionId) return question

                if (question.userVote === 'upvote') {
                    // Remove upvote
                    return {
                        ...question,
                        userVote: null,
                        stats: {
                            ...question.stats,
                            upvotes: question.stats.upvotes - 1,
                        },
                    }
                } else if (question.userVote === 'downvote') {
                    // Switch from downvote to upvote
                    return {
                        ...question,
                        userVote: 'upvote',
                        stats: {
                            ...question.stats,
                            upvotes: question.stats.upvotes + 1,
                            downvotes: question.stats.downvotes - 1,
                        },
                    }
                } else {
                    // Add upvote
                    return {
                        ...question,
                        userVote: 'upvote',
                        stats: {
                            ...question.stats,
                            upvotes: question.stats.upvotes + 1,
                        },
                    }
                }
            })
        )
    }

    const handleDownvote = (questionId: string) => {
        setQuestions(
            questions.map((question) => {
                if (question.id !== questionId) return question

                if (question.userVote === 'downvote') {
                    // Remove downvote
                    return {
                        ...question,
                        userVote: null,
                        stats: {
                            ...question.stats,
                            downvotes: question.stats.downvotes - 1,
                        },
                    }
                } else if (question.userVote === 'upvote') {
                    // Switch from upvote to downvote
                    return {
                        ...question,
                        userVote: 'downvote',
                        stats: {
                            ...question.stats,
                            upvotes: question.stats.upvotes - 1,
                            downvotes: question.stats.downvotes + 1,
                        },
                    }
                } else {
                    // Add downvote
                    return {
                        ...question,
                        userVote: 'downvote',
                        stats: {
                            ...question.stats,
                            downvotes: question.stats.downvotes + 1,
                        },
                    }
                }
            })
        )
    }

    const handleComment = (questionId: string) => {
        console.log('Comment on question:', questionId)
        // This would open a comment modal/section in a real app
    }

    const handleBookmark = (questionId: string) => {
        setQuestions(
            questions.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        isBookmarked: !question.isBookmarked,
                    }
                    : question
            )
        )
    }

    return (
        <StickyCardLayout>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Questions</h1>
                    <Button size="sm" onClick={() => setShowCreateQuestion(!showCreateQuestion)}>
                        <Plus className="size-4 mr-2" />
                        Ask Question
                    </Button>
                </div>

                {/* Create Question Section */}
                {showCreateQuestion && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">Ask a New Question</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCreateQuestion(false)}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Input
                                    placeholder="Question title..."
                                    value={questionTitle}
                                    onChange={(e) => setQuestionTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <Textarea
                                    placeholder="What's your question?"
                                    value={questionContent}
                                    onChange={(e) => setQuestionContent(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button variant="outline" size="sm">
                                    <ImageIcon className="size-4 mr-2" />
                                    Add Image
                                </Button>
                                <Button size="sm" onClick={handleCreateQuestion}>
                                    <Send className="size-4 mr-2" />
                                    Publish
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Search and Sort */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortType)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="latest">Latest</option>
                        <option value="popular">Popular</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    {filteredAndSortedQuestions.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'No questions found matching your search.'
                                        : 'No questions available.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredAndSortedQuestions.map((question) => (
                            <Card
                                key={question.id}
                                className="cursor-pointer transition-all hover:shadow-md"
                                onClick={() => navigate(`/questions/${question.id}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-10">
                                                <AvatarImage
                                                    src={question.author.avatar}
                                                    alt={question.author.name}
                                                />
                                                <AvatarFallback>
                                                    {question.author.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">{question.author.name}</p>
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
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                                        <p className="text-sm text-foreground">{question.content}</p>
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
                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                                        <span>{question.stats.upvotes - question.stats.downvotes} points</span>
                                        <span>{question.stats.comments} answers</span>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex items-center justify-between w-full pt-3 border-t">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleUpvote(question.id)
                                                }}
                                                className={question.userVote === 'upvote' ? 'text-green-600' : ''}
                                            >
                                                <ArrowUp className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDownvote(question.id)
                                                }}
                                                className={question.userVote === 'downvote' ? 'text-red-600' : ''}
                                            >
                                                <ArrowDown className="size-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleComment(question.id)
                                            }}
                                        >
                                            <MessageCircle className="size-4 mr-2" />
                                            Answer
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleBookmark(question.id)
                                            }}
                                            className={question.isBookmarked ? 'text-blue-500' : ''}
                                        >
                                            <Bookmark
                                                className={`size-4 ${question.isBookmarked ? 'fill-current' : ''}`}
                                            />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {/* Load More */}
                {filteredAndSortedQuestions.length > 0 && (
                    <div className="flex justify-center pt-4">
                        <Button variant="outline" onClick={() => alert('Load more functionality would fetch more questions from the server')}>
                            Load More Questions
                        </Button>
                    </div>
                )}
            </div>

            {/* Floating Action Button - Mobile */}
            <div className="sm:hidden fixed bottom-6 right-6 z-50">
                <Button
                    size="lg"
                    className="rounded-full w-14 h-14 p-0 shadow-lg"
                    onClick={() => setShowCreateQuestion(!showCreateQuestion)}
                >
                    <Plus className="size-6" />
                </Button>
            </div>
        </StickyCardLayout>
    )
}
