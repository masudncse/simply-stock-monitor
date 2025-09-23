import { ListItemButton } from '@mui/material';
import { UserInfo } from '@/components/user-info';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;

    return (
        <ListItemButton
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                '&:hover': {
                    backgroundColor: 'action.hover',
                }
            }}
        >
            <UserInfo user={auth.user} />
            <ChevronsUpDown style={{ marginLeft: 'auto', width: 16, height: 16 }} />
        </ListItemButton>
    );
}
