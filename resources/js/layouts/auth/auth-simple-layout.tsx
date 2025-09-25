import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-2 md:p-3">
            <div className="w-full max-w-sm">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-1 text-foreground hover:text-primary transition-colors"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                        <AppLogoIcon className="w-9 h-9 fill-current text-primary" />
                                    </div>
                                    <span className="sr-only">{title}</span>
                                </Link>

                                <div className="text-center flex flex-col gap-1">
                                    <h1 className="text-2xl font-medium">
                                        {title}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
