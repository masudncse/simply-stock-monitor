import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import {
    Box,
    Container,
    Typography,
    Link as MuiLink,
    Paper,
} from '@mui/material';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <Box
            component="div"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: { xs: 2, md: 3 },
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <MuiLink
                                component={Link}
                                href={home()}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <Box
                                    component="div"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1,
                                    }}
                                >
                                    <AppLogoIcon sx={{ width: 36, height: 36, fill: 'currentColor' }} />
                                </Box>
                                <Typography variant="srOnly">{title}</Typography>
                            </MuiLink>

                            <Box
                                component="div"
                                sx={{
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <Typography variant="h4" component="h1" fontWeight="medium">
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {description}
                                </Typography>
                            </Box>
                        </Box>
                        {children}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
