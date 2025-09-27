import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import Layout from '@/layouts/Layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Layout title="Profile Settings" breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="flex flex-col gap-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name, email address, and profile picture"
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...ProfileController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                encType="multipart/form-data"
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <div className="flex flex-col gap-6">
                                        {/* Avatar Upload */}
                                        <div className="space-y-4">
                                            <Label>Profile Picture</Label>
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Avatar className="h-20 w-20">
                                                        <AvatarImage 
                                                            src={avatarPreview || (auth.user.avatar ? `/storage/${auth.user.avatar}` : null)} 
                                                            alt={auth.user.name} 
                                                        />
                                                        <AvatarFallback className="text-lg">
                                                            {getInitials(auth.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {avatarPreview && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                            onClick={removeAvatar}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        name="avatar"
                                                        accept="image/*"
                                                        onChange={handleAvatarChange}
                                                        className="hidden"
                                                        id="avatar-upload"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        {auth.user.avatar || avatarPreview ? 'Change Picture' : 'Upload Picture'}
                                                    </Button>
                                                    <p className="text-xs text-muted-foreground">
                                                        JPG, PNG or GIF. Max size 2MB.
                                                    </p>
                                                    {errors.avatar && <p className="text-sm text-destructive">{errors.avatar}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={auth.user.name}
                                                    autoComplete="name"
                                                    placeholder="Full name"
                                                />
                                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email address</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={auth.user.email}
                                                    autoComplete="username"
                                                    placeholder="Email address"
                                                />
                                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                            </div>
                                        </div>

                                        {mustVerifyEmail &&
                                            auth.user.email_verified_at === null && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Your email address is unverified.{' '}
                                                        <Link
                                                            href={send()}
                                                            as="button"
                                                            className="text-inherit underline bg-none border-none cursor-pointer"
                                                        >
                                                            Click here to resend the verification email.
                                                        </Link>
                                                    </p>

                                                    {status === 'verification-link-sent' && (
                                                        <Alert className="mt-2">
                                                            <AlertDescription>
                                                                A new verification link has been sent to your email address.
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            )}

                                        <div className="flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                data-test="update-profile-button"
                                            >
                                                Save
                                            </Button>

                                            {recentlySuccessful && (
                                                <p className="text-sm text-muted-foreground">
                                                    Saved
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </Layout>
    );
}
