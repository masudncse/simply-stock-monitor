import { Icon } from '@/components/icon';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { type NavItem } from '@/types';

export function NavFooter({
    items,
}: {
    items: NavItem[];
}) {
    return (
        <List>
            {items.map((item) => (
                <ListItem key={item.title} disablePadding>
                    <ListItemButton
                        component="a"
                        href={
                            typeof item.href === 'string'
                                ? item.href
                                : item.href.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'text.primary',
                            }
                        }}
                    >
                        {item.icon && (
                            <ListItemIcon>
                                <Icon
                                    iconNode={item.icon}
                                    style={{ width: 20, height: 20 }}
                                />
                            </ListItemIcon>
                        )}
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}
