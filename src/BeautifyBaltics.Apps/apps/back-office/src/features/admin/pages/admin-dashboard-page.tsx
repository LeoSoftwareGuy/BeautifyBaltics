import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconFileDownload } from '@tabler/icons-react';

import { useGetDashboardSummary } from '@/state/endpoints/admin';

import { AdminDashboardActivity } from '../admin-dashboard/admin-dashboard-activity';
import { AdminDashboardCategories } from '../admin-dashboard/admin-dashboard-categories';
import { AdminDashboardChart } from '../admin-dashboard/admin-dashboard-chart';
import { AdminDashboardStats } from '../admin-dashboard/admin-dashboard-stats';

function AdminDashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDashboardSummary();

  return (
    <Box bg="var(--mantine-color-body)" mih="100vh">
      <Box visibleFrom="md" component="header" bg="var(--mantine-color-default-hover)" px="md" py="sm" mb="lg">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2} fw={600}>{t('admin.dashboard.page.title')}</Title>
            <Text c="dimmed" size="sm">{t('admin.dashboard.page.subtitle')}</Text>
          </div>
          <Button
            leftSection={<IconFileDownload size={16} />}
            variant="outline"
            color="brand"
          >
            {t('admin.dashboard.page.exportReport')}
          </Button>
        </Group>
      </Box>

      <Stack gap="xl" px={{ base: 'sm', md: 'md' }} pb="xl">
        <AdminDashboardStats data={data} isLoading={isLoading} />

        <AdminDashboardChart data={data?.monthlyPerformance} isLoading={isLoading} />

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <AdminDashboardActivity data={data?.recentActivities} isLoading={isLoading} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <AdminDashboardCategories
              categories={data?.serviceCategories}
              totalRevenue={data?.totalRevenue}
              isLoading={isLoading}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Box>
  );
}

export default AdminDashboardPage;
