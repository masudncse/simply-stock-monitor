import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Loader2 } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Head title="Log in" />
            
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
                                    Log in to your account
                                </CardTitle>
                                <CardDescription>
                                    Enter your email and password below to log in
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                        >
                            {({ processing, errors }) => (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoFocus
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className={errors.email ? 'border-destructive' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <Link
                                                    href={request()}
                                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            className={errors.password ? 'border-destructive' : ''}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-destructive">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="remember" name="remember" />
                                        <Label htmlFor="remember" className="text-sm font-normal">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Log in
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground">
                                        Don't have an account?{' '}
                                        <Link
                                            href={register()}
                                            className="text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </Form>

                        {status && (
                            <Alert className="mt-4">
                                <AlertDescription>{status}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
