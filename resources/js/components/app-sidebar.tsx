import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <div className="flex w-64 flex-shrink-0 flex-col border-r bg-background">
            <div className="border-b p-2">
                <Link href={dashboard()} prefetch>
                    <AppLogo />
                </Link>
            </div>

            <div className="flex-1 overflow-auto">
                <NavMain items={mainNavItems} />
            </div>

            <div className="mt-auto border-t">
                <NavFooter items={footerNavItems} />
                <NavUser />
            </div>
        </div>
    );
}
