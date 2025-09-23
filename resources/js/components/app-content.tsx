import { Box } from '@mui/material';
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
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                }}
                {...props}
            >
                {children}
            </Box>
        );
    }

    return (
        <Box
            component="main"
            sx={{
                mx: 'auto',
                display: 'flex',
                height: '100%',
                width: '100%',
                maxWidth: '7xl',
                flex: 1,
                flexDirection: 'column',
                gap: 2,
                borderRadius: 2,
            }}
            {...props}
        >
            {children}
        </Box>
    );
}
