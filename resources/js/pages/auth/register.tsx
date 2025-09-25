import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Loader2 } from 'lucide-react';

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Head title="Register" />
            
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
                                    Create an account
                                </CardTitle>
                                <CardDescription>
                                    Enter your details below to create your account
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <Form
                            {...RegisteredUserController.store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                        >
                            {({ processing, errors }) => (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoFocus
                                            autoComplete="name"
                                            placeholder="Full name"
                                            className={errors.name ? 'border-destructive' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className={errors.email ? 'border-destructive' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Password"
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

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Create account
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <Link
                                            href={login()}
                                            className="text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Log in
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
