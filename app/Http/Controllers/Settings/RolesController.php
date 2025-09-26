<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolesController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->paginate(10);
        $permissions = Permission::all();
        
        return Inertia::render('Settings/Roles', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function create()
    {
        $permissions = Permission::all();
        
        return Inertia::render('Settings/Roles/Create', [
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'permissions' => 'array',
        ]);

        try {
            $role = Role::create([
                'name' => $request->name,
            ]);

            if ($request->permissions) {
                $role->syncPermissions($request->permissions);
            }

            return redirect()->route('settings.roles')->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create role: ' . $e->getMessage());
        }
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all();
        
        return Inertia::render('Settings/Roles/Edit', [
            'role' => $role->load('permissions'),
            'permissions' => $permissions
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        try {
            $role->update([
                'name' => $request->name,
            ]);

            if ($request->permissions) {
                $role->syncPermissions($request->permissions);
            }

            return back()->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update role: ' . $e->getMessage());
        }
    }

    public function destroy(Role $role)
    {
        try {
            // Check if role has users
            if ($role->users()->count() > 0) {
                return back()->with('error', 'Cannot delete role that is assigned to users.');
            }

            $role->delete();
            return back()->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete role: ' . $e->getMessage());
        }
    }
}
