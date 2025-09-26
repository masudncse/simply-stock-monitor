import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 md:p-6">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 self-center font-medium text-inherit no-underline"
                    >
                        <div className="flex items-center justify-center w-9 h-9">
                            <AppLogoIcon className="w-9 h-9 fill-current" />
                        </div>
                    </Link>

                    <Card className="rounded-lg shadow-lg">
                        <CardHeader className="text-center px-6 pt-6 pb-0">
                            <CardTitle className="text-xl font-medium">
                                {title}
                            </CardTitle>
                            {description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {description}
                                </p>
                            )}
                        </CardHeader>
                        <CardContent className="px-6 py-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
