import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    TextField,
    Typography,
    Alert,
    Link as MuiLink,
} from '@mui/material';
import { Link } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <Form
                {...AuthenticatedSessionController.store.form()}
                resetOnSuccess={['password']}
            >
                {({ processing, errors }) => (
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label="Email address"
                            required
                            autoFocus
                            autoComplete="email"
                            placeholder="email@example.com"
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            variant="outlined"
                        />

                        <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" component="label" htmlFor="password">
                                    Password
                                </Typography>
                                {canResetPassword && (
                                    <MuiLink
                                        component={Link}
                                        href={request()}
                                        variant="body2"
                                        sx={{ textDecoration: 'none', fontSize: '0.875rem' }}
                                    >
                                        Forgot password?
                                    </MuiLink>
                                )}
                            </Box>
                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                placeholder="Password"
                                error={!!errors.password}
                                helperText={errors.password}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                />
                            }
                            label="Remember me"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={processing}
                            sx={{ mt: 2 }}
                            data-test="login-button"
                        >
                            {processing && (
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                            )}
                            Log in
                        </Button>

                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                            Don't have an account?{' '}
                            <MuiLink
                                component={Link}
                                href={register()}
                                sx={{ textDecoration: 'none' }}
                            >
                                Sign up
                            </MuiLink>
                        </Typography>
                    </Box>
                )}
            </Form>

            {status && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {status}
                </Alert>
            )}
        </AuthLayout>
    );
}
