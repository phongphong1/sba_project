import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card'
import { Field, FieldLabel } from '../components/ui/field'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '../components/ui/input-otp'
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react'
import { headerText } from '../const/navigation'
import { useOtp } from '../hooks/useOtp'

export default function Verify() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = (location.state as { email?: string })?.email || 'gau@example.com'

    const {
        otp,
        handleOtpChange,
        verifyOtp,
        resendOtp,
        isVerifying,
        isResending,
        error,
        resendMessage,
    } = useOtp(email)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await verifyOtp()
    }

    const handleResend = async () => {
        await resendOtp()
    }

    return (
        <div className="flex min-h-screen flex-col px-4">
            <div className="absolute top-4 left-4">
                <Button variant="outline" size="icon" aria-label="Go Back" onClick={() => navigate('/login')}>
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
                        <CardTitle>Verify your email</CardTitle>
                        <CardDescription>
                            Enter the verification code we sent to your email address:{' '}
                            <span className="font-medium">{email}</span>.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="otp-verification">
                                        Verification code
                                    </FieldLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResend}
                                        disabled={isResending}
                                    >
                                        <RefreshCwIcon className="h-3 w-3" />
                                        {isResending ? 'Resending...' : 'Resend Code'}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        id="otp-verification"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        required
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                {error && (
                                    <span className="text-sm text-destructive">{error}</span>
                                )}
                                {resendMessage && (
                                    <span className="text-sm text-green-600 dark:text-green-400">{resendMessage}</span>
                                )}
                            </Field>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full" disabled={isVerifying}>
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
