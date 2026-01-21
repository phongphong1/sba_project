import { Card, CardContent, CardHeader } from '../card'
import { Skeleton } from '../skeleton'

export function SkeletonCard() {
    return (
        <Card className="w-full max-w-xs">
            <CardHeader>
                <div className="flex w-fit items-center gap-4">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>
                <br />
                <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
                <Skeleton className="aspect-video w-full" />
            </CardContent>
        </Card>
    )
}
