import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
} from '@mui/material';
import { OTPInput } from '@mui/material-lab';

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
                                        required
                                        error={!!errors.recovery_code}
                                        helperText={errors.recovery_code}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </>
                            ) : (
                                <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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
