import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col text-left min-w-0">
                <p className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.name}
                </p>
                {showEmail && (
                    <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                        {user.email}
                    </p>
                )}
            </div>
        </>
    );
}
