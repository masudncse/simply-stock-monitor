import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { Button, TextField, Box, Fade } from '@mui/material';

import HeadingSmall from '@/components/heading-small';
import { edit } from '@/routes/password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <HeadingSmall
                        title="Update password"
                        description="Ensure your account is using a long, random password to stay secure"
                    />

                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    id="current_password"
                                    inputRef={currentPasswordInput}
                                    name="current_password"
                                    type="password"
                                    label="Current password"
                                    autoComplete="current-password"
                                    placeholder="Current password"
                                    fullWidth
                                    error={!!errors.current_password}
                                    helperText={errors.current_password}
                                />

                                <TextField
                                    id="password"
                                    inputRef={passwordInput}
                                    name="password"
                                    type="password"
                                    label="New password"
                                    autoComplete="new-password"
                                    placeholder="New password"
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />

                                <TextField
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    label="Confirm password"
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    fullWidth
                                    error={!!errors.password_confirmation}
                                    helperText={errors.password_confirmation}
                                />

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing}
                                        data-test="update-password-button"
                                    >
                                        Save password
                                    </Button>

                                    <Fade in={recentlySuccessful}>
                                        <Box component="p" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                            Saved
                                        </Box>
                                    </Fade>
                                </Box>
                            </Box>
                        )}
                    </Form>
                </Box>
            </SettingsLayout>
        </AppLayout>
    );
}