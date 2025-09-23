import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import {
    Box,
    Container,
    Typography,
    Link as MuiLink,
} from '@mui/material';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <Box
            component="div"
            sx={{
                minHeight: '100vh',
                display: 'flex',
            }}
        >
            {/* Left side - Branding */}
            <Box
                component="div"
                sx={{
                    display: { xs: 'none', lg: 'flex' },
                    flexDirection: 'column',
                    flex: 1,
                    backgroundColor: 'grey.900',
                    color: 'white',
                    p: 5,
                    position: 'relative',
                }}
            >
                <Box
                    component="div"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'grey.900',
                    }}
                />
                <MuiLink
                    component={Link}
                    href={home()}
                    sx={{
                        position: 'relative',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        color: 'inherit',
                        mb: 2,
                    }}
                >
                    <AppLogoIcon sx={{ mr: 1, width: 32, height: 32, fill: 'currentColor' }} />
                    {name}
                </MuiLink>
                {quote && (
                    <Box
                        component="div"
                        sx={{
                            position: 'relative',
                            zIndex: 20,
                            mt: 'auto',
                        }}
                    >
                        <Typography variant="h6" component="blockquote" sx={{ mb: 1 }}>
                            &ldquo;{quote.message}&rdquo;
                        </Typography>
                        <Typography variant="body2" color="grey.300">
                            {quote.author}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Right side - Auth form */}
            <Box
                component="div"
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, lg: 4 },
                }}
            >
                <Container maxWidth="sm">
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                        }}
                    >
                        <MuiLink
                            component={Link}
                            href={home()}
                            sx={{
                                display: { xs: 'flex', lg: 'none' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <AppLogoIcon sx={{ width: 40, height: 40, fill: 'currentColor' }} />
                        </MuiLink>
                        
                        <Box
                            component="div"
                            sx={{
                                textAlign: { xs: 'left', sm: 'center' },
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
                        
                        {children}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
