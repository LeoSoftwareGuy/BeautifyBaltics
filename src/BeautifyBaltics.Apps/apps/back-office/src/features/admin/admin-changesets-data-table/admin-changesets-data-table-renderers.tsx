import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  Group,
  Image,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import {
  ChangesetStatus,
  FindChangesetsResponse,
} from '@/state/endpoints/api.schemas';
import {
  getFindChangesetsQueryKey,
  getGetPendingChangesetsCountQueryKey,
  useApproveChangeset,
  useRejectChangeset,
} from '@/state/endpoints/changesets';

export const STATUS_COLORS: Record<ChangesetStatus, string> = {
  [ChangesetStatus.Pending]: 'yellow',
  [ChangesetStatus.Approved]: 'green',
  [ChangesetStatus.Rejected]: 'red',
};

export const CHANGE_TYPE_LABELS: Record<string, string> = {
  'BeautifyBaltics.Domain.Aggregates.Master.Changesets.MasterProfileChangeProposed': 'Profile update',
  'BeautifyBaltics.Domain.Aggregates.Master.Changesets.MasterProfileImageChangeProposed': 'Profile image',
  'BeautifyBaltics.Domain.Aggregates.Master.Changesets.MasterJobCreateChangeProposed': 'New service',
  'BeautifyBaltics.Domain.Aggregates.Master.Changesets.MasterJobUpdateChangeProposed': 'Service update',
  'BeautifyBaltics.Domain.Aggregates.Master.Changesets.MasterJobImageChangeProposed': 'Service image',
};

export function formatChangeType(type?: string) {
  if (!type) return '—';
  return CHANGE_TYPE_LABELS[type] ?? type.split('.').pop() ?? type;
}

const IMAGE_BLOB_FIELDS = new Set(['blobName', 'masterProfileImageId', 'masterJobImageId', 'fileName', 'fileMimeType', 'fileSize']);

export function ProposedChangePreview({ record }: { record: FindChangesetsResponse }) {
  const { data, imageUrl } = record;
  if (!data || typeof data !== 'object') return <Text size="sm" c="dimmed">No data</Text>;

  const entries = Object.entries(data as Record<string, unknown>)
    .filter(([key, v]) => v !== null && v !== undefined && v !== '' && !(imageUrl && IMAGE_BLOB_FIELDS.has(key)));

  return (
    <Stack gap="sm">
      {imageUrl && (
        <Image
          src={imageUrl}
          radius="md"
          maw={240}
          fit="cover"
          fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
        />
      )}
      {entries.length > 0 && (
        <Stack gap={4}>
          {entries.map(([key, value]) => (
            <Group key={key} gap="xs" wrap="nowrap">
              <Text size="xs" c="dimmed" style={{ minWidth: 140, fontWeight: 500 }}>
                {key}
              </Text>
              <Text size="xs" style={{ wordBreak: 'break-all' }}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Text>
            </Group>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function ChangesetActionButtons({ changeset }: { changeset: FindChangesetsResponse }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getFindChangesetsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetPendingChangesetsCountQueryKey() });
  };

  const { mutate: approve, isPending: isApproving } = useApproveChangeset({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.changesets.notifications.approved'), color: 'green' });
        invalidate();
      },
      onError: () => {
        notifications.show({ title: t('admin.changesets.notifications.errorTitle'), message: t('admin.changesets.notifications.error'), color: 'red' });
      },
    },
  });

  const { mutate: reject, isPending: isRejecting } = useRejectChangeset({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.changesets.notifications.rejected'), color: 'orange' });
        invalidate();
      },
      onError: () => {
        notifications.show({ title: t('admin.changesets.notifications.errorTitle'), message: t('admin.changesets.notifications.error'), color: 'red' });
      },
    },
  });

  const openApproveModal = () => {
    let comment = '';
    modals.openConfirmModal({
      title: t('admin.changesets.approveModal.title'),
      children: (
        <Stack gap="sm">
          <Text size="sm">{t('admin.changesets.approveModal.message')}</Text>
          <Textarea
            placeholder={t('admin.changesets.approveModal.commentPlaceholder')}
            autosize
            minRows={2}
            onChange={(e) => { comment = e.currentTarget.value; }}
          />
        </Stack>
      ),
      labels: { confirm: t('admin.changesets.approveModal.confirm'), cancel: t('actions.cancel') },
      confirmProps: { color: 'green' },
      onConfirm: () => {
        if (!changeset.masterId || !changeset.id) return;
        approve({ masterId: changeset.masterId, changesetId: changeset.id, data: { comment: comment || null } });
      },
    });
  };

  const openRejectModal = () => {
    let comment = '';
    modals.openConfirmModal({
      title: t('admin.changesets.rejectModal.title'),
      children: (
        <Stack gap="sm">
          <Text size="sm">{t('admin.changesets.rejectModal.message')}</Text>
          <Textarea
            placeholder={t('admin.changesets.rejectModal.commentPlaceholder')}
            autosize
            minRows={2}
            onChange={(e) => { comment = e.currentTarget.value; }}
          />
        </Stack>
      ),
      labels: { confirm: t('admin.changesets.rejectModal.confirm'), cancel: t('actions.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (!changeset.masterId || !changeset.id) return;
        reject({ masterId: changeset.masterId, changesetId: changeset.id, data: { comment: comment || null } });
      },
    });
  };

  return (
    <Group gap="xs" wrap="nowrap" onClick={(e) => e.stopPropagation()}>
      <Button
        size="xs"
        color="green"
        variant="light"
        leftSection={<IconCheck size={14} />}
        loading={isApproving}
        onClick={openApproveModal}
      >
        {t('admin.changesets.actions.approve')}
      </Button>
      <Button
        size="xs"
        color="red"
        variant="light"
        leftSection={<IconX size={14} />}
        loading={isRejecting}
        onClick={openRejectModal}
      >
        {t('admin.changesets.actions.reject')}
      </Button>
    </Group>
  );
}

export function ChangesetStatusBadge({ status }: { status: ChangesetStatus }) {
  const { t } = useTranslation();
  return (
    <Badge variant="light" color={STATUS_COLORS[status]} radius="sm">
      {t(`admin.changesets.status.${status.toLowerCase()}`)}
    </Badge>
  );
}
