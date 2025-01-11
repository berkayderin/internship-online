// features/student-activities/components/StudentActivities.jsx
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, FileDown, FileText } from 'lucide-react';

import { statusText, statusVariants } from './ActivityDetailModal';
import { BulkRejectModal } from './BulkRejectModal';
import { StudentActivitiesSkeleton } from './StudentActivitiesSkeleton';

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  pageCount: 1,
};

const StudentActivities = ({
  student,
  activities = [],
  pagination = defaultPagination,
  selectedActivities = [],
  onSelectActivity,
  onSelectAll,
  onBulkApprove,
  onBulkReject,
  onBack,
  onViewDetails,
  onApprove,
  onReject,
  onPageChange,
  onLimitChange,
  onStatusFilter,
  onSearch,
  onGenerateReport,
  onGenerateSummary,
  isLoading,
  isSummarizing,
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  if (isLoading) {
    return <StudentActivitiesSkeleton />;
  }

  const pendingActivities = activities.filter((activity) => activity.status === 'PENDING');
  const allPendingSelected =
    pendingActivities.length > 0 && pendingActivities.every((activity) => selectedActivities.includes(activity.id));

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const pendingActivityIds = activities.filter((activity) => activity.status === 'PENDING').map((activity) => activity.id);
      setSelectedActivities(pendingActivityIds);
    } else {
      setSelectedActivities([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {student && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
          )}
          <h1 className="text-2xl font-bold">
            {student ? `${student.firstName} ${student.lastName} - Staj Aktiviteleri` : 'Tüm Öğrenci Aktiviteleri'}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col items-start gap-2 sm:flex-row sm:items-center">
          <div className="w-full" style={{ maxWidth: '240px' }}>
            <Input placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />
          </div>
          <div className="w-full" style={{ maxWidth: '140px' }}>
            <Select onValueChange={onStatusFilter} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Duruma göre filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="PENDING">Bekleyenler</SelectItem>
                <SelectItem value="APPROVED">Onaylananlar</SelectItem>
                <SelectItem value="REJECTED">Reddedilenler</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {pendingActivities.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={selectedActivities.length === 0}>
                  Toplu İşlemler
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={onBulkApprove}>Seçilenleri Onayla</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowRejectModal(true)}>Seçilenleri Reddet</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="ml-auto flex flex-col gap-2 sm:flex-row">
          {student && (
            <>
              <Button className="w-full sm:w-auto" onClick={onGenerateReport} disabled={isLoading}>
                <FileDown className="mr-2 h-4 w-4" />
                Rapor Oluştur
              </Button>
              <Button className="w-full sm:w-auto" onClick={onGenerateSummary} disabled={isLoading || isSummarizing}>
                <FileText className="mr-2 h-4 w-4" />
                {isSummarizing ? 'Özetleniyor...' : 'Özetle'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {pendingActivities.length > 0 && (
                <TableHead className="w-[40px]">
                  <Checkbox checked={allPendingSelected} onCheckedChange={onSelectAll} aria-label="Tümünü seç" />
                </TableHead>
              )}
              <TableHead className="w-[150px]">Tarih</TableHead>
              <TableHead className="w-[200px]">Öğrenci</TableHead>
              <TableHead>İçerik</TableHead>
              <TableHead className="w-[120px]">Durum</TableHead>
              <TableHead className="w-[200px]">Geri Bildirim</TableHead>
              <TableHead className="w-[80px]">Detay</TableHead>
              <TableHead className="w-[80px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!activities?.length ? (
              <TableRow>
                <TableCell colSpan={pendingActivities.length > 0 ? 8 : 7} className="h-24 text-center text-muted-foreground">
                  Henüz hiç aktivite bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              activities?.map((activity) => (
                <TableRow key={activity.id}>
                  {pendingActivities.length > 0 && (
                    <TableCell>
                      {activity.status === 'PENDING' && (
                        <Checkbox
                          checked={selectedActivities.includes(activity.id)}
                          onCheckedChange={(checked) => onSelectActivity(activity.id, checked)}
                          aria-label="Aktiviteyi seç"
                        />
                      )}
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(activity.date), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell>
                    {activity.user.firstName} {activity.user.lastName}
                    <div className="text-sm text-muted-foreground">{activity.user.department}</div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {activity.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                    ...
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[activity.status]}>{statusText[activity.status]}</Badge>
                  </TableCell>
                  <TableCell>{activity.feedback || <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(activity)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {activity.status === 'PENDING' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onApprove(activity.id)}>Onayla</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReject(activity.id)}>Reddet</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full bg-white">
        <div className="flex flex-row items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            Toplam {pagination.total} kayıttan {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} arası gösteriliyor
          </div>

          <div className="flex flex-col items-center gap-2 sm:ml-auto sm:flex-row">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={pagination.page === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Sayfa {pagination.page} / {pagination.pageCount}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pageCount}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.pageCount)}
                disabled={pagination.page === pagination.pageCount}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
            <Select onValueChange={onLimitChange} defaultValue="10">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sayfa başına" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 kayıt</SelectItem>
                <SelectItem value="10">10 kayıt</SelectItem>
                <SelectItem value="20">20 kayıt</SelectItem>
                <SelectItem value="50">50 kayıt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <BulkRejectModal open={showRejectModal} onOpenChange={setShowRejectModal} onConfirm={onBulkReject} />
    </div>
  );
};

export { StudentActivities };
