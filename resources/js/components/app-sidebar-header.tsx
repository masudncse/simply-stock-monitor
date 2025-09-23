import { Breadcrumbs } from '@/components/breadcrumbs';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                height: 64,
                flexShrink: 0,
                alignItems: 'center',
                gap: 2,
                borderBottom: 1,
                borderColor: 'divider',
                px: 3,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton size="small" sx={{ ml: -1 }}>
                    <MenuIcon />
                </IconButton>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </Box>
        </Box>
    );
}
