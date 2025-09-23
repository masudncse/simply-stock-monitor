import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Fade,
    Grid,
    TextField,
    Typography,
    Alert,
} from '@mui/material';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Card>
                        <CardContent>
                            <Form
                                {...ProfileController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="name"
                                                    name="name"
                                                    label="Name"
                                                    defaultValue={auth.user.name}
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Full name"
                                                    fullWidth
                                                    error={!!errors.name}
                                                    helperText={errors.name}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    label="Email address"
                                                    defaultValue={auth.user.email}
                                                    required
                                                    autoComplete="username"
                                                    placeholder="Email address"
                                                    fullWidth
                                                    error={!!errors.email}
                                                    helperText={errors.email}
                                                />
                                            </Grid>
                                        </Grid>

                                        {mustVerifyEmail &&
                                            auth.user.email_verified_at === null && (
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        Your email address is unverified.{' '}
                                                        <Link
                                                            href={send()}
                                                            as="button"
                                                            style={{ 
                                                                color: 'inherit', 
                                                                textDecoration: 'underline',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Click here to resend the verification email.
                                                        </Link>
                                                    </Typography>

                                                    {status === 'verification-link-sent' && (
                                                        <Alert severity="success" sx={{ mt: 1 }}>
                                                            A new verification link has been sent to your email address.
                                                        </Alert>
                                                    )}
                                                </Box>
                                            )}

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={processing}
                                                data-test="update-profile-button"
                                            >
                                                Save
                                            </Button>

                                            <Fade in={recentlySuccessful}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Saved
                                                </Typography>
                                            </Fade>
                                        </Box>
                                    </Box>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </Box>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
