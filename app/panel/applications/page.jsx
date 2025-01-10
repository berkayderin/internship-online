'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import { ApplicationDialog } from '@/features/applications/components/ApplicationDialog';
import { ApplicationTableSkeleton } from '@/features/applications/components/ApplicationTableSkeleton';
import {
  useApplications,
  useBulkUpdateApplications,
  useDeleteApplication,
  useUpdateApplication,
  useUpdateApplicationByUser,
} from '@/features/applications/queries/useApplication';

import { toast } from '@/hooks/use-toast';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Building, Calendar, CheckCircle, Info, Users2, XCircle } from 'lucide-react';

const statusText = {
  PENDING: 'Beklemede',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
};

const statusVariants = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

export default function ApplicationsPage() {
  const session = useSession();
  const isAdmin = session?.data?.user?.role === 'ADMIN';
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [actionType, setActionType] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editApplication, setEditApplication] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const { data: applications } = useApplications();
  const updateApplication = useUpdateApplication();
  const bulkUpdateApplications = useBulkUpdateApplications();
  const deleteApplication = useDeleteApplication();
  const updateApplicationByUser = useUpdateApplicationByUser();

  const canManageApplication = (application) => {
    if (!isAdmin) {
      return application.userId === session?.data?.user?.id;
    }
    return application.userId !== session?.data?.user?.id;
  };

  const manageableApplications = applications?.filter(canManageApplication) || [];

  const handleAction = (application, type) => {
    if (!canManageApplication(application)) {
      toast({
        title: 'Hata',
        description: 'Kendi başvurunuzu onaylayamazsınız',
        variant: 'destructive',
      });
      return;
    }

    setSelectedApplication(application);
    setActionType(type);
    setFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      await updateApplication.mutateAsync({
        id: selectedApplication.id,
        data: {
          status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
          feedback,
        },
      });
      setFeedbackDialogOpen(false);
      setFeedback('');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBulkAction = (type) => {
    setActionType(type);
    setFeedbackDialogOpen(true);
  };

  const handleBulkSubmit = async () => {
    try {
      await bulkUpdateApplications.mutateAsync({
        ids: selectedIds,
        data: {
          status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
          feedback,
        },
      });
      setFeedbackDialogOpen(false);
      setFeedback('');
      setSelectedIds([]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (application) => {
    setEditApplication(application);
  };

  const handleSubmit = async (data) => {
    try {
      await updateApplicationByUser.mutateAsync({
        id: editApplication.id,
        data: data,
      });
      setEditApplication(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteClick = (application) => {
    setApplicationToDelete(application);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteApplication.mutateAsync(applicationToDelete.id);
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staj Başvuruları</h1>
        {isAdmin && selectedIds.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleBulkAction('approve')}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Seçilenleri Onayla
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleBulkAction('reject')}>
              <XCircle className="mr-1 h-4 w-4" />
              Seçilenleri Reddet
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isAdmin && <TableHead className="w-12" />}
              <TableHead>Öğrenci</TableHead>
              <TableHead>Şirket Bilgileri</TableHead>
              <TableHead>Staj Dönemi</TableHead>
              <TableHead>Başvuru Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Geri Bildirim</TableHead>
              {isAdmin ? <TableHead>İşlemler</TableHead> : <TableHead>İşlemler</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!applications ? (
              <ApplicationTableSkeleton isAdmin={isAdmin} />
            ) : (isAdmin ? manageableApplications : applications).length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center text-muted-foreground">
                  Henüz hiç başvuru bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              (isAdmin ? manageableApplications : applications).map((application) => (
                <TableRow key={application.id}>
                  {isAdmin && (
                    <TableCell>
                      {application.status === 'PENDING' && (
                        <Checkbox
                          checked={selectedIds.includes(application.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds([...selectedIds, application.id]);
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== application.id));
                            }
                          }}
                        />
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {application.user?.firstName} {application.user?.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 font-medium">
                        <Building className="h-4 w-4" />
                        {application.companyName}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users2 className="h-4 w-4" />
                        {application.companyEmployeeCount} Çalışan ({application.companyEngineerCount} Mühendis)
                      </div>
                      {application.companyWebsite && (
                        <div className="text-sm text-blue-600">
                          <a href={application.companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{application.period.name}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span>Staj Başlangıç: </span>
                            {format(new Date(application.internshipStartDate), 'd MMM yyyy', {
                              locale: tr,
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Staj Bitiş: </span>
                            {format(new Date(application.internshipEndDate), 'd MMM yyyy', {
                              locale: tr,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.createdAt), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[application.status]}>{statusText[application.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {application.status === 'REJECTED' && application.feedback ? (
                      <span className="text-sm text-muted-foreground">{application.feedback}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        {application.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleAction(application, 'approve')}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Onayla
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleAction(application, 'reject')}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reddet
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {!isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        {!isAdmin && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(application)}>
                              Düzenle
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(application)}
                            >
                              Sil
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {isAdmin && (
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedIds.length > 1 ? 'Toplu ' : ''}
                {actionType === 'approve' ? 'Başvuru Onaylama' : 'Başvuru Reddetme'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea placeholder="Geri bildiriminizi yazın..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
              <div className="flex justify-end">
                <Button onClick={selectedIds.length > 1 ? handleBulkSubmit : handleSubmitFeedback}>
                  {actionType === 'approve' ? 'Onayla' : 'Reddet'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {editApplication && (
        <ApplicationDialog
          open={!!editApplication}
          onOpenChange={() => setEditApplication(null)}
          periodId={editApplication.periodId}
          initialData={editApplication}
          mode="edit"
          onSubmit={handleSubmit}
        />
      )}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Başvuru Silme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Bu başvuruyu silmek istediğinizden emin misiniz?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Sil
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
