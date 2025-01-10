import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useDeleteAdmin } from '../queries/useAdmin';

export function AdminDeleteDialog({ admin, isOpen, onClose }) {
  const deleteAdmin = useDeleteAdmin();

  const handleDelete = async () => {
    try {
      await deleteAdmin.mutateAsync(admin.id);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yöneticiyi Sil</DialogTitle>
          <DialogDescription>
            <span className="font-medium">
              {admin?.firstName} {admin?.lastName}
            </span>{' '}
            isimli yöneticiyi silmek istediğinize emin misiniz?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sil
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
