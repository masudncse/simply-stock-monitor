import { UserInfo } from '@/components/user-info';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex items-center gap-2 p-2 hover:bg-accent">
            <UserInfo user={auth.user} />
            <ChevronsUpDown className="ml-auto h-4 w-4" />
        </div>
    );
}
