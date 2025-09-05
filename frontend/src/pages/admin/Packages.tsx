import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Card from '../../components/Card';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

type Package = { _id?: string; id?: string; name: string; type: 'monthly' | 'yearly' | 'custom'; price: number; isActive?: boolean };

const Packages: React.FC = () => {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<Partial<Package>>({ name: '', type: 'monthly', price: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/packages');
      setItems(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', type: 'monthly', price: 0 });
    setIsOpen(true);
  };

  const openEdit = (p: Package) => {
    setEditing(p);
    setForm({ name: p.name, type: p.type, price: p.price });
    setIsOpen(true);
  };

  const onSubmit = async () => {
    // Validation
    if (!form.name || !form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (form.price == null || Number(form.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    try {
      if (editing) {
        const id = editing._id || editing.id;
        await api.put(`/api/packages/${id}`,(form as any));
        toast.success('Package updated');
      } else {
        await api.post('/api/packages', (form as any));
        toast.success('Package created');
      }
      setIsOpen(false);
      await load();
    } catch (e) {
      toast.error('Failed to save package');
    }
  };

  const onArchive = async (p: Package) => {
    try {
      const id = p._id || p.id;
      if ((api as any).delete) {
        await api.delete(`/api/packages/${id}`);
      } else {
        await api.put(`/api/packages/${id}`, { isActive: false });
      }
      toast.success('Package archived');
      await load();
    } catch (e) {
      toast.error('Failed to save package');
    }
  };

  const columns = useMemo(() => ([
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'price', header: 'Price', render: (row: any) => `$${row.price?.toFixed(2)}` },
    { key: 'isActive', header: 'Status', render: (row: any) => (row.isActive === false ? 'Archived' : 'Active') },
    { key: 'actions', header: 'Actions', render: (row: any) => (
      <div className="flex gap-2">
        <button className="px-2 py-1 text-xs border rounded" onClick={() => openEdit(row)}>Edit</button>
        <button className="px-2 py-1 text-xs border rounded text-red-600" onClick={() => onArchive(row)}>Archive</button>
      </div>
    ) }
  ]), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Packages</h1>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={openCreate}>New Package</button>
      </div>
      <Card>
        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <DataTable columns={columns as any} data={items as any} />
        )}
      </Card>

      <Modal title={editing ? 'Edit Package' : 'Create Package'} isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={onSubmit} submitText={editing ? 'Save' : 'Create'}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select className="w-full border rounded px-3 py-2" value={form.type as any} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input className="w-full border rounded px-3 py-2" type="number" min="0" step="0.01" value={form.price as any} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Packages;


