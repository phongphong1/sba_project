import { Card as CardBase, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BaseCardProps {
    className?: string
    onClick?: () => void
}

export interface PostCardProps extends BaseCardProps {
    variant: 'post'
    avatar?: string
    authorName: string
    authorUsername: string
    title: string
    description?: string
    image?: string
    createdAt?: string
}

export interface DocumentCardProps extends BaseCardProps {
    variant: 'document'
    title: string
    description?: string
    fileType?: string
    fileSize?: string
    createdAt?: string
    icon?: React.ReactNode
}

export type CardProps = PostCardProps | DocumentCardProps

export default function Card(props: CardProps) {
    const { variant, className, onClick } = props

    if (variant === 'post') {
        const {
            avatar,
            authorName,
            authorUsername,
            title,
            description,
            image,
            createdAt,
        } = props as PostCardProps

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
                                    <p className="text-xs text-muted-foreground">{createdAt}</p>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <CardTitle className="text-lg">{title}</CardTitle>
                        {description && (
                            <CardDescription className="mt-2">{description}</CardDescription>
                        )}
                    </div>
                </CardHeader>
                {image && (
                    <CardContent>
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <img
                                src={image}
                                alt={title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </CardContent>
                )}
            </CardBase>
        )
    }

    if (variant === 'document') {
        const { title, description, fileType, fileSize, createdAt, icon } = props as DocumentCardProps

        return (
            <CardBase
                className={cn('w-full max-w-xs cursor-pointer transition-all hover:shadow-md', className)}
                onClick={onClick}
            >
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-lg bg-primary/10 p-3">
                            {icon || <FileText className="size-6 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
                            {description && (
                                <CardDescription className="mt-2 line-clamp-2">
                                    {description}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {fileType && (
                            <span className="px-2 py-1 rounded bg-muted text-xs font-medium">
                                {fileType}
                            </span>
                        )}
                        {fileSize && <span>{fileSize}</span>}
                        {createdAt && <span className="ml-auto">{createdAt}</span>}
                    </div>
                </CardContent>
            </CardBase>
        )
    }

    return null
}
