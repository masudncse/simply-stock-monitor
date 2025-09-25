import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { edit as editPassword } from '@/routes/password';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Menu as MenuIcon,
  LayoutDashboard as DashboardIcon,
  Package as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  Users as PeopleIcon,
  CreditCard as AccountBalanceIcon,
  BarChart3 as AssessmentIcon,
  Settings as SettingsIcon,
  Plus as AddIcon,
  LogOut,
  User,
  Lock,
} from 'lucide-react';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" />, href: '/dashboard' },
  { text: 'POS', icon: <ShoppingCartIcon className="h-5 w-5" />, href: '/pos' },
  { text: 'Products', icon: <InventoryIcon className="h-5 w-5" />, href: '/products' },
  { text: 'Stock', icon: <StoreIcon className="h-5 w-5" />, href: '/stock' },
  { text: 'Purchases', icon: <ShoppingCartIcon className="h-5 w-5" />, href: '/purchases' },
  { text: 'Sales', icon: <AddIcon className="h-5 w-5" />, href: '/sales' },
  { text: 'Customers', icon: <PeopleIcon className="h-5 w-5" />, href: '/customers' },
  { text: 'Suppliers', icon: <PeopleIcon className="h-5 w-5" />, href: '/suppliers' },
  { text: 'Accounts', icon: <AccountBalanceIcon className="h-5 w-5" />, href: '/accounts' },
  { text: 'Reports', icon: <AssessmentIcon className="h-5 w-5" />, href: '/reports' },
  { text: 'Settings', icon: <SettingsIcon className="h-5 w-5" />, href: '/settings' },
];

export default function Layout({ children, title = 'Stock Management' }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { auth } = usePage<SharedData>().props;

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Force a re-render when navigating back/forward
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handlePopState);

    // Listen for Inertia navigation events
    const handleInertiaFinish = () => {
      // Ensure components are properly rendered after navigation
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    };

    document.addEventListener('inertia:finish', handleInertiaFinish);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('inertia:finish', handleInertiaFinish);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    router.post(logout().url);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-foreground">Stock Manager</h2>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.text}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground focus:outline-none"
            )}
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="md:flex md:w-60 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-card">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:pl-60">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Page title */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                  <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {/* User Info */}
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{auth.user.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {auth.user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              
              {/* Profile */}
              <DropdownMenuItem asChild>
                <Link href={editProfile().url} className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              
              {/* Change Password */}
              <DropdownMenuItem asChild>
                <Link href={editPassword().url} className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Logout */}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
