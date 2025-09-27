import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import Layout from '@/layouts/Layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck, Shield } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: show.url(),
    },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <Layout title="Two-Factor Authentication" breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />
            <div className="space-y-6">
                    <HeadingSmall
                        title="Two-Factor Authentication"
                        description="Manage your two-factor authentication settings"
                    />
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Two-Factor Authentication
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {twoFactorEnabled ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Enabled
                                        </Badge>
                                    </div>
                                    
                                    <Alert>
                                        <ShieldCheck className="h-4 w-4" />
                                        <AlertDescription>
                                            With two-factor authentication enabled, you will be prompted for a secure, random pin during login, which you can retrieve from the TOTP-supported application on your phone.
                                        </AlertDescription>
                                    </Alert>

                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={errors}
                                    />

                                    <div className="pt-4">
                                        <Form {...disable.form()}>
                                            {({ processing }) => (
                                                <Button
                                                    variant="destructive"
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    <ShieldBan className="mr-2 h-4 w-4" />
                                                    Disable 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="destructive">Disabled</Badge>
                                    </div>
                                    
                                    <Alert>
                                        <Shield className="h-4 w-4" />
                                        <AlertDescription>
                                            When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from a TOTP-supported application on your phone.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="pt-4">
                                        {hasSetupData ? (
                                            <Button
                                                onClick={() => setShowSetupModal(true)}
                                            >
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Continue Setup
                                            </Button>
                                        ) : (
                                            <Form
                                                {...enable.form()}
                                                onSuccess={() =>
                                                    setShowSetupModal(true)
                                                }
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                                        Enable 2FA
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        errors={errors}
                    />
                </div>
        </Layout>
    );
}