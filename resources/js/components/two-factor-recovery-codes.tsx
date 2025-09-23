import { Button, Card, CardContent, CardHeader, Typography, Box, Grid, Chip } from '@mui/material';
import { regenerateRecoveryCodes } from '@/routes/two-factor';
import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AlertError from './alert-error';

interface TwoFactorRecoveryCodesProps {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
}

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: TwoFactorRecoveryCodesProps) {
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

    return (
        <Card>
            <CardHeader>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockKeyhole style={{ width: 16, height: 16 }} />
                    <Typography variant="h6" component="h3">
                        2FA Recovery Codes
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Recovery codes let you regain access if you lose your 2FA
                    device. Store them in a secure password manager.
                </Typography>
            </CardHeader>
            <CardContent>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    gap: 2, 
                    alignItems: { sm: 'center' },
                    justifyContent: { sm: 'space-between' },
                    userSelect: 'none'
                }}>
                    <Button
                        onClick={toggleCodesVisibility}
                        variant="outlined"
                        startIcon={<RecoveryCodeIconComponent style={{ width: 16, height: 16 }} />}
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        {codesAreVisible ? 'Hide' : 'View'} Recovery Codes
                    </Button>

                    {canRegenerateCodes && (
                        <Form {...regenerateRecoveryCodes.form()}>
                            {({ processing }) => (
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="warning"
                                    disabled={processing}
                                    startIcon={<RefreshCw style={{ width: 16, height: 16 }} />}
                                >
                                    Regenerate Codes
                                </Button>
                            )}
                        </Form>
                    )}
                </Box>

                {errors.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <AlertError errors={errors} />
                    </Box>
                )}

                {codesAreVisible && (
                    <Box
                        ref={codesSectionRef}
                        id="recovery-codes-section"
                        sx={{ mt: 3 }}
                    >
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Recovery Codes:
                        </Typography>
                        <Grid container spacing={1}>
                            {recoveryCodesList.map((code, index) => (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <Chip
                                        label={code}
                                        variant="outlined"
                                        sx={{ 
                                            fontFamily: 'monospace',
                                            width: '100%',
                                            justifyContent: 'flex-start'
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}