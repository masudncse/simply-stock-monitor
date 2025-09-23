import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
} from '@mui/material';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout
            title="Reset password"
            description="Please enter your new password below"
        >
            <Head title="Reset password" />

            <Form
                {...NewPasswordController.store.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            autoComplete="email"
                            value={email}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            autoComplete="new-password"
                            autoFocus
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
                            data-test="reset-password-button"
                        >
                            {processing && (
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                            )}
                            Reset password
                        </Button>
                    </Box>
                )}
            </Form>
        </AuthLayout>
    );
}
