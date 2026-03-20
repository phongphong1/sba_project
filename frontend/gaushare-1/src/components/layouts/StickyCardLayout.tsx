import type { ReactNode } from 'react'

interface StickyCardLayoutProps {
    children: ReactNode
    topOffset?: string
    maxWidth?: string
    className?: string
    contentClassName?: string
}

export default function StickyCardLayout({
    children,
    topOffset = 'top-24',
    maxWidth = 'max-w-4xl',
    className = '',
    contentClassName = '',
}: StickyCardLayoutProps) {
    return (
        <div className="relative h-full">
            {/* Fixed Card */}
            <div className={`fixed ${topOffset} left-1/2 -translate-x-1/2 w-full ${maxWidth} mx-auto px-6 border-0 pointer-events-none`}>
                <div className={`bg-card border rounded-lg shadow-lg pt-8 px-8 pb-8 flex flex-col pointer-events-auto min-h-[calc(100vh-6rem+2rem)] ${className}`}>
                    {/* Card Content - Scrollable */}
                    <div
                        className={`flex-1 overflow-y-auto space-y-4 pr-2 ${contentClassName}`}
                        style={{
                            maxHeight: 'calc(100vh - 6rem - 2rem)',
                            paddingBottom: '2rem'
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
