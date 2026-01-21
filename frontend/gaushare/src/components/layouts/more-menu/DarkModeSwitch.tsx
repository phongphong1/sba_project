import { Switch } from '../../ui/switch'
import { Label } from '../../ui/label'
import { useTheme } from '../../../hooks/useTheme'

export default function DarkModeSwitch() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="flex items-center justify-between">
            <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
            />
            <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
    )
}
