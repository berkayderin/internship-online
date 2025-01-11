'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { toast } from '@/hooks/use-toast';

import { ActivityDetailModal } from './ActivityDetailModal';
import { StudentActivities } from './StudentActivities';

import { useBulkUpdateActivities, useStudentActivities, useSubmitFeedback } from '../queries/useStudentQueries';
import { summarizeActivities } from '../services/ai';
import { generateActivityReport, generateSummaryReport } from '../services/pdf';

export const StudentActivitiesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const {
    data: activitiesData,
    isLoading,
    error,
  } = useStudentActivities(studentId, {
    page,
    limit,
    status,
    search,
  });

  const submitFeedback = useSubmitFeedback();
  const bulkUpdateActivities = useBulkUpdateActivities();

  const handleBack = () => {
    router.push('/panel/students');
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setDetailsOpen(true);
  };

  const handleStatusFilter = (status) => {
    setStatus(status);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleApprove = async (activityId) => {
    try {
      await submitFeedback.mutateAsync({
        id: activityId,
        data: {
          status: 'APPROVED',
          feedback: '',
        },
      });
    } catch (error) {
      console.error('Error approving activity:', error);
    }
  };

  const handleReject = async (activityId, feedback) => {
    try {
      await submitFeedback.mutateAsync({
        id: activityId,
        data: {
          status: 'REJECTED',
          feedback: feedback,
        },
      });
    } catch (error) {
      console.error('Error rejecting activity:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!activitiesData?.student || !activitiesData?.data) return;

    try {
      const pdfDoc = generateActivityReport(activitiesData.student, activitiesData.data);

      pdfDoc.download(`${activitiesData.student.firstName}_${activitiesData.student.lastName}_staj_raporu.pdf`);
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      if (!activitiesData?.student || !activitiesData?.data) {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: 'Öğrenci veya aktivite verisi bulunamadı',
        });
        return;
      }

      setIsSummarizing(true);
      const summary = await summarizeActivities(activitiesData.data);
      const pdfDoc = generateSummaryReport(activitiesData.student, summary);
      pdfDoc.download(`${activitiesData.student.firstName}_${activitiesData.student.lastName}_staj_özeti.pdf`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Özet raporu oluşturulurken bir hata oluştu',
      });
      console.error(error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSelectActivity = (activityId, isSelected) => {
    if (isSelected) {
      setSelectedActivities([...selectedActivities, activityId]);
    } else {
      setSelectedActivities(selectedActivities.filter((id) => id !== activityId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allActivityIds = activitiesData?.data.map((activity) => activity.id) || [];
      setSelectedActivities(allActivityIds);
    } else {
      setSelectedActivities([]);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedActivities.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen en az bir aktivite seçin',
      });
      return;
    }

    try {
      await bulkUpdateActivities.mutateAsync({
        studentId,
        data: {
          activityIds: selectedActivities,
          status: 'APPROVED',
          feedback: '',
        },
      });
      setSelectedActivities([]);
    } catch (error) {
      console.error('Error bulk approving activities:', error);
    }
  };

  const handleBulkReject = async (feedback) => {
    if (selectedActivities.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen en az bir aktivite seçin',
      });
      return;
    }

    try {
      await bulkUpdateActivities.mutateAsync({
        studentId,
        data: {
          activityIds: selectedActivities,
          status: 'REJECTED',
          feedback,
        },
      });
      setSelectedActivities([]);
    } catch (error) {
      console.error('Error bulk rejecting activities:', error);
    }
  };

  return (
    <div>
      <StudentActivities
        student={activitiesData?.student}
        activities={activitiesData?.data || []}
        pagination={activitiesData?.pagination}
        selectedActivities={selectedActivities}
        onSelectActivity={handleSelectActivity}
        onSelectAll={handleSelectAll}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        onBack={handleBack}
        onViewDetails={handleViewDetails}
        onPageChange={setPage}
        onLimitChange={(value) => setLimit(parseInt(value))}
        onStatusFilter={handleStatusFilter}
        onSearch={handleSearch}
        onApprove={handleApprove}
        onReject={handleReject}
        onGenerateReport={handleGenerateReport}
        onGenerateSummary={handleGenerateSummary}
        isLoading={isLoading}
        isSummarizing={isSummarizing}
      />

      <ActivityDetailModal
        activity={selectedActivity}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
