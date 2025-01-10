// features/student-activities/components/ActivityDetailModal.jsx
import { useState } from 'react';

import RichTextEditor from '@/components/text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const statusText = {
  PENDING: 'Bekliyor',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
};

export const statusVariants = {
  PENDING: 'default',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

export function ActivityDetailModal({ activity, open, onOpenChange, onApprove, onReject }) {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleApprove = () => {
    onApprove(activity.id);
    onOpenChange(false);
  };

  const handleReject = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }

    onReject(activity.id, feedback);
    setFeedback('');
    setShowFeedback(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setFeedback('');
    setShowFeedback(false);
    onOpenChange(false);
  };

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Aktivite Detayı</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium">Tarih</div>
            <div>
              {format(new Date(activity.date), 'dd MMMM yyyy', {
                locale: tr,
              })}
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium">İçerik</div>
            <div dangerouslySetInnerHTML={{ __html: activity.content }} />
          </div>

          <div>
            <div className="mb-1 text-sm font-medium">Durum</div>
            <Badge variant={statusVariants[activity.status]}>{statusText[activity.status]}</Badge>
          </div>

          {activity.feedback && (
            <div>
              <div className="mb-1 text-sm font-medium">Geri Bildirim</div>
              <div>{activity.feedback}</div>
            </div>
          )}

          {showFeedback && (
            <div>
              <div className="mb-1 text-sm font-medium">Geri Bildirim</div>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Reddetme sebebini yazın..."
                className="resize-none"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          {activity.status === 'PENDING' && (
            <div className="flex gap-2">
              <Button onClick={handleApprove}>Onayla</Button>
              <Button variant="destructive" onClick={handleReject}>
                {showFeedback ? 'Reddet' : 'Reddetme Sebebi'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
