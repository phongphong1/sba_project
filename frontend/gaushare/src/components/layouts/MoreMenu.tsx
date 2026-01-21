import { useState, useRef, useEffect } from 'react'
import { Logs } from 'lucide-react'
import { moreOptions } from '../../const/moreOptions'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'

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

    const handleButtonClick = (onClick?: () => void) => {
        onClick?.()
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
                <Logs className="w-5 h-5" />
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute bottom-full left-0 mb-2 w-56 bg-popover border rounded-lg shadow-lg p-3 z-50"
                >
                    <div className="flex flex-col gap-2">
                        {moreOptions.map((option) => {
                            // If the option is a switch, render a switch
                            if (option.type === 'switch') {
                                return (
                                    <div
                                        key={option.id}
                                        className="flex items-center justify-between"
                                    >
                                        <Switch
                                            id={option.id}
                                            defaultChecked={option.defaultChecked}
                                        />
                                        <Label htmlFor={option.id}>{option.label}</Label>
                                    </div>
                                )
                            }
                            // If the option is a button, render a button
                            else {
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleButtonClick(option.onClick)}
                                        className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                                    >
                                        {option.icon && (
                                            <option.icon className="w-4 h-4" />
                                        )}
                                        <span>{option.label}</span>
                                    </button>
                                )
                            }
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
