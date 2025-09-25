import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon } from 'lucide-react';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 flex-shrink-0 items-center gap-2 border-b px-3">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 -ml-1">
                    <MenuIcon className="h-4 w-4" />
                </Button>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
