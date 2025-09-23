import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
} from '@mui/material';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="Password"
                            autoComplete="current-password"
                            autoFocus
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            variant="outlined"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && (
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                            )}
                            Confirm password
                        </Button>
                    </Box>
                )}
            </Form>
        </AuthLayout>
    );
}
