import { Card as CardBase, CardContent, CardHeader, CardDescription } from '../ui/card'
import { cn } from '@/lib/utils'

export interface PostCardProps {
    className?: string
    onClick?: () => void
    avatar?: string
    authorName: string
    authorUsername: string
    title: string
    content: string
    createdAt?: string
    postId?: string | number
    postUrl?: string
}

export default function PostCard({
    avatar,
    authorName,
    authorUsername: _authorUsername,
    title,
    content,
    createdAt,
    className,
    onClick,
}: PostCardProps) {
    return (
        <CardBase
            className={cn('w-full max-w-xs cursor-pointer transition-all hover:shadow-md', className)}
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex w-fit items-center gap-4">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={authorName}
                            className="size-10 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div className="size-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-semibold">
                                {authorName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className="grid gap-1">
                        <p className="text-sm font-semibold">{authorName}</p>
                        <p className="text-xs text-muted-foreground">
                            {createdAt && (
                                <span className="text-xs text-muted-foreground">{createdAt}</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="mt-1">
                    {title && (
                        <CardDescription className="mt-2">{title}</CardDescription>
                    )}
                </div>
            </CardHeader>
            {content && (
                <CardContent>
                    <div className="relative">
                        <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
                            {content}
                        </p>
                    </div>
                </CardContent>
            )}
        </CardBase>
    )
}
