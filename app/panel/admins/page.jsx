import { AdminList } from '@/features/admins/components/AdminList';

export default function AdminsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Yöneticiler</h1>
      <AdminList />
    </div>
  );
}
