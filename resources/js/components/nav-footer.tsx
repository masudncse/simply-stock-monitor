import { type NavItem } from '@/types';

export function NavFooter({
    items,
}: {
    items: NavItem[];
}) {
    return (
        <nav className="space-y-1">
            {items.map((item) => (
                <a
                    key={item.title}
                    href={
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    {item.icon && (
                        <item.icon className="h-5 w-5" />
                    )}
                    <span>{item.title}</span>
                </a>
            ))}
        </nav>
    );
}
