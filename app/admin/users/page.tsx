'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';

export default function UsersListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EDITOR' });
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data?.users) {
        setUsers(data.users);
        setRoles(data.roles || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMsg(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg({ text: data.error || 'Failed to create user.', type: 'error' });
        return;
      }
      setActionMsg({ text: `User ${formData.name} successfully created!`, type: 'success' });
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'EDITOR' });
      fetchUsers();
    } catch (err: any) {
      setActionMsg({ text: 'Network error.', type: 'error' });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roleName: newRole }),
      });
      if (res.ok) {
        setActionMsg({ text: 'Role updated successfully.', type: 'success' });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user ${userName}?`)) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to delete user.');
        return;
      }
      setActionMsg({ text: `User ${userName} deleted.`, type: 'success' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-editorialBorder pb-5">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                <Users size={22} />
              </div>
              <h1 className="font-serif font-bold text-2xl text-editorialText-primary">
                Users List & Access Control
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-editorialText-secondary mt-1">
              Manage journalists, senior editors, authors, and system administrators registered in the PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-brand hover:bg-emerald-hover text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
            >
              <UserPlus size={16} />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Action notification */}
        {actionMsg && (
          <div
            className={`p-3.5 rounded-lg text-xs sm:text-sm flex items-center justify-between ${
              actionMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{actionMsg.text}</span>
            <button onClick={() => setActionMsg(null)} className="text-gray-500 hover:text-black">
              &times;
            </button>
          </div>
        )}

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-editorialBorder shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand focus:ring-1 focus:ring-emerald-brand"
            />
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-gray-600">
            <span>Total Accounts: <strong className="text-editorialText-primary">{users.length}</strong></span>
            <span>Active: <strong className="text-emerald-brand">{users.filter((u) => u.isActive).length}</strong></span>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-editorialBorder shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAFBFB] text-gray-600 font-semibold border-b border-editorialBorder uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Articles Authored</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorialBorder">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-editorialText-primary">{u.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5 flex items-center space-x-1">
                          <Mail size={12} className="text-gray-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      {/* Role selection dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role.name}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-xs font-semibold px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-800 hover:border-emerald-brand focus:outline-none"
                        >
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="AUTHOR">AUTHOR</option>
                        </select>
                      </td>

                      {/* Articles Count */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                          <BookOpen size={11} className="text-emerald-brand" />
                          <span>{u.author?._count?.articles ?? 0} stories</span>
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 size={13} className="text-emerald-brand" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-red-600 text-xs font-medium">
                            <XCircle size={13} />
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-gray-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Delete Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-editorialBorder pb-3">
                <h3 className="font-serif font-bold text-lg text-editorialText-primary">
                  Register New Editorial User
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-black font-bold text-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@nesturejournal.com"
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                  >
                    <option value="EDITOR">EDITOR — Review and publish news</option>
                    <option value="AUTHOR">AUTHOR — Draft real estate content</option>
                    <option value="ADMIN">ADMIN — Full website management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password (min. 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-sm border border-editorialBorder rounded-lg focus:outline-none focus:border-emerald-brand"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-brand hover:bg-emerald-hover text-white rounded-lg text-xs font-semibold shadow-sm"
                  >
                    Create User Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
