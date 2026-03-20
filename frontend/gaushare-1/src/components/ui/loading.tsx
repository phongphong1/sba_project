import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    text?: string
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
    const sizeClasses = {
        sm: 'size-4',
        md: 'size-6',
        lg: 'size-8',
    }

    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            <Spinner className={cn('text-primary', sizeClasses[size])} />
            {text && <span className="text-sm text-muted-foreground">{text}</span>}
        </div>
    )
}

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'size-4',
        md: 'size-6',
        lg: 'size-8',
    }

    return (
        <Spinner
            className={cn(
                'text-primary',
                sizeClasses[size],
                className
            )}
        />
    )
}

interface LoadingOverlayProps {
    text?: string
    className?: string
}

export function LoadingOverlay({ text, className }: LoadingOverlayProps) {
    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
                className
            )}
        >
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                {text && <p className="text-sm text-muted-foreground">{text}</p>}
            </div>
        </div>
    )
}

interface LoadingPageProps {
    text?: string
}

export function LoadingPage({ text = 'Loading...' }: LoadingPageProps) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-muted-foreground">{text}</p>
            </div>
        </div>
    )
}
