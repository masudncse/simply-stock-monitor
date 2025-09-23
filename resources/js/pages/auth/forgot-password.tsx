// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Alert,
    Link as MuiLink,
} from '@mui/material';
import { Link } from '@inertiajs/react';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {status}
                </Alert>
            )}

            <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Form {...PasswordResetLinkController.store.form()}>
                    {({ processing, errors }) => (
                        <>
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                autoComplete="off"
                                autoFocus
                                placeholder="email@example.com"
                                error={!!errors.email}
                                helperText={errors.email}
                                fullWidth
                                variant="outlined"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={processing}
                                sx={{ mt: 2 }}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && (
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                )}
                                Email password reset link
                            </Button>
                        </>
                    )}
                </Form>

                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                    Or, return to{' '}
                    <MuiLink
                        component={Link}
                        href={login()}
                        sx={{ textDecoration: 'none' }}
                    >
                        log in
                    </MuiLink>
                </Typography>
            </Box>
        </AuthLayout>
    );
}
