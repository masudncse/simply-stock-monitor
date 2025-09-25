import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    children,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <main
                className="flex flex-1 flex-col min-h-0"
                {...props}
            >
                {children}
            </main>
        );
    }

    return (
        <main
            className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-2 rounded-lg"
            {...props}
        >
            {children}
        </main>
    );
}
