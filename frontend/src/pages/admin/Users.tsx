import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Card from '../../components/Card';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

type User = { id?: string; _id?: string; name: string; email: string; role: 'admin' | 'staff' | 'customer' };

const Users: React.FC = () => {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({ name: '', email: '', role: 'customer' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      const data = res.data.items ?? res.data.users ?? [];
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'customer' });
    setIsOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role });
    setIsOpen(true);
  };

  const onSubmit = async () => {
    // Validation
    if (!form.name || !form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!form.email || !form.email.includes('@')) {
      toast.error('Valid email is required');
      return;
    }
    try {
      if (editing) {
        const id = editing._id || editing.id;
        await api.put(`/api/users/${id}`,(form as any));
        toast.success('User updated');
      } else {
        // For demo, create with a default password
        await api.post('/api/users', { ...(form as any), password: 'Password@123' });
        toast.success('User created');
      }
      setIsOpen(false);
      await load();
    } catch (e) {
      toast.error('Failed to save user');
    }
  };

  const onDelete = async (u: User) => {
    try {
      const id = u._id || u.id;
      await api.delete(`/api/users/${id}`);
      toast.success('User deleted');
      await load();
    } catch (e) {
      toast.error('Failed to save user');
    }
  };

  const columns = useMemo(() => ([
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'actions', header: 'Actions', render: (row: any) => (
      <div className="flex gap-2">
        <button className="px-2 py-1 text-xs border rounded" onClick={() => openEdit(row)}>Edit</button>
        <button className="px-2 py-1 text-xs border rounded text-red-600" onClick={() => onDelete(row)}>Delete</button>
      </div>
    ) }
  ]), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={openCreate}>New User</button>
      </div>
      <Card>
        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <DataTable columns={columns as any} data={items as any} />
        )}
      </Card>

      <Modal title={editing ? 'Edit User' : 'Create User'} isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={onSubmit} submitText={editing ? 'Save' : 'Create'}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!editing && (
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input className="w-full border rounded px-3 py-2" type="password" defaultValue="Password@123" readOnly />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select className="w-full border rounded px-3 py-2" value={form.role as any} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;


