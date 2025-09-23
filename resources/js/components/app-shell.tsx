import { Box } from '@mui/material';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {

    if (variant === 'header') {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', flexDirection: 'column' }}>
                {children}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {children}
        </Box>
    );
}
