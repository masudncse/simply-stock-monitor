// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Loader2 } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Head title="Forgot password" />
            
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center space-y-2 text-foreground hover:text-primary transition-colors"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <AppLogoIcon className="w-9 h-9 fill-current text-primary" />
                                </div>
                            </Link>
                            
                            <div className="text-center space-y-2">
                                <CardTitle className="text-2xl font-medium">
                                    Forgot password
                                </CardTitle>
                                <CardDescription>
                                    Enter your email to receive a password reset link
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        {status && (
                            <Alert className="mb-4">
                                <AlertDescription>{status}</AlertDescription>
                            </Alert>
                        )}

                        <Form {...PasswordResetLinkController.store.form()}>
                            {({ processing, errors }) => (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="email@example.com"
                                            className={errors.email ? 'border-destructive' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Email password reset link
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground">
                                        Or, return to{' '}
                                        <Link
                                            href={login()}
                                            className="text-primary hover:text-primary/80 transition-colors"
                                        >
                                            log in
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
