import { 
    Button, 
    Dialog, 
    DialogContent, 
    DialogContentText, 
    DialogTitle,
    TextField,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';
import { Form } from '@inertiajs/react';
import { Check, Copy, Loader2, ScanLine } from 'lucide-react';
import { useRef, useState } from 'react';
import AlertError from './alert-error';

function GridScanIcon() {
    return (
        <Box sx={{ 
            mb: 3, 
            borderRadius: '50%', 
            border: 1, 
            borderColor: 'divider', 
            bgcolor: 'background.paper', 
            p: 0.5, 
            boxShadow: 1 
        }}>
            <Box sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '50%', 
                border: 1, 
                borderColor: 'divider', 
                bgcolor: 'action.hover', 
                p: 2.5 
            }}>
                <Box sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    opacity: 0.5 
                }}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Box
                            key={`col-${i + 1}`}
                            sx={{ 
                                borderRight: 1, 
                                borderColor: 'divider',
                                '&:last-child': { borderRight: 0 }
                            }}
                        />
                    ))}
                </Box>
                <Box sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    display: 'grid', 
                    gridTemplateRows: 'repeat(5, 1fr)',
                    opacity: 0.5 
                }}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Box
                            key={`row-${i + 1}`}
                            sx={{ 
                                borderBottom: 1, 
                                borderColor: 'divider',
                                '&:last-child': { borderBottom: 0 }
                            }}
                        />
                    ))}
                </Box>
                <ScanLine style={{ position: 'relative', zIndex: 20, width: 24, height: 24 }} />
            </Box>
        </Box>
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
                    <Box sx={{ mx: 'auto', maxWidth: '400px', overflow: 'hidden' }}>
                        <GridScanIcon />
                        {qrCodeSvg && (
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    '& svg': { maxWidth: '100%', height: 'auto' }
                                }}
                                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                            />
                        )}
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Scan this QR code with your authenticator app, or enter the code manually:
                        </Typography>
                        
                        {manualSetupKey && (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: 1,
                                p: 2,
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                bgcolor: 'action.hover'
                            }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all'
                                    }}
                                >
                                    {manualSetupKey}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => copy(manualSetupKey)}
                                    aria-label="Copy setup key"
                                >
                                    <IconComponent style={{ width: 16, height: 16 }} />
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        onClick={onNextStep}
                        fullWidth
                        sx={{ mt: 3 }}
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
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Enter the code from your authenticator app to confirm setup:
                    </Typography>

                    <Form
                        {...confirm.form()}
                        onError={() => {
                            codeInputRef.current?.focus();
                        }}
                        resetOnSuccess
                    >
                        {({ processing }) => (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    ref={codeInputRef}
                                    name="code"
                                    label="Verification Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    inputProps={{
                                        maxLength: OTP_MAX_LENGTH,
                                        pattern: '[0-9]*',
                                        inputMode: 'numeric',
                                    }}
                                    fullWidth
                                    autoComplete="one-time-code"
                                    autoFocus
                                />

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={onPreviousStep}
                                        fullWidth
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing || code.length !== OTP_MAX_LENGTH}
                                        fullWidth
                                        startIcon={processing ? <Loader2 style={{ width: 16, height: 16 }} /> : undefined}
                                    >
                                        {processing ? 'Verifying...' : 'Confirm'}
                                    </Button>
                                </Box>
                            </Box>
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
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {currentStep === 'setup' ? 'Set up Two-Factor Authentication' : 'Confirm Setup'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    {currentStep === 'setup' 
                        ? 'Follow these steps to set up two-factor authentication for your account.'
                        : 'Enter the verification code from your authenticator app to complete the setup.'
                    }
                </DialogContentText>

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