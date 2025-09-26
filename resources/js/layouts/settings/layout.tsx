import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
    {
        title: 'Company',
        href: '/settings/company',
        icon: null,
    },
    {
        title: 'System',
        href: '/settings/system',
        icon: null,
    },
    {
        title: 'Users',
        href: '/settings/users',
        icon: null,
    },
    {
        title: 'Roles',
        href: '/settings/roles',
        icon: null,
    },
    {
        title: 'Backup',
        href: '/settings/backup',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="p-3">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="flex flex-col gap-3 mt-3 lg:flex-row">
                <div className="w-full lg:w-[200px] lg:max-w-[200px]">
                    <nav className="space-y-1">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = currentPath === (typeof item.href === 'string' ? item.href : item.href.url);
                            return (
                                <Link
                                    key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        isActive 
                                            ? "bg-accent text-accent-foreground" 
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon className="mr-2 h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <Separator orientation="vertical" className="hidden lg:block" />

                <div className="flex-1 max-w-[600px]">
                    <div className="max-w-[600px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
