import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Custom OTP Input component using shadcn/ui
const OTPInput = ({ value, onChange, length, disabled, className }: {
    value: string;
    onChange: (value: string) => void;
    length: number;
    disabled?: boolean;
    className?: string;
}) => {
    const handleChange = (index: number, newValue: string) => {
        if (newValue.length > 1) return; // Only allow single digit
        if (!/^\d*$/.test(newValue)) return; // Only allow digits
        
        const newCode = value.split('');
        newCode[index] = newValue;
        onChange(newCode.join(''));
        
        // Auto-focus next input
        if (newValue && index < length - 1) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <div className={`flex gap-2 ${className || ''}`}>
            {Array.from({ length }, (_, index) => (
                <Input
                    key={index}
                    id={`otp-${index}`}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    maxLength={1}
                    className="w-12 text-center"
                />
            ))}
        </div>
    );
};

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery Code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'login using an authentication code',
            };
        }

        return {
            title: 'Authentication Code',
            description:
                'Enter the authentication code provided by your authenticator application.',
            toggleText: 'login using a recovery code',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <AuthLayout
            title={authConfigContent.title}
            description={authConfigContent.description}
        >
            <Head title="Two-Factor Authentication" />

            <div className="flex flex-col gap-4">
                <Form
                    {...store.form()}
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <div className="space-y-4">
                            {showRecoveryInput ? (
                                <div className="space-y-2">
                                    <Label htmlFor="recovery_code">Recovery Code</Label>
                                    <Input
                                        id="recovery_code"
                                        name="recovery_code"
                                        type="text"
                                        placeholder="Enter recovery code"
                                        autoFocus={showRecoveryInput}
                                        required
                                    />
                                    {errors.recovery_code && (
                                        <p className="text-sm text-destructive">{errors.recovery_code}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <input type="hidden" name="code" value={code} />
                                    <OTPInput
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        length={OTP_MAX_LENGTH}
                                        disabled={processing}
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-destructive text-center">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                Continue
                            </Button>

                            <p className="text-sm text-muted-foreground text-center">
                                or you can{' '}
                                <Button
                                    variant="link"
                                    onClick={() => toggleRecoveryMode(clearErrors)}
                                    className="p-0 h-auto text-sm underline"
                                >
                                    {authConfigContent.toggleText}
                                </Button>
                            </p>
                        </div>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
