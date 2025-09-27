import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import Layout from '@/layouts/Layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

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
        <Layout title="Password Settings" breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <div className="space-y-6">
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current password</Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                            className={errors.current_password ? 'border-destructive' : ''}
                                        />
                                        {errors.current_password && (
                                            <p className="text-sm text-destructive">{errors.current_password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">New password</Label>
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="New password"
                                            className={errors.password ? 'border-destructive' : ''}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-destructive">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm password</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Confirm password"
                                            className={errors.password_confirmation ? 'border-destructive' : ''}
                                        />
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            data-test="update-password-button"
                                        >
                                            Save password
                                        </Button>

                                        {recentlySuccessful && (
                                            <Alert className="border-green-200 bg-green-50">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <AlertDescription className="text-green-800">
                                                    Password updated successfully
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </Form>
                </div>
        </Layout>
    );
}