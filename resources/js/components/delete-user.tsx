import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <HeadingSmall
                title="Delete account"
                description="Delete your account and all of its resources"
            />
            
            <Alert variant="destructive">
                <AlertDescription>
                    <div className="mb-2">
                        <strong>Warning</strong>
                    </div>
                    <div className="mb-4">
                        Please proceed with caution, this cannot be undone.
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                onClick={() => setOpen(true)}
                                data-test="delete-user-button"
                            >
                                Delete account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Are you sure you want to delete your account?
                                </DialogTitle>
                                <DialogDescription>
                                    Once your account is deleted, all of its resources
                                    and data will also be permanently deleted. Please
                                    enter your password to confirm you would like to
                                    permanently delete your account.
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...ProfileController.destroy.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                onError={() => passwordInput.current?.focus()}
                                resetOnSuccess
                            >
                                {({ resetAndClearErrors, processing, errors }) => (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                ref={passwordInput}
                                                placeholder="Password"
                                                autoComplete="current-password"
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-destructive">{errors.password}</p>
                                            )}
                                        </div>

                                        <DialogFooter className="gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    resetAndClearErrors();
                                                    setOpen(false);
                                                }}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                disabled={processing}
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Delete account
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </AlertDescription>
            </Alert>
        </div>
    );
}
