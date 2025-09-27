import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';
import { Form } from '@inertiajs/react';
import { Check, Copy, Loader2, ScanLine } from 'lucide-react';
import { useRef, useState } from 'react';
import AlertError from './alert-error';

function GridScanIcon() {
    return (
        <div className="mb-6 rounded-full border border-border bg-background p-1 shadow-sm">
            <div className="relative overflow-hidden rounded-full border border-border bg-muted p-6">
                <div className="absolute inset-0 grid grid-cols-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`col-${i + 1}`}
                            className={`border-r border-border ${i === 4 ? 'border-r-0' : ''}`}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`row-${i + 1}`}
                            className={`border-b border-border ${i === 4 ? 'border-b-0' : ''}`}
                        />
                    ))}
                </div>
                <ScanLine className="relative z-20 w-6 h-6" />
            </div>
        </div>
    );
}

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const [copiedText, copy] = useClipboard();
    const IconComponent = copiedText === manualSetupKey ? Check : Copy;

    return (
        <>
            {errors?.length ? (
                <AlertError errors={errors} />
            ) : (
                <>
                    <div className="mx-auto max-w-md overflow-hidden">
                        <GridScanIcon />
                        {qrCodeSvg && (
                            <div 
                                className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
                                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                            />
                        )}
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Scan this QR code with your authenticator app, or enter the code manually:
                        </p>
                        
                        {manualSetupKey && (
                            <div className="flex items-center justify-center gap-2 p-4 border border-border rounded bg-muted">
                                <p className="text-sm font-mono break-all">
                                    {manualSetupKey}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copy(manualSetupKey)}
                                    aria-label="Copy setup key"
                                    className="h-8 w-8 p-0"
                                >
                                    <IconComponent className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={onNextStep}
                        className="w-full mt-6"
                    >
                        {buttonText}
                    </Button>
                </>
            )}
        </>
    );
}

function TwoFactorConfirmationStep({
    onPreviousStep,
    errors,
}: {
    onPreviousStep: () => void;
    errors: string[];
}) {
    const [code, setCode] = useState<string>('');
    const codeInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            {errors?.length ? (
                <AlertError errors={errors} />
            ) : (
                <>
                    <p className="text-sm text-muted-foreground mb-6">
                        Enter the code from your authenticator app to confirm setup:
                    </p>

                    <Form
                        {...confirm.form()}
                        onError={() => {
                            codeInputRef.current?.focus();
                        }}
                        resetOnSuccess
                    >
                        {({ processing }) => (
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Verification Code</Label>
                                    <Input
                                        ref={codeInputRef}
                                        id="code"
                                        name="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={onPreviousStep}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || code.length !== OTP_MAX_LENGTH}
                                        className="flex-1"
                                    >
                                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {processing ? 'Verifying...' : 'Confirm'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </>
            )}
        </>
    );
}

interface TwoFactorSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    errors: string[];
}

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    qrCodeSvg,
    manualSetupKey,
    errors,
}: TwoFactorSetupModalProps) {
    const [currentStep, setCurrentStep] = useState<'setup' | 'confirmation'>('setup');

    const handleNextStep = () => {
        setCurrentStep('confirmation');
    };

    const handlePreviousStep = () => {
        setCurrentStep('setup');
    };

    const handleClose = () => {
        setCurrentStep('setup');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {currentStep === 'setup' ? 'Set up Two-Factor Authentication' : 'Confirm Setup'}
                    </DialogTitle>
                    <DialogDescription className="mb-6">
                        {currentStep === 'setup' 
                            ? 'Follow these steps to set up two-factor authentication for your account.'
                            : 'Enter the verification code from your authenticator app to complete the setup.'
                        }
                    </DialogDescription>
                </DialogHeader>

                {currentStep === 'setup' ? (
                    <TwoFactorSetupStep
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        buttonText="I've added the code to my app"
                        onNextStep={handleNextStep}
                        errors={errors}
                    />
                ) : (
                    <TwoFactorConfirmationStep
                        onPreviousStep={handlePreviousStep}
                        errors={errors}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}