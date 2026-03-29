import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  FileButton,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconFileUpload,
  IconShieldCheck,
  IconShieldX,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { KycStatus } from '@/state/endpoints/api.schemas';
import { getGetMasterByIdQueryKey, useSubmitMasterKyc } from '@/state/endpoints/masters';

interface MasterKycSectionProps {
  masterId: string;
  kycStatus?: KycStatus;
  kycDocumentUrl?: string | null;
  kycRejectionReason?: string | null;
}

function KycStatusBadge({ status }: { status: KycStatus | undefined }) {
  const { t } = useTranslation();

  switch (status) {
    case KycStatus.Approved:
      return <Badge color="teal" leftSection={<IconShieldCheck size={12} />}>{t('master.settings.kyc.status.approved')}</Badge>;
    case KycStatus.Pending:
      return <Badge color="yellow" leftSection={<IconClock size={12} />}>{t('master.settings.kyc.status.pending')}</Badge>;
    case KycStatus.Rejected:
      return <Badge color="red" leftSection={<IconShieldX size={12} />}>{t('master.settings.kyc.status.rejected')}</Badge>;
    default:
      return <Badge color="gray">{t('master.settings.kyc.status.notSubmitted')}</Badge>;
  }
}

export function MasterKycSection({
  masterId,
  kycStatus,
  kycDocumentUrl,
  kycRejectionReason,
}: MasterKycSectionProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const resetRef = useRef<() => void>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: submitKyc, isPending } = useSubmitMasterKyc({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: t('master.settings.kyc.notifications.successTitle'),
          message: t('master.settings.kyc.notifications.successMessage'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        resetRef.current?.();
        queryClient.invalidateQueries({ queryKey: getGetMasterByIdQueryKey(masterId) });
      },
      onError: () => {
        notifications.show({
          title: t('master.settings.kyc.notifications.errorTitle'),
          message: t('master.settings.kyc.notifications.errorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    submitKyc({
      id: masterId,
      data: { masterId, files: [selectedFile] },
    });
  };

  const canUpload = kycStatus !== KycStatus.Approved;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title order={4}>{t('master.settings.kyc.title')}</Title>
          <Text size="sm" c="dimmed" mt={4}>{t('master.settings.kyc.subtitle')}</Text>
        </Box>
        <KycStatusBadge status={kycStatus} />
      </Group>

      {kycStatus === KycStatus.Approved && (
        <Alert icon={<IconShieldCheck size={16} />} color="teal" variant="light">
          {t('master.settings.kyc.approvedMessage')}
        </Alert>
      )}

      {kycStatus === KycStatus.Pending && (
        <Alert icon={<IconClock size={16} />} color="yellow" variant="light">
          {t('master.settings.kyc.pendingMessage')}
        </Alert>
      )}

      {kycStatus === KycStatus.Rejected && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
          <Stack gap="xs">
            <Text size="sm" fw={600}>{t('master.settings.kyc.rejectedMessage')}</Text>
            {kycRejectionReason && (
              <Text size="sm">{t('master.settings.kyc.rejectedReason', { reason: kycRejectionReason })}</Text>
            )}
            <Text size="sm">{t('master.settings.kyc.resubmitHint')}</Text>
          </Stack>
        </Alert>
      )}

      {/* Existing document preview (only show if no new file selected) */}
      {kycDocumentUrl && !previewUrl && (
        <Box>
          <Text size="sm" fw={500} mb="xs">{t('master.settings.kyc.documentPreview')}</Text>
          <Anchor href={kycDocumentUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src={kycDocumentUrl}
              alt={t('master.settings.kyc.documentPreview')}
              maw={280}
              radius="md"
              style={{ border: '1px solid var(--mantine-color-default-border)' }}
            />
          </Anchor>
        </Box>
      )}

      {/* New file preview */}
      {previewUrl && (
        <Box>
          <Text size="sm" fw={500} mb="xs">{t('master.settings.kyc.uploadLabel')}</Text>
          <Image
            src={previewUrl}
            alt={t('master.settings.kyc.uploadLabel')}
            maw={280}
            radius="md"
            style={{ border: '1px solid var(--mantine-color-default-border)' }}
          />
        </Box>
      )}

      {canUpload && (
        <Stack gap="xs">
          <Text size="xs" c="dimmed">{t('master.settings.kyc.uploadHint')}</Text>
          <Group>
            <FileButton
              resetRef={resetRef}
              onChange={handleFileSelect}
              accept="image/*"
            >
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  leftSection={<IconFileUpload size={16} />}
                >
                  {kycDocumentUrl
                    ? t('master.settings.kyc.reuploadButton')
                    : t('master.settings.kyc.uploadButton')}
                </Button>
              )}
            </FileButton>

            {selectedFile && (
              <Button
                onClick={handleSubmit}
                loading={isPending}
                color="pink"
              >
                {t('master.settings.kyc.submitButton')}
              </Button>
            )}
          </Group>
        </Stack>
      )}
    </Stack>
  );
}
