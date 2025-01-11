// features/daily-activities/components/DailyActivitiesTable.jsx
import React, { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const statusText = {
  PENDING: 'Bekliyor',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
};

const statusVariants = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

export function DailyActivitiesTable({
  data,
  pagination,
  onPageChange,
  onLimitChange,
  onStatusFilter,
  onApprove,
  onReject,
  onEdit,
  isAdmin,
}) {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        item.user?.lastName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, search]);

  const handleContentDisplay = (content) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 50 ? `${plainText.slice(0, 50)}...` : plainText;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          <Select onValueChange={onStatusFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Tarih</TableHead>
              {isAdmin && <TableHead className="whitespace-nowrap">Öğrenci</TableHead>}
              <TableHead className="whitespace-nowrap">İçerik</TableHead>
              <TableHead className="whitespace-nowrap">Durum</TableHead>
              <TableHead className="whitespace-nowrap">Geri Bildirim</TableHead>
              <TableHead className="whitespace-nowrap">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="h-24 text-center text-muted-foreground">
                  {search ? 'Arama kriterlerine uygun staj günlüğü bulunamadı.' : 'Henüz staj günlüğü girilmemiş.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {format(new Date(activity.date), 'd MMMM yyyy', {
                      locale: tr,
                    })}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="whitespace-nowrap">
                      {activity.user.firstName} {activity.user.lastName}
                      <div className="text-sm text-muted-foreground">{activity.user.department}</div>
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">{handleContentDisplay(activity.content)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={statusVariants[activity.status]}>{statusText[activity.status]}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {activity.feedback ? (
                      <span className="text-sm">{activity.feedback}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {((isAdmin && activity.status === 'PENDING') || (!isAdmin && ['PENDING', 'REJECTED'].includes(activity.status))) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isAdmin ? (
                            <>
                              <DropdownMenuItem onClick={() => onApprove(activity.id)}>Onayla</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onReject(activity.id)}>Reddet</DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem onClick={() => onEdit(activity)}>Düzenle</DropdownMenuItem>
                          )}
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Toplam {pagination.total} kayıttan {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} arası gösteriliyor
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={pagination.page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
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
  );
}
