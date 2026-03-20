import { useState, useRef, useEffect } from 'react'
import { EllipsisVertical } from 'lucide-react'
import DarkModeSwitch from './more-menu/DarkModeSwitch'
import MoreMenuButtons from './more-menu/MoreMenuButtons'

export default function MoreMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleButtonClick = () => {
        setIsOpen(false)
    }

    return (
        <div className="p-2 relative">
            <button
                ref={buttonRef}
                title="More"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full aspect-square rounded-md transition-colors flex items-center justify-center ${isOpen ? 'bg-muted' : 'hover:bg-muted'
                    }`}
            >
                <EllipsisVertical className="w-5 h-5" />
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute left-full bottom-3 ml-2 w-56 bg-popover border rounded-lg shadow-lg p-3 z-50"
                >
                    <div className="flex flex-col gap-2">
                        <DarkModeSwitch />
                        <MoreMenuButtons onButtonClick={handleButtonClick} />
                    </div>
                </div>
            )}
        </div>
    )
}
