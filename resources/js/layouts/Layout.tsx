import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { edit as editPassword } from '@/routes/password';
import { type SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAppearance, type PrimaryColor } from '@/hooks/use-appearance';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/toast';
import { useInertiaToast } from '@/hooks/use-inertia-toast';
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
  FileText as FileTextIcon,
  Plus as AddIcon,
  LogOut,
  User,
  Lock,
  Search as SearchIcon,
  Bell,
  Check,
  X,
  Sun,
  Moon,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  AlertTriangle,
  AlertCircle,
  Undo2 as ReturnIcon,
  Receipt as ExpenseIcon,
  Wallet as PaymentIcon,
  Landmark as BankIcon,
  ArrowLeftRight as TransactionIcon,
  Truck as ShipmentIcon,
} from 'lucide-react';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const menuItems = [
  // Main
  { text: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" />, href: '/dashboard', section: 'main' },
  { text: 'POS', icon: <ShoppingCartIcon className="h-5 w-5" />, href: '/pos', section: 'main' },
  
  // Inventory
  { text: 'Products', icon: <InventoryIcon className="h-5 w-5" />, href: '/products', section: 'Inventory' },
  { text: 'Stock', icon: <StoreIcon className="h-5 w-5" />, href: '/stock', section: 'Inventory' },
  { text: 'Warehouses', icon: <StoreIcon className="h-5 w-5" />, href: '/warehouses', section: 'Inventory' },
  
  // Transactions
  { text: 'Purchases', icon: <ShoppingCartIcon className="h-5 w-5" />, href: '/purchases', section: 'Transactions' },
  { text: 'Sales', icon: <AddIcon className="h-5 w-5" />, href: '/sales', section: 'Transactions' },
  { text: 'Quotations', icon: <FileTextIcon className="h-5 w-5" />, href: '/quotations', section: 'Transactions' },
  { text: 'Sale Returns', icon: <ReturnIcon className="h-5 w-5" />, href: '/sale-returns', section: 'Transactions' },
  { text: 'Purchase Returns', icon: <ReturnIcon className="h-5 w-5" />, href: '/purchase-returns', section: 'Transactions' },
  { text: 'Shipments', icon: <ShipmentIcon className="h-5 w-5" />, href: '/shipments', section: 'Transactions' },
  
  // Contacts
  { text: 'Customers', icon: <PeopleIcon className="h-5 w-5" />, href: '/customers', section: 'Contacts' },
  { text: 'Suppliers', icon: <PeopleIcon className="h-5 w-5" />, href: '/suppliers', section: 'Contacts' },
  
  // Accounting
  { text: 'Accounts', icon: <AccountBalanceIcon className="h-5 w-5" />, href: '/accounts', section: 'Accounting' },
  { text: 'Payments', icon: <PaymentIcon className="h-5 w-5" />, href: '/payments', section: 'Accounting' },
  { text: 'Expenses', icon: <ExpenseIcon className="h-5 w-5" />, href: '/expenses', section: 'Accounting' },
  { text: 'Transactions', icon: <TransactionIcon className="h-5 w-5" />, href: '/transactions', section: 'Accounting' },
  { text: 'Bank Transactions', icon: <BankIcon className="h-5 w-5" />, href: '/bank-transactions', section: 'Accounting' },
  
  // Reports & Settings
  { text: 'Reports', icon: <AssessmentIcon className="h-5 w-5" />, href: '/reports', section: 'System' },
  { text: 'Settings', icon: <SettingsIcon className="h-5 w-5" />, href: '/settings', section: 'System' },
];

function LayoutContent({ children, title = 'Stock Management', breadcrumbs = [] }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      // Default to collapsed (true) if no saved preference
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const { auth, company } = usePage<SharedData>().props;
  const { appearance, updateAppearance, primaryColor, updatePrimaryColor } = useAppearance();
  const { toasts, removeToast } = useToast();
  
  // Set browser tab title
  useEffect(() => {
    const appName = company?.name || 'Stock Management';
    const fullTitle = `${title} - ${appName}`;
    
    // Set the title immediately
    document.title = fullTitle;
    
    // Use MutationObserver to watch for title changes and restore our title
    const observer = new MutationObserver(() => {
      if (document.title !== fullTitle) {
        document.title = fullTitle;
      }
    });
    
    // Observe changes to the document head
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Also set up an interval as a fallback to ensure title stays correct
    const titleInterval = setInterval(() => {
      if (document.title !== fullTitle) {
        document.title = fullTitle;
      }
    }, 100);
    
    // Cleanup function
    return () => {
      observer.disconnect();
      clearInterval(titleInterval);
      // Don't reset title on unmount to avoid flashing
    };
  }, [title, company?.name]);
  
  // Automatically show toasts from Inertia responses
  useInertiaToast();
  
  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };
  
  // Dynamic notification data
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Load notifications
  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await fetch('/notifications');
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      router.post(`/notifications/${notificationId}/mark-read`, {}, {
        preserveState: true,
        onSuccess: (page) => {
          // Update local state optimistically
          setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
          );
          setUnreadCount(prev => Math.max(0, prev - 1));
        },
        onError: (errors) => {
          console.error('Failed to mark notification as read:', errors);
        }
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      router.post('/notifications/mark-all-read', {}, {
        preserveState: true,
        onSuccess: (page) => {
          // Update local state optimistically
          setUnreadCount(0);
          setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
          );
        },
        onError: (errors) => {
          console.error('Failed to mark all notifications as read:', errors);
        }
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      router.delete(`/notifications/${notificationId}`, {
        preserveState: true,
        onSuccess: (page) => {
          // Update local state optimistically
          setNotifications(prev => prev.filter(n => n.id !== notificationId));
          // Update unread count
          const deletedNotification = notifications.find(n => n.id === notificationId);
          if (deletedNotification && !deletedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        },
        onError: (errors) => {
          console.error('Failed to delete notification:', errors);
        }
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

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

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
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

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center py-4 border-b",
        collapsed ? "px-2 justify-center" : "px-6"
      )}>
        {collapsed ? (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
            {company.logo ? (
              <img 
                src={`/storage/${company.logo}`} 
                alt={company.name || 'Company Logo'} 
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-primary-foreground font-bold text-sm">
                {company.name ? company.name.charAt(0).toUpperCase() : 'S'}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {company.logo && (
              <img 
                src={`/storage/${company.logo}`} 
                alt={company.name || 'Company Logo'} 
                className="w-8 h-8 object-contain"
              />
            )}
            <h2 className="text-xl font-semibold text-foreground">
              {company.name || 'Stock Manager'}
            </h2>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-4 overflow-y-auto",
        collapsed ? "px-2" : "px-4"
      )}>
        {(() => {
          const sections = ['main', 'Inventory', 'Transactions', 'Contacts', 'Accounting', 'System'];
          let currentSection = '';
          
          return menuItems.map((item, index) => {
            const showSectionHeader = item.section !== currentSection && item.section !== 'main' && !collapsed;
            currentSection = item.section;
            
            return (
              <div key={item.text}>
                {showSectionHeader && (
                  <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    collapsed ? "px-2 py-2 justify-center mb-1" : "px-3 py-2 space-x-3 mb-1"
                  )}
                  title={collapsed ? item.text : undefined}
                >
                  {item.icon}
                  {!collapsed && <span>{item.text}</span>}
                </Link>
              </div>
            );
          });
        })()}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className={cn(
        "md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300",
        sidebarCollapsed ? "md:w-16" : "md:w-60"
      )}>
        <div className="flex flex-col h-full border-r bg-card">
          <SidebarContent collapsed={sidebarCollapsed} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300",
        sidebarCollapsed ? "md:pl-16" : "md:pl-60"
      )}>
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

          {/* Sidebar Toggle - Desktop Only */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-6 w-6" />
            ) : (
              <PanelLeftClose className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <div className="relative max-w-md w-full">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {(() => {
                  // Check if there are any warning/critical notifications
                  const hasWarningNotifications = notifications.some(n => 
                    !n.read && (n.type === 'low_stock' || n.type === 'expired_product' || n.data?.severity === 'warning')
                  );
                  const hasErrorNotifications = notifications.some(n => 
                    !n.read && n.data?.severity === 'error'
                  );
                  
                  if (hasErrorNotifications) {
                    return <AlertCircle className="h-5 w-5 text-red-500" />;
                  } else if (hasWarningNotifications) {
                    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
                  }
                  return <Bell className="h-5 w-5" />;
                })()}
                {unreadCount > 0 && (
                  <Badge 
                    variant={(() => {
                      const hasWarningNotifications = notifications.some(n => 
                        !n.read && (n.type === 'low_stock' || n.type === 'expired_product' || n.data?.severity === 'warning')
                      );
                      const hasErrorNotifications = notifications.some(n => 
                        !n.read && n.data?.severity === 'error'
                      );
                      
                      if (hasErrorNotifications) return "destructive";
                      if (hasWarningNotifications) return "secondary";
                      return "destructive";
                    })()}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => {
                    // Get appropriate icon based on notification type
                    const getNotificationIcon = (type: string, severity: string) => {
                      if (type === 'low_stock') {
                        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
                      } else if (type === 'expired_product') {
                        return <AlertCircle className="h-4 w-4 text-red-500" />;
                      } else if (severity === 'warning') {
                        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
                      } else if (severity === 'error') {
                        return <AlertCircle className="h-4 w-4 text-red-500" />;
                      }
                      return <Bell className="h-4 w-4 text-blue-500" />;
                    };

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                          !notification.read && "bg-muted/30"
                        )}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            {/* Notification Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type, notification.data?.severity)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time_ago}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={loadNotifications}
                  >
                    Refresh notifications
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {appearance === 'light' ? (
                  <Sun className="h-4 w-4" />
                ) : appearance === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Monitor className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-semibold">Theme</div>
              <DropdownMenuItem onClick={() => updateAppearance('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateAppearance('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm font-semibold">Primary Color</div>
              <div className="grid grid-cols-4 gap-1 p-2">
                {(['blue', 'green', 'purple', 'red', 'orange', 'pink', 'indigo', 'teal', 'cyan', 'emerald', 'lime', 'amber', 'violet', 'rose', 'slate'] as PrimaryColor[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => updatePrimaryColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
                      primaryColor === color ? "border-foreground" : "border-muted-foreground/30"
                    )}
                    style={{
                      backgroundColor: `hsl(var(--${color === 'blue' ? 'primary' : color}))`
                    }}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={auth.user.avatar ? `/storage/${auth.user.avatar}` : undefined} alt={auth.user.name} />
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

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="border-b bg-background px-4 py-3 sm:px-6 lg:px-8">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-secondary">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function Layout(props: LayoutProps) {
  return (
    <ToastProvider>
      <LayoutContent {...props} />
    </ToastProvider>
  );
}
