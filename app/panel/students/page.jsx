'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { StudentsPageSkeleton } from '@/features/student-activities/components/StudentsPageSkeleton';
import { useDeleteStudent, useStudents } from '@/features/student-activities/queries/useStudentQueries';

import { Eye, MoreHorizontal, Search, Trash2, X } from 'lucide-react';

const DEPARTMENTS = [
  { value: 'all', label: 'Tüm Bölümler' },
  {
    value: 'Bilişim Sistemleri Mühendisliği',
    label: 'Bilişim Sistemleri Mühendisliği',
  },
  {
    value: 'Yazılım Mühendisliği',
    label: 'Yazılım Mühendisliği',
  },
];

const StudentsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [department, setDepartment] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { data, isLoading } = useStudents({
    page,
    limit,
    department: department === 'all' ? '' : department,
    search: debouncedSearch,
  });
  const students = data?.students || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const deleteStudentMutation = useDeleteStudent();
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setPage(1);
  };

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleStudentSelect = (studentId) => {
    router.push(`/panel/student-activities?studentId=${studentId}`);
  };

  const handleStudentDelete = async (studentId) => {
    await deleteStudentMutation.mutateAsync(studentId);
    setStudentToDelete(null);
  };

  const handleDeleteConfirm = () => {
    handleStudentDelete(studentToDelete);
  };

  const handleReset = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setDepartment('all');
    setPage(1);
  }, []);

  if (isLoading) {
    return <StudentsPageSkeleton />;
  }

  const hasFilters = search || department !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Öğrenci Listesi</h1>
        <div className="flex items-center gap-4">
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Filtreleri Temizle
            </Button>
          )}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Ad veya soyada göre ara..." value={search} onChange={handleSearch} className="w-[280px] pl-8" />
          </div>
          <Select value={department} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Bölüm seçin" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Ad Soyad</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead className="w-[150px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!students?.length ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Henüz hiç öğrenci bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStudentSelect(student.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => setStudentToDelete(student.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Toplam {pagination.total} öğrenci</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Önceki
            </Button>
            <p className="text-sm">
              Sayfa {page} / {pagination.totalPages}
            </p>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === pagination.totalPages}>
              Sonraki
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Öğrenciyi Sil</DialogTitle>
            <DialogDescription>Bu öğrenciyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentToDelete(null)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
