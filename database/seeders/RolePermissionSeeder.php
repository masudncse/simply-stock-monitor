<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // Product permissions
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            
            // Stock permissions
            'view-stock',
            'adjust-stock',
            'transfer-stock',
            
            // Purchase permissions
            'view-purchases',
            'create-purchases',
            'edit-purchases',
            'delete-purchases',
            'approve-purchases',
            
            // Sale permissions
            'view-sales',
            'create-sales',
            'edit-sales',
            'delete-sales',
            'approve-sales',
            'process-sales',
            
            // Customer permissions
            'view-customers',
            'create-customers',
            'edit-customers',
            'delete-customers',
            
            // Supplier permissions
            'view-suppliers',
            'create-suppliers',
            'edit-suppliers',
            'delete-suppliers',
            
            // Warehouse permissions
            'view-warehouses',
            'create-warehouses',
            'edit-warehouses',
            'delete-warehouses',
            
            // Account permissions
            'view-accounts',
            'create-accounts',
            'edit-accounts',
            'delete-accounts',
            
            // Payment permissions
            'view-payments',
            'create-payments',
            'edit-payments',
            'delete-payments',
            
            // Expense permissions
            'view-expenses',
            'create-expenses',
            'edit-expenses',
            'delete-expenses',
            
            // Report permissions
            'view-reports',
            'export-reports',
            
            // User management permissions
            'view-users',
            'create-users',
            'edit-users',
            'delete-users',
            'assign-roles',
            
            // Settings permissions
            'view-settings',
            'edit-settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::create(['name' => 'Admin']);
        $salesRole = Role::create(['name' => 'Sales']);
        $storekeeperRole = Role::create(['name' => 'Storekeeper']);
        $accountantRole = Role::create(['name' => 'Accountant']);

        // Assign all permissions to admin
        $adminRole->givePermissionTo(Permission::all());

        // Assign specific permissions to other roles
        $salesRole->givePermissionTo([
            'view-products',
            'view-stock',
            'view-sales',
            'create-sales',
            'edit-sales',
            'approve-sales',
            'process-sales',
            'view-customers',
            'create-customers',
            'edit-customers',
            'view-warehouses',
            'view-reports',
            'export-reports',
        ]);

        $storekeeperRole->givePermissionTo([
            'view-products',
            'create-products',
            'edit-products',
            'view-stock',
            'adjust-stock',
            'transfer-stock',
            'view-purchases',
            'create-purchases',
            'edit-purchases',
            'approve-purchases',
            'view-suppliers',
            'create-suppliers',
            'edit-suppliers',
            'view-warehouses',
            'create-warehouses',
            'edit-warehouses',
            'delete-warehouses',
            'view-reports',
        ]);

        $accountantRole->givePermissionTo([
            'view-accounts',
            'create-accounts',
            'edit-accounts',
            'view-payments',
            'create-payments',
            'edit-payments',
            'view-expenses',
            'create-expenses',
            'edit-expenses',
            'view-reports',
            'export-reports',
        ]);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $admin->assignRole('Admin');
    }
}