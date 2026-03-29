import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Avatar,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import {
  getGetPendingKycSubmissionsQueryKey,
  useApproveMasterKyc,
  useGetPendingKycSubmissions,
  useRejectMasterKyc,
} from '@/state/endpoints/admin-kyc';
import { PendingKycSubmissionDTO } from '@/state/endpoints/api.schemas';

function KycSubmissionCard({
  submission,
  onApprove,
  onReject,
  isProcessing,
}: {
  submission: PendingKycSubmissionDTO;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Box
      p="md"
      style={{
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group gap="md" align="flex-start" style={{ flex: 1, minWidth: 0 }}>
          {/* Document thumbnail */}
          {submission.documentUrl ? (
            <Anchor href={submission.documentUrl} target="_blank" rel="noopener noreferrer">
              <Avatar
                src={submission.documentUrl}
                size={80}
                radius="md"
                style={{ cursor: 'pointer', flexShrink: 0 }}
              />
            </Anchor>
          ) : (
            <Avatar size={80} radius="md" color="gray" />
          )}

          <Stack gap={4} style={{ minWidth: 0 }}>
            <Text fw={700} size="md" truncate>
              {[submission.firstName, submission.lastName].filter(Boolean).join(' ') || '—'}
            </Text>
            <Text size="sm" c="dimmed" truncate>{submission.email ?? '—'}</Text>
            {submission.submittedAt && (
              <Text size="xs" c="dimmed">
                {t('admin.kyc.submittedAt', { date: dayjs(submission.submittedAt).format('DD MMM YYYY HH:mm') })}
              </Text>
            )}
            {submission.documentUrl && (
              <Anchor href={submission.documentUrl} target="_blank" rel="noopener noreferrer" size="xs">
                {t('admin.kyc.viewDocument')}
              </Anchor>
            )}
          </Stack>
        </Group>

        <Group gap="sm" style={{ flexShrink: 0 }}>
          <Button
            size="xs"
            color="teal"
            variant="filled"
            leftSection={<IconCheck size={14} />}
            onClick={onApprove}
            loading={isProcessing}
          >
            {t('admin.kyc.actions.approve')}
          </Button>
          <Button
            size="xs"
            color="red"
            variant="light"
            leftSection={<IconX size={14} />}
            onClick={onReject}
            loading={isProcessing}
          >
            {t('admin.kyc.actions.reject')}
          </Button>
        </Group>
      </Group>
    </Box>
  );
}

export default function AdminKycPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetPendingKycSubmissions();
  const submissions = data?.items ?? [];

  const [approveTarget, setApproveTarget] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const rejectForm = useForm({ initialValues: { reason: '' } });

  const { mutate: approve, isPending: isApproving } = useApproveMasterKyc({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: t('admin.kyc.notifications.approved'), message: '', color: 'teal', icon: <IconCheck size={16} />,
        });
        setApproveTarget(null);
        queryClient.invalidateQueries({ queryKey: getGetPendingKycSubmissionsQueryKey() });
      },
      onError: () => {
        notifications.show({ title: t('admin.kyc.notifications.errorTitle'), message: t('admin.kyc.notifications.error'), color: 'red' });
      },
    },
  });

  const { mutate: reject, isPending: isRejecting } = useRejectMasterKyc({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: t('admin.kyc.notifications.rejected'), message: '', color: 'orange', icon: <IconX size={16} />,
        });
        setRejectTarget(null);
        rejectForm.reset();
        queryClient.invalidateQueries({ queryKey: getGetPendingKycSubmissionsQueryKey() });
      },
      onError: () => {
        notifications.show({ title: t('admin.kyc.notifications.errorTitle'), message: t('admin.kyc.notifications.error'), color: 'red' });
      },
    },
  });

  const handleConfirmApprove = () => {
    if (!approveTarget) return;
    approve({ masterId: approveTarget });
  };

  const handleConfirmReject = () => {
    if (!rejectTarget) return;
    reject({ masterId: rejectTarget, data: { reason: rejectForm.values.reason } });
  };

  return (
    <Stack gap="lg">
      <Box>
        <Title ml="sm" order={3}>{t('admin.kyc.pageTitle')}</Title>
        <Text ml="sm" size="sm" c="dimmed" mt={4}>{t('admin.kyc.pageSubtitle')}</Text>
      </Box>

      {!isLoading && submissions.length === 0 && (
        <Text c="dimmed" ta="center" py="xl">{t('admin.kyc.empty')}</Text>
      )}

      <Stack gap="sm">
        {submissions.map((submission) => (
          <KycSubmissionCard
            key={submission.masterId}
            submission={submission}
            onApprove={() => setApproveTarget(submission.masterId ?? null)}
            onReject={() => setRejectTarget(submission.masterId ?? null)}
            isProcessing={isApproving || isRejecting}
          />
        ))}
      </Stack>

      {/* Approve confirmation modal */}
      <Modal
        opened={approveTarget !== null}
        onClose={() => setApproveTarget(null)}
        title={t('admin.kyc.approveModal.title')}
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">{t('admin.kyc.approveModal.message')}</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setApproveTarget(null)}>{t('actions.cancel')}</Button>
            <Button color="teal" onClick={handleConfirmApprove} loading={isApproving}>
              {t('admin.kyc.approveModal.confirm')}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Reject modal with reason */}
      <Modal
        opened={rejectTarget !== null}
        onClose={() => { setRejectTarget(null); rejectForm.reset(); }}
        title={t('admin.kyc.rejectModal.title')}
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">{t('admin.kyc.rejectModal.message')}</Text>
          <Textarea
            label={t('admin.kyc.rejectModal.reasonLabel')}
            placeholder={t('admin.kyc.rejectModal.reasonPlaceholder')}
            minRows={3}
            required
            {...rejectForm.getInputProps('reason')}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => { setRejectTarget(null); rejectForm.reset(); }}>
              {t('actions.cancel')}
            </Button>
            <Button
              color="red"
              onClick={handleConfirmReject}
              loading={isRejecting}
              disabled={!rejectForm.values.reason.trim()}
            >
              {t('admin.kyc.rejectModal.confirm')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
