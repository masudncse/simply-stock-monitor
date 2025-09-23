import { Menu, MenuItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { HTMLAttributes, useState } from 'react';

export default function AppearanceToggleDropdown({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const getCurrentIcon = () => {
        switch (appearance) {
            case 'dark':
                return <Moon style={{ width: 20, height: 20 }} />;
            case 'light':
                return <Sun style={{ width: 20, height: 20 }} />;
            default:
                return <Monitor style={{ width: 20, height: 20 }} />;
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={className} {...props}>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{ width: 36, height: 36 }}
                aria-label="Toggle theme"
            >
                {getCurrentIcon()}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => { updateAppearance('light'); handleClose(); }}>
                    <ListItemIcon>
                        <Sun style={{ width: 20, height: 20 }} />
                    </ListItemIcon>
                    <ListItemText>Light</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { updateAppearance('dark'); handleClose(); }}>
                    <ListItemIcon>
                        <Moon style={{ width: 20, height: 20 }} />
                    </ListItemIcon>
                    <ListItemText>Dark</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { updateAppearance('system'); handleClose(); }}>
                    <ListItemIcon>
                        <Monitor style={{ width: 20, height: 20 }} />
                    </ListItemIcon>
                    <ListItemText>System</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}
