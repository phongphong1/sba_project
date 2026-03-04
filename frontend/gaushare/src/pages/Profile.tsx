import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import QuestionCard from '@/components/common/QuestionCard'
import DocumentCard from '@/components/common/DocumentCard'
import StickyCardLayout from '@/components/layouts/StickyCardLayout'

// Mock data
const mockUser = {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    bio: 'Third-year Computer Science student. Love learning and sharing documents.',
    isVip: true,
    stats: {
        followers: 1234,
        following: 567,
        questions: 89,
        documents: 156,
    },
    joinedAt: 'January 2024',
}

const mockQuestions = [
    {
        id: '1',
        authorName: 'John Doe',
        authorUsername: 'johndoe',
        title: 'Sharing Data Structures and Algorithms Resources',
        content: 'I just compiled a comprehensive set of materials on Data Structures & Algorithms, including lecture slides and practical exercises. Feel free to check it out and share if you find it useful!',
        questionUrl: '/questions/1',
        createdAt: '2 hours ago',
    },
    {
        id: '2',
        authorName: 'John Doe',
        authorUsername: 'johndoe',
        title: 'Guide to Setting Up Python Development Environment',
        content: 'Today I want to share a detailed guide on how to install Python and essential tools for beginners. Very simple and easy to understand.',
        questionUrl: '/questions/2',
        createdAt: '1 day ago',
    },
    {
        id: '3',
        authorName: 'John Doe',
        authorUsername: 'johndoe',
        title: 'Review of Machine Learning Course on Coursera',
        content: 'After 3 months of studying Andrew Ng\'s Machine Learning course, I want to share my experience and the knowledge I gained. This is a course that\'s definitely worth investing your time in.',
        questionUrl: '/questions/3',
        createdAt: '3 days ago',
    },
]

const mockDocuments = [
    {
        id: '1',
        title: 'Data Structures and Algorithms Textbook.pdf',
        slug: 'data-structures-algorithms-textbook',
        viewCount: 2345,
        downloadCount: 890,
        isVip: false,
        fileType: 'PDF',
        fileSize: '5.2 MB',
        createdAt: '1 week ago',
    },
    {
        id: '2',
        title: 'Advanced Python Programming Exercises.docx',
        slug: 'advanced-python-exercises',
        viewCount: 1567,
        downloadCount: 645,
        isVip: true,
        fileType: 'DOCX',
        fileSize: '1.8 MB',
        createdAt: '2 weeks ago',
    },
    {
        id: '3',
        title: 'Machine Learning Lecture Slides.pptx',
        slug: 'machine-learning-slides',
        viewCount: 3421,
        downloadCount: 1234,
        isVip: true,
        fileType: 'PPTX',
        fileSize: '12.5 MB',
        createdAt: '3 weeks ago',
    },
    {
        id: '4',
        title: 'Database Management Exam 2023.pdf',
        slug: 'database-exam-2023',
        viewCount: 5678,
        downloadCount: 2345,
        isVip: false,
        fileType: 'PDF',
        fileSize: '856 KB',
        createdAt: '1 month ago',
    },
]

type TabType = 'questions' | 'documents'

export default function Profile() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabType>('questions')

    return (
        <StickyCardLayout>
            {/* Profile Header */}
            <div className="space-y-6">
                {/* Cover Image Placeholder */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg" />

                {/* Profile Info */}
                <div className="flex flex-col sm:flex-row gap-4 -mt-16 sm:-mt-12 px-4">
                    <Avatar className="size-24 sm:size-32 border-4 border-background">
                        <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                        <AvatarFallback className="text-2xl font-bold">
                            {mockUser.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2 sm:pt-12">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                            {mockUser.isVip && (
                                <Badge variant="default" className="bg-yellow-500 text-white">
                                    VIP
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground">@{mockUser.username}</p>
                        <p className="text-sm">{mockUser.bio}</p>
                        <p className="text-sm text-muted-foreground">
                            Joined {mockUser.joinedAt}
                        </p>
                    </div>

                    <div className="flex gap-2 sm:pt-12">
                        <Button variant="outline" size="sm">
                            Edit Profile
                        </Button>
                        <Button size="sm">Share</Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 px-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{mockUser.stats.questions}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{mockUser.stats.documents}</div>
                        <div className="text-sm text-muted-foreground">Documents</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <div className="flex gap-4 px-4">
                        <button
                            onClick={() => setActiveTab('questions')}
                            className={`pb-3 px-1 font-medium transition-colors border-b-2 ${activeTab === 'questions'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Questions
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`pb-3 px-1 font-medium transition-colors border-b-2 ${activeTab === 'documents'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Documents
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4">
                    {activeTab === 'questions' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockQuestions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    authorName={question.authorName}
                                    authorUsername={question.authorUsername}
                                    title={question.title}
                                    content={question.content}
                                    questionUrl={question.questionUrl}
                                    createdAt={question.createdAt}
                                    onClick={() => navigate(question.questionUrl)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockDocuments.map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    title={doc.title}
                                    slug={doc.slug}
                                    viewCount={doc.viewCount}
                                    downloadCount={doc.downloadCount}
                                    isVip={doc.isVip}
                                    fileType={doc.fileType}
                                    fileSize={doc.fileSize}
                                    createdAt={doc.createdAt}
                                    onClick={() => console.log('Document clicked:', doc.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StickyCardLayout>
    )
}
