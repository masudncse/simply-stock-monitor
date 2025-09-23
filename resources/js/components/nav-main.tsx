import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <Box sx={{ px: 2, py: 0 }}>
            <Typography variant="overline" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                Platform
            </Typography>
            <List>
                {items.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            selected={page.url.startsWith(
                                typeof item.href === 'string'
                                    ? item.href
                                    : item.href.url,
                            )}
                            sx={{
                                borderRadius: 1,
                                mx: 1,
                                mb: 0.5,
                            }}
                        >
                            {item.icon && (
                                <ListItemIcon>
                                    <item.icon style={{ width: 16, height: 16 }} />
                                </ListItemIcon>
                            )}
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}