import React from 'react';
import { router } from '@inertiajs/react';
import UsersIndex from './Users/Index';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles: Array<{
    id: number;
    name: string;
  }>;
}

interface UsersProps {
  users: {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function SettingsUsers({ users }: UsersProps) {
  return <UsersIndex users={users} />;
}
