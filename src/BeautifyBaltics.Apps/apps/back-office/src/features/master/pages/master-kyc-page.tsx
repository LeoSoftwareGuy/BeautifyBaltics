import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconClock,
  IconExternalLink,
  IconRefresh,
  IconShieldCheck,
  IconShieldX,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { KycStatus } from '@/state/endpoints/api.schemas';
import {
  getGetMasterByIdQueryKey, useGetMasterById, useInitiateMasterKycVerification, useSyncMasterKycStatus,
} from '@/state/endpoints/masters';
import { useGetUser } from '@/state/endpoints/users';

function KycStatusBadge({ status }: { status: KycStatus | undefined }) {
  const { t } = useTranslation();
  switch (status) {
    case KycStatus.Approved:
      return <Badge color="teal" size="lg" m="sm" leftSection={<IconShieldCheck size={14} />}>{t('master.kyc.status.approved')}</Badge>;
    case KycStatus.Pending:
      return <Badge color="yellow" size="lg" m="sm" leftSection={<IconClock size={14} />}>{t('master.kyc.status.pending')}</Badge>;
    case KycStatus.Rejected:
      return <Badge color="red" size="lg" m="sm" leftSection={<IconShieldX size={14} />}>{t('master.kyc.status.rejected')}</Badge>;
    case KycStatus.Abandoned:
    case KycStatus.Expired:
      return <Badge color="orange" size="lg" m="sm" leftSection={<IconAlertCircle size={14} />}>{t('master.kyc.status.abandoned')}</Badge>;
    default:
      return <Badge color="gray" size="lg" m="sm">{t('master.kyc.status.notSubmitted')}</Badge>;
  }
}

export default function MasterKycPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { status: callbackStatus } = useSearch({ from: '/master/kyc/' });

  const { data: user } = useGetUser();
  const masterId = user?.id ?? '';

  const { data: masterData, isLoading } = useGetMasterById(
    masterId,
    { id: masterId },
    { query: { enabled: !!masterId } },
  );

  const kycStatus = masterData?.kycStatus;
  const kycVerificationUrl = masterData?.kycVerificationUrl;

  const { mutate: syncStatus, isPending: isSyncing } = useSyncMasterKycStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMasterByIdQueryKey(masterId) });
      },
      onError: () => {
        notifications.show({
          title: t('master.kyc.notifications.errorTitle'),
          message: t('master.kyc.notifications.errorMessage'),
          color: 'red',
        });
      },
    },
  });

  const { mutate: initiate, isPending: isInitiating } = useInitiateMasterKycVerification({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getGetMasterByIdQueryKey(masterId) });
        if (data.verificationUrl) {
          window.open(data.verificationUrl, '_blank', 'noopener,noreferrer');
        }
      },
      onError: () => {
        notifications.show({
          title: t('master.kyc.notifications.errorTitle'),
          message: t('master.kyc.notifications.errorMessage'),
          color: 'red',
        });
      },
    },
  });

  useEffect(() => {
    if (masterId && callbackStatus && kycStatus !== 'Approved') {
      syncStatus({ id: masterId, callbackStatus });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterId, callbackStatus]);

  const handleStart = () => {
    if (masterId) initiate({ id: masterId });
  };

  const handleRefresh = () => {
    if (masterId) syncStatus({ id: masterId });
  };

  const handleReopen = () => {
    if (kycVerificationUrl) {
      window.open(kycVerificationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader color="pink" />
      </Center>
    );
  }

  const canStart = !kycStatus
    || kycStatus === KycStatus.NotSubmitted
    || kycStatus === KycStatus.Rejected
    || kycStatus === KycStatus.Abandoned
    || kycStatus === KycStatus.Expired;

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Group justify="space-between" align="flex-end">
          <Box>
            <Title order={2} fw={600}>{t('master.kyc.title')}</Title>
            <Text c="dimmed" size="sm">{t('master.kyc.subtitle')}</Text>
          </Box>
          <KycStatusBadge status={kycStatus} />
        </Group>
      </Box>
      <Stack gap="xl" px={{ base: 'md', md: 'md' }} pb="xl">
        {kycStatus === KycStatus.Approved && (
        <Card withBorder radius="md" p="xl" m="sm">
          <Stack align="center" gap="md">
            <ThemeIcon size={64} radius="xl" color="teal" variant="light">
              <IconShieldCheck size={36} />
            </ThemeIcon>
            <Title order={4} ta="center">{t('master.kyc.approvedTitle')}</Title>
            <Text size="sm" c="dimmed" ta="center">{t('master.kyc.approvedMessage')}</Text>
          </Stack>
        </Card>
        )}

        {kycStatus === KycStatus.Pending && (
        <Card withBorder radius="md" p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={64} radius="xl" color="yellow" variant="light">
              <IconClock size={36} />
            </ThemeIcon>
            <Title order={4} ta="center">{t('master.kyc.pendingTitle')}</Title>
            <Text size="sm" c="dimmed" ta="center">{t('master.kyc.pendingMessage')}</Text>
            <Group>
              <Button
                variant="light"
                color="yellow"
                leftSection={<IconRefresh size={16} />}
                loading={isSyncing}
                onClick={handleRefresh}
              >
                {t('master.kyc.checkStatusButton')}
              </Button>
              {kycVerificationUrl && (
                <Button
                  variant="light"
                  leftSection={<IconExternalLink size={16} />}
                  onClick={handleReopen}
                >
                  {t('master.kyc.reopenButton')}
                </Button>
              )}
            </Group>
          </Stack>
        </Card>
        )}

        {kycStatus === KycStatus.Rejected && (
        <Alert icon={<IconShieldX size={16} />} color="red" variant="light">
          <Stack gap="xs">
            <Text size="sm" fw={600}>{t('master.kyc.rejectedTitle')}</Text>
            {masterData?.kycRejectionReason && (
              <Text size="sm">{t('master.kyc.rejectedReason', { reason: masterData.kycRejectionReason })}</Text>
            )}
            <Text size="sm">{t('master.kyc.rejectedHint')}</Text>
          </Stack>
        </Alert>
        )}

        {(kycStatus === KycStatus.Abandoned || kycStatus === KycStatus.Expired) && (
        <Alert icon={<IconAlertCircle size={16} />} color="orange" variant="light">
          <Text size="sm">{t('master.kyc.abandonedMessage')}</Text>
        </Alert>
        )}

        {canStart && (
        <Card withBorder radius="md" p="lg">
          <Stack gap="md">
            <Box>
              <Text fw={500}>{t('master.kyc.howItWorksTitle')}</Text>
              <Text size="sm" c="dimmed" mt={4}>{t('master.kyc.howItWorksMessage')}</Text>
            </Box>
            <Button
              color="pink"
              leftSection={<IconShieldCheck size={16} />}
              loading={isInitiating}
              onClick={handleStart}
            >
              {kycStatus === KycStatus.Rejected || kycStatus === KycStatus.Abandoned || kycStatus === KycStatus.Expired
                ? t('master.kyc.retryButton')
                : t('master.kyc.startButton')}
            </Button>
          </Stack>
        </Card>
        )}
      </Stack>
    </Box>
  );
}
