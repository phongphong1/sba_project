import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card'
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '../components/ui/field'
import GoogleIcon from '../assets/google-logo.svg'
import { ArrowLeftIcon, CalendarIcon } from 'lucide-react'
import { headerText } from '../const/navigation'
import { Separator } from '../components/ui/separator'
import { Calendar } from '../components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../components/ui/popover'
import { useRegister } from '../hooks/useRegister'

export default function SignUp() {
    const navigate = useNavigate()
    const { register, isLoading, error, errors, clearErrors } = useRegister()
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        dob: '',
        password: '',
        confirmPassword: '',
    })
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

    const formatDate = (date: Date | undefined): string => {
        if (!date) return ''
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date) {
            setFormData(prev => ({
                ...prev,
                dob: formatDate(date),
            }))
            setDatePickerOpen(false)
            if (errors.dob) {
                clearErrors()
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Format date of birth input (only numbers, format DD/MM/YYYY)
        if (name === 'dob') {
            // Remove all non-numeric characters
            const numbersOnly = value.replace(/\D/g, '')
            let formatted = numbersOnly

            // Add slashes for formatting DD/MM/YYYY
            if (numbersOnly.length > 2) {
                formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2)
            }
            if (numbersOnly.length > 4) {
                formatted = numbersOnly.slice(0, 2) + '/' + numbersOnly.slice(2, 4) + '/' + numbersOnly.slice(4, 8)
            }

            setFormData(prev => ({
                ...prev,
                [name]: formatted,
            }))

            // Try to parse the date
            if (formatted.length === 10) {
                const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
                const match = formatted.match(dateRegex)
                if (match) {
                    const [, day, month, year] = match
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                    if (!isNaN(date.getTime())) {
                        setSelectedDate(date)
                    }
                }
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }))
        }

        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            clearErrors()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await register(formData)
    }

    return (
        <div className="flex min-h-screen flex-col px-4">
            <div className="absolute top-4 left-4">
                <Button variant="outline" size="icon" aria-label="Go Back" onClick={() => navigate('/')}>
                    <ArrowLeftIcon className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-8">
                {/* Header Text */}
                <div className="w-full text-center pb-2">
                    <h1 className={headerText.className} style={{ fontFamily: 'Macondo', fontStyle: 'italic' }}>
                        {headerText.text}
                    </h1>
                </div>
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Create your account</CardTitle>
                        <CardDescription>
                            Enter your information below to create an account
                        </CardDescription>
                        <CardAction>
                            <Button variant="link" onClick={() => navigate('/login')}>Login</Button>
                        </CardAction>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
                                    <Input
                                        id="fullname"
                                        name="fullname"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.fullname}
                                        required
                                    />
                                    {errors.fullname && (
                                        <span className="text-sm text-destructive">{errors.fullname}</span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="gau@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.email}
                                        required
                                    />
                                    {errors.email && (
                                        <span className="text-sm text-destructive">{errors.email}</span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="username">Username</FieldLabel>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.username}
                                        required
                                    />
                                    {errors.username && (
                                        <span className="text-sm text-destructive">{errors.username}</span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            id="dob"
                                            name="dob"
                                            type="text"
                                            placeholder="DD/MM/YYYY"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'ArrowDown') {
                                                    e.preventDefault()
                                                    setDatePickerOpen(true)
                                                }
                                            }}
                                            aria-invalid={!!errors.dob}
                                            maxLength={10}
                                            required
                                            className="flex-1"
                                        />
                                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    aria-label="Select date"
                                                >
                                                    <CalendarIcon className="h-4 w-4" />
                                                    <span className="sr-only">Select date</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    captionLayout="dropdown"
                                                    selected={selectedDate}
                                                    onSelect={handleDateSelect}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {errors.dob && (
                                        <span className="text-sm text-destructive">{errors.dob}</span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.password}
                                        required
                                    />
                                    {errors.password && (
                                        <span className="text-sm text-destructive">{errors.password}</span>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.confirmPassword}
                                        required
                                    />
                                    {errors.confirmPassword && (
                                        <span className="text-sm text-destructive">{errors.confirmPassword}</span>
                                    )}
                                </Field>
                            </FieldGroup>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 mt-4">
                            {error && (
                                <div className="w-full p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </Button>
                            <div className="flex items-center justify-center gap-2 w-full">
                                <Separator className="flex-1" /> <span className="text-muted-foreground text-sm">or</span>
                                <Separator className="flex-1" />
                            </div>
                            <Button variant="outline" className="w-full" type="button">
                                <img src={GoogleIcon} alt="Google" className="w-4 h-4" />
                                <span>Sign up with Google</span>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
