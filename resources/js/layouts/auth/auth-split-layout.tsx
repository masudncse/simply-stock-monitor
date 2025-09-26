import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex flex-col flex-1 bg-gray-900 text-white p-8 relative">
                <div className="absolute inset-0 bg-gray-900" />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-medium text-inherit no-underline mb-4"
                >
                    <AppLogoIcon className="mr-2 w-8 h-8 fill-current" />
                    {name}
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="text-lg mb-2">
                            &ldquo;{quote.message}&rdquo;
                        </blockquote>
                        <p className="text-sm text-gray-300">
                            {quote.author}
                        </p>
                    </div>
                )}
            </div>

            {/* Right side - Auth form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href={home()}
                            className="flex lg:hidden items-center justify-center text-inherit no-underline"
                        >
                            <AppLogoIcon className="w-10 h-10 fill-current" />
                        </Link>
                        
                        <div className="text-left sm:text-center flex flex-col gap-2">
                            <h1 className="text-2xl font-medium">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                        
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
