import Heading from '@/components/heading';
import { Divider, Box, List, ListItem, ListItemButton } from '@mui/material';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <Box sx={{ p: 3 }}>
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' }, 
                gap: 3,
                mt: 3
            }}>
                <Box sx={{ 
                    width: { xs: '100%', lg: 200 },
                    maxWidth: { xs: '100%', lg: 200 }
                }}>
                    <List component="nav">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = currentPath === (typeof item.href === 'string' ? item.href : item.href.url);
                            return (
                                <ListItem key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={item.href}
                                        selected={isActive}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                backgroundColor: 'action.selected',
                                            }
                                        }}
                                    >
                                        {item.icon && (
                                            <item.icon style={{ marginRight: 8, width: 16, height: 16 }} />
                                        )}
                                        {item.title}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', lg: 'block' } }} />

                <Box sx={{ 
                    flex: 1,
                    maxWidth: { md: '600px' }
                }}>
                    <Box sx={{ maxWidth: '600px' }}>
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
