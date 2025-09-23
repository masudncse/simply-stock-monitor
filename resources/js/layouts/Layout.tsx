import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemAvatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Logout,
  Person,
  Lock,
} from '@mui/icons-material';
import { Link, usePage, router } from '@inertiajs/react';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { edit as editPassword } from '@/routes/password';
import { type SharedData } from '@/types';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { text: 'POS', icon: <ShoppingCartIcon />, href: '/pos' },
  { text: 'Products', icon: <InventoryIcon />, href: '/products' },
  { text: 'Stock', icon: <StoreIcon />, href: '/stock' },
  { text: 'Purchases', icon: <ShoppingCartIcon />, href: '/purchases' },
  { text: 'Sales', icon: <AddIcon />, href: '/sales' },
  { text: 'Customers', icon: <PeopleIcon />, href: '/customers' },
  { text: 'Suppliers', icon: <PeopleIcon />, href: '/suppliers' },
  { text: 'Accounts', icon: <AccountBalanceIcon />, href: '/accounts' },
  { text: 'Reports', icon: <AssessmentIcon />, href: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, href: '/settings' },
];

export default function Layout({ children, title = 'Stock Management' }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
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

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Stock Manager
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          
          {/* User Menu */}
          <IconButton
            onClick={handleUserMenuOpen}
            color="inherit"
            sx={{ ml: 2 }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={auth.user.avatar}
              alt={auth.user.name}
            >
              {getInitials(auth.user.name)}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {/* User Info */}
            <MenuItem disabled>
              <ListItemAvatar>
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={auth.user.avatar}
                  alt={auth.user.name}
                >
                  {getInitials(auth.user.name)}
                </Avatar>
              </ListItemAvatar>
              <Box>
                <Typography variant="subtitle2" noWrap>
                  {auth.user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {auth.user.email}
                </Typography>
              </Box>
            </MenuItem>
            
            <Divider />
            
            {/* Profile */}
            <MenuItem 
              component={Link} 
              href={editProfile().url}
              onClick={handleUserMenuClose}
            >
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            
            {/* Change Password */}
            <MenuItem 
              component={Link} 
              href={editPassword().url}
              onClick={handleUserMenuClose}
            >
              <ListItemIcon>
                <Lock fontSize="small" />
              </ListItemIcon>
              Change Password
            </MenuItem>
            
            <Divider />
            
            {/* Logout */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
