import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
                <div className="flex flex-col gap-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...ProfileController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <div className="flex flex-col gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={auth.user.name}
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Full name"
                                                />
                                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email address</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={auth.user.email}
                                                    required
                                                    autoComplete="username"
                                                    placeholder="Email address"
                                                />
                                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                            </div>
                                        </div>

                                        {mustVerifyEmail &&
                                            auth.user.email_verified_at === null && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Your email address is unverified.{' '}
                                                        <Link
                                                            href={send()}
                                                            as="button"
                                                            className="text-inherit underline bg-none border-none cursor-pointer"
                                                        >
                                                            Click here to resend the verification email.
                                                        </Link>
                                                    </p>

                                                    {status === 'verification-link-sent' && (
                                                        <Alert className="mt-2">
                                                            <AlertDescription>
                                                                A new verification link has been sent to your email address.
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            )}

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                data-test="update-profile-button"
                                            >
                                                Save
                                            </Button>

                                            {recentlySuccessful && (
                                                <p className="text-sm text-muted-foreground">
                                                    Saved
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
