import { Card as CardBase, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { FileText, FileType, Eye, Download, Dot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../ui/hover-card'
import { Button } from '../ui/button'

export interface DocumentCardProps {
    className?: string
    onClick?: () => void
    title: string
    slug: string
    viewCount?: number
    downloadCount?: number
    isVip?: boolean
    fileType?: string
    fileSize?: string
    createdAt?: string
    icon?: React.ReactNode
}

export default function DocumentCard({
    title,
    slug,
    viewCount,
    downloadCount,
    isVip,
    fileType,
    fileSize,
    createdAt,
    icon,
    className,
    onClick,
}: DocumentCardProps) {
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
                        <CardDescription className="mt-2 line-clamp-2">
                            <div className="flex items-center gap-2">
                                {fileType && (
                                    <>
                                        <span className="text-sm text-muted-foreground">{fileType}</span>
                                    </>
                                )}
                                {fileSize && <>
                                    <Dot className="size-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{fileSize}</span>
                                </>}
                                {createdAt && <>
                                    <Dot className="size-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{`${createdAt}`}</span>
                                </>}
                            </div>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Eye data-icon="inline-start" />
                        {viewCount}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Download data-icon="inline-start" />
                        {downloadCount}
                    </Badge>
                    <div className="ml-auto">
                        <HoverCard key="top" openDelay={100} closeDelay={100}>
                            <HoverCardTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent side="top">
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-medium">Hover Card</h4>
                                    <p>Profile placeholder</p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            </CardContent>
        </CardBase>
    );
}
