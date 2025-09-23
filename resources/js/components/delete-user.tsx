import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import HeadingSmall from '@/components/heading-small';
import { 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    DialogContentText,
    TextField,
    Box,
    Alert
} from '@mui/material';
import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <HeadingSmall
                title="Delete account"
                description="Delete your account and all of its resources"
            />
            
            <Alert severity="error" sx={{ p: 2 }}>
                <Box sx={{ mb: 1 }}>
                    <strong>Warning</strong>
                </Box>
                <Box sx={{ mb: 2 }}>
                    Please proceed with caution, this cannot be undone.
                </Box>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setOpen(true)}
                    data-test="delete-user-button"
                >
                    Delete account
                </Button>
            </Alert>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    Are you sure you want to delete your account?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Once your account is deleted, all of its resources
                        and data will also be permanently deleted. Please
                        enter your password to confirm you would like to
                        permanently delete your account.
                    </DialogContentText>

                    <Form
                        {...ProfileController.destroy.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        onError={() => passwordInput.current?.focus()}
                        resetOnSuccess
                    >
                        {({ resetAndClearErrors, processing, errors }) => (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    id="password"
                                    type="password"
                                    name="password"
                                    inputRef={passwordInput}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />

                                <DialogActions sx={{ gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            resetAndClearErrors();
                                            setOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        disabled={processing}
                                        type="submit"
                                        data-test="confirm-delete-user-button"
                                    >
                                        Delete account
                                    </Button>
                                </DialogActions>
                            </Box>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
