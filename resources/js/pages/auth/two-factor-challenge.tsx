import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
} from '@mui/material';
// Custom OTP Input component using MUI
const OTPInput = ({ value, onChange, length, disabled, sx }: {
    value: string;
    onChange: (value: string) => void;
    length: number;
    disabled?: boolean;
    sx?: object;
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
        <Box sx={{ display: 'flex', gap: 1, ...sx }}>
            {Array.from({ length }, (_, index) => (
                <TextField
                    key={index}
                    id={`otp-${index}`}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    inputProps={{
                        maxLength: 1,
                        style: { textAlign: 'center' }
                    }}
                    sx={{ width: 48 }}
                    variant="outlined"
                />
            ))}
        </Box>
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

            <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Form
                    {...store.form()}
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <Stack spacing={3}>
                            {showRecoveryInput ? (
                                <>
                                        <TextField
                                            name="recovery_code"
                                            type="text"
                                            label="Recovery Code"
                                            placeholder="Enter recovery code"
                                            autoFocus={showRecoveryInput}
                                            error={!!errors.recovery_code}
                                            helperText={errors.recovery_code}
                                            fullWidth
                                            variant="outlined"
                                        />
                                </>
                            ) : (
                                <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <input type="hidden" name="code" value={code} />
                                    <OTPInput
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        length={OTP_MAX_LENGTH}
                                        disabled={processing}
                                        sx={{ gap: 1 }}
                                    />
                                    {errors.code && (
                                        <Typography variant="body2" color="error" textAlign="center">
                                            {errors.code}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={processing}
                            >
                                Continue
                            </Button>

                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                or you can{' '}
                                <Button
                                    variant="text"
                                    onClick={() => toggleRecoveryMode(clearErrors)}
                                    sx={{ textDecoration: 'underline', p: 0, minWidth: 'auto' }}
                                >
                                    {authConfigContent.toggleText}
                                </Button>
                            </Typography>
                        </Stack>
                    )}
                </Form>
            </Box>
        </AuthLayout>
    );
}
