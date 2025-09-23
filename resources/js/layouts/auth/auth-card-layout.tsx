import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import {
    Box,
    Container,
    Typography,
    Link as MuiLink,
    Card,
    CardContent,
    CardHeader,
} from '@mui/material';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <Box
            component="div"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.50',
                p: { xs: 2, md: 3 },
            }}
        >
            <Container maxWidth="sm">
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <MuiLink
                        component={Link}
                        href={home()}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            alignSelf: 'center',
                            fontWeight: 500,
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
                                width: 36,
                                height: 36,
                            }}
                        >
                            <AppLogoIcon sx={{ width: 36, height: 36, fill: 'currentColor' }} />
                        </Box>
                    </MuiLink>

                    <Card
                        sx={{
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                    >
                        <CardHeader
                            sx={{
                                textAlign: 'center',
                                px: 5,
                                pt: 4,
                                pb: 0,
                            }}
                        >
                            <Typography variant="h5" component="h1" fontWeight="medium">
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {description}
                            </Typography>
                        </CardHeader>
                        <CardContent sx={{ px: 5, py: 4 }}>
                            {children}
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}
