import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Link as MuiLink,
} from '@mui/material';
import { Link } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
            >
                {({ processing, errors }) => (
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            id="name"
                            name="name"
                            type="text"
                            label="Name"
                            autoFocus
                            autoComplete="name"
                            placeholder="Full name"
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            variant="outlined"
                        />

                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label="Email address"
                            autoComplete="email"
                            placeholder="email@example.com"
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            variant="outlined"
                        />

                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            autoComplete="new-password"
                            placeholder="Password"
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            variant="outlined"
                        />

                        <TextField
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            label="Confirm password"
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
                            fullWidth
                            variant="outlined"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={processing}
                            sx={{ mt: 2 }}
                            data-test="register-user-button"
                        >
                            {processing && (
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                            )}
                            Create account
                        </Button>

                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                            Already have an account?{' '}
                            <MuiLink
                                component={Link}
                                href={login()}
                                sx={{ textDecoration: 'none' }}
                            >
                                Log in
                            </MuiLink>
                        </Typography>
                    </Box>
                )}
            </Form>
        </AuthLayout>
    );
}
