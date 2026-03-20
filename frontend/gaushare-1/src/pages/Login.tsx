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
import { Label } from '../components/ui/label'
import GoogleIcon from '../assets/google-logo.svg'
import { ArrowLeftIcon } from 'lucide-react'
import { headerText } from '../const/navigation'
import { Separator } from '../components/ui/separator'
import { useLogin } from '../hooks/useLogin'

export default function Login() {
    const navigate = useNavigate()
    const { login, isLoading, error, errors, clearErrors } = useLogin()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
        // Clear errors when user types
        if (errors[name as keyof typeof errors] || error) {
            clearErrors()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await login(formData)
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
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your account below to login
                        </CardDescription>
                        <CardAction>
                            <Button variant="link" onClick={() => navigate('/signup')}>Sign Up</Button>
                        </CardAction>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            {error && (
                                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <span className="text-sm text-destructive">{error}</span>
                                </div>
                            )}
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.username}
                                        disabled={isLoading}
                                        required
                                    />
                                    {errors.username && (
                                        <span className="text-sm text-destructive">{errors.username}</span>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.password}
                                        disabled={isLoading}
                                        required
                                    />
                                    {errors.password && (
                                        <span className="text-sm text-destructive">{errors.password}</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                            <div className="flex items-center justify-center gap-2 w-full">
                                <Separator className="flex-1" /> <span className="text-muted-foreground text-sm">or</span>
                                <Separator className="flex-1" />
                            </div>

                            <Button variant="outline" className="w-full" type="button">
                                <img src={GoogleIcon} alt="Google" className="w-4 h-4" />
                                <span>Login with Google</span>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
