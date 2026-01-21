import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
    children?: React.ReactNode
}

export default function FloatingActionButton({ children }: FloatingActionButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Popup Content */}
            <div
                className={cn(
                    'absolute bottom-full right-0 mb-4 w-80 bg-popover border rounded-lg shadow-lg p-4 transition-all duration-300 ease-out',
                    isOpen
                        ? 'opacity-100 translate-y-0 translate-x-0 scale-100'
                        : 'opacity-0 translate-y-4 -translate-x-4 scale-95 pointer-events-none'
                )}
            >
                {children || (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Quick Actions</h3>
                        <p className="text-sm text-muted-foreground">
                            Fun fact: Believe it or not, until 1995, you didn't have to pay a dime to register a domain name. Now, people pay millions for "premium" ones. For example, Cars.com was valued at roughly $872 million. Talk about a missed investment!
                        </p>
                    </div>
                )}
            </div>

            {/* FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center',
                    isOpen && 'rotate-45'
                )}
                aria-label={isOpen ? 'Close' : 'Open'}
            >
                {isOpen ? (
                    <X className="w-6 h-6" strokeWidth={2.5} />
                ) : (
                    <Plus className="w-6 h-6" strokeWidth={2.5} />
                )}
            </button>
        </div>
    )
}
