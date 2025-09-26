import { regenerateRecoveryCodes } from '@/routes/two-factor';
import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AlertError from './alert-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
                <div className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4" />
                    <CardTitle className="text-lg">2FA Recovery Codes</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                    Recovery codes let you regain access if you lose your 2FA
                    device. Store them in a secure password manager.
                </p>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between select-none">
                    <Button
                        onClick={toggleCodesVisibility}
                        variant="outline"
                        className="flex items-center gap-2"
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIconComponent className="h-4 w-4" />
                        {codesAreVisible ? 'Hide' : 'View'} Recovery Codes
                    </Button>

                    {canRegenerateCodes && (
                        <Form {...regenerateRecoveryCodes.form()}>
                            {({ processing }) => (
                                <Button
                                    type="submit"
                                    variant="outline"
                                    disabled={processing}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Regenerate Codes
                                </Button>
                            )}
                        </Form>
                    )}
                </div>

                {errors.length > 0 && (
                    <div className="mt-4">
                        <AlertError errors={errors} />
                    </div>
                )}

                {codesAreVisible && (
                    <div
                        ref={codesSectionRef}
                        id="recovery-codes-section"
                        className="mt-6"
                    >
                        <h4 className="text-sm font-medium mb-4">
                            Recovery Codes:
                        </h4>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                            {recoveryCodesList.map((code, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="font-mono text-xs justify-start p-2"
                                >
                                    {code}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}