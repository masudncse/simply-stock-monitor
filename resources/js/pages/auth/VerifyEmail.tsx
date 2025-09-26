// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <Alert className="mb-4">
                    <AlertDescription>
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-4 text-center">
                <Form
                    {...EmailVerificationNotificationController.store.form()}
                >
                    {({ processing }) => (
                        <>
                            <Button 
                                variant="outline" 
                                disabled={processing}
                                className="mb-4"
                            >
                                {processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Resend verification email
                            </Button>

                            <Link
                                href={logout()}
                                className="text-sm text-muted-foreground hover:underline"
                            >
                                Log out
                            </Link>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
