import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <div className="p-2">
                <UserInfo user={user} showEmail={true} />
            </div>
            <div className="border-t" />
            <Link 
                href={edit()} 
                onClick={cleanup}
                className="flex items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            >
                <Settings className="mr-2 h-4 w-4" />
                Settings
            </Link>
            <div className="border-t" />
            <Link 
                href={logout()} 
                onClick={handleLogout} 
                data-test="logout-button"
                className="flex items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
            </Link>
        </>
    );
}
