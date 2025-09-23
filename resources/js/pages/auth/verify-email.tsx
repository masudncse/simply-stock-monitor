// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import {
    Box,
    Button,
    CircularProgress,
    Alert,
    Link as MuiLink,
} from '@mui/material';
import { Link } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    A new verification link has been sent to the email address
                    you provided during registration.
                </Alert>
            )}

            <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'center' }}>
                <Form
                    {...EmailVerificationNotificationController.store.form()}
                >
                    {({ processing }) => (
                        <>
                            <Button 
                                variant="outlined" 
                                disabled={processing}
                                sx={{ mb: 2 }}
                            >
                                {processing && (
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                )}
                                Resend verification email
                            </Button>

                            <MuiLink
                                component={Link}
                                href={logout()}
                                sx={{ textDecoration: 'none', display: 'block' }}
                            >
                                Log out
                            </MuiLink>
                        </>
                    )}
                </Form>
            </Box>
        </AuthLayout>
    );
}
