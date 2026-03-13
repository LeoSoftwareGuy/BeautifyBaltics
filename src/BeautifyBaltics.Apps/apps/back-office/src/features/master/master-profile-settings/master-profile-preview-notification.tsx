import { useTranslation } from 'react-i18next';
import {
  Box, Group, Paper, Switch, Text,
} from '@mantine/core';
import { IconEyeCheck, IconEyeExclamation } from '@tabler/icons-react';

export type ProfilePreviewMode = 'approved' | 'proposed';

interface MasterProfilePreviewNotificationProps {
  mode: ProfilePreviewMode;
  onChange: (mode: ProfilePreviewMode) => void;
}

export function MasterProfilePreviewNotification({ mode, onChange }: MasterProfilePreviewNotificationProps) {
  const { t } = useTranslation();
  const isProposed = mode === 'proposed';

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
      }}
    >
      <Paper
        shadow="md"
        px="lg"
        py="sm"
        radius="xl"
        withBorder
        style={{
          borderColor: isProposed
            ? 'var(--mantine-color-orange-4)'
            : 'var(--mantine-color-green-4)',
          backgroundColor: isProposed
            ? 'var(--mantine-color-orange-0)'
            : 'var(--mantine-color-green-0)',
        }}
      >
        <Group gap="sm" wrap="nowrap">
          {isProposed
            ? <IconEyeExclamation size={18} color="var(--mantine-color-orange-6)" />
            : <IconEyeCheck size={18} color="var(--mantine-color-green-6)" />}
          <Text size="sm" fw={500} c={isProposed ? 'orange.7' : 'green.7'}>
            {isProposed
              ? t('master.settings.profile.pendingPreview.viewingProposed')
              : t('master.settings.profile.pendingPreview.viewingApproved')}
          </Text>
          <Switch
            size="sm"
            checked={isProposed}
            onChange={(e) => onChange(e.currentTarget.checked ? 'proposed' : 'approved')}
            onLabel={t('master.settings.profile.pendingPreview.pending')}
            offLabel={t('master.settings.profile.pendingPreview.approved')}
            color="orange"
          />
        </Group>
      </Paper>
    </Box>
  );
}
