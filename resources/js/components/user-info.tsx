import { Avatar, Box, Typography } from '@mui/material';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar 
                src={user.avatar} 
                alt={user.name}
                sx={{ width: 32, height: 32 }}
            >
                {getInitials(user.name)}
            </Avatar>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1, 
                textAlign: 'left',
                minWidth: 0
            }}>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {user.name}
                </Typography>
                {showEmail && (
                    <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {user.email}
                    </Typography>
                )}
            </Box>
        </>
    );
}
