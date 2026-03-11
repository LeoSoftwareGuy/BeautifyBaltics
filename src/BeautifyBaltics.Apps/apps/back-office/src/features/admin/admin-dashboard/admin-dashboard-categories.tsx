import { useTranslation } from 'react-i18next';
import {
  Card,
  Group,
  NumberFormatter,
  Progress,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { ServiceCategoryRevenueStat } from '@/state/endpoints/api.schemas';

type Props = {
  categories: ServiceCategoryRevenueStat[] | null | undefined;
  totalRevenue: number | undefined;
  isLoading: boolean;
};

function CategoriesContent({ categories, t }: { categories: ServiceCategoryRevenueStat[]; t: (key: string) => string }) {
  if (!categories.length) {
    return <Text c="dimmed" size="sm">{t('admin.dashboard.serviceCategories.noData')}</Text>;
  }
  return (
    <Stack gap="md">
      {categories.map((cat) => (
        <div key={cat.categoryName}>
          <Group justify="space-between" mb={6}>
            <Text size="sm" fw={500}>{cat.categoryName}</Text>
            <Text size="sm" fw={700} c="brand">
              {cat.percentage ?? 0}
              %
            </Text>
          </Group>
          <Progress value={cat.percentage ?? 0} color="brand" radius="xl" size="sm" />
        </div>
      ))}
    </Stack>
  );
}

export function AdminDashboardCategories({ categories, totalRevenue, isLoading }: Props) {
  const { t } = useTranslation();
  const items = categories ?? [];

  return (
    <Card withBorder radius="md" p="lg" style={{ flex: 1 }}>
      <Stack gap="lg">
        <Title order={3} fw={600}>{t('admin.dashboard.serviceCategories.title')}</Title>

        {isLoading ? (
          <Stack gap="md">
            {Array.from({ length: 4 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={i} height={36} radius="md" />
            ))}
          </Stack>
        ) : (
          <CategoriesContent categories={items} t={t} />
        )}

        <Card withBorder={false} bg="var(--mantine-color-brand-0)" radius="md" p="md">
          <Text size="sm" c="dimmed" ta="center">
            {t('admin.dashboard.serviceCategories.totalRevenue')}
            {': '}
            <Text span fw={700} c="var(--mantine-color-body)">
              <NumberFormatter
                value={totalRevenue ?? 0}
                prefix="€"
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>
          </Text>
        </Card>
      </Stack>
    </Card>
  );
}
