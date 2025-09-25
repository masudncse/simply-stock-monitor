import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <div className="px-2 py-0">
            <div className="px-2 py-1 text-xs font-medium uppercase text-muted-foreground">
                Platform
            </div>
            <nav className="space-y-1">
                {items.map((item) => {
                    const isActive = page.url.startsWith(
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url,
                    );
                    
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive 
                                    ? "bg-accent text-accent-foreground" 
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.icon && (
                                <item.icon className="h-4 w-4" />
                            )}
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}