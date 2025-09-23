import { MenuItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <Box sx={{ p: 1 }}>
                <UserInfo user={user} showEmail={true} />
            </Box>
            <Divider />
            <MenuItem component={Link} href={edit()} onClick={cleanup}>
                <ListItemIcon>
                    <Settings style={{ width: 16, height: 16 }} />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem component={Link} href={logout()} onClick={handleLogout} data-test="logout-button">
                <ListItemIcon>
                    <LogOut style={{ width: 16, height: 16 }} />
                </ListItemIcon>
                <ListItemText>Log out</ListItemText>
            </MenuItem>
        </>
    );
}
