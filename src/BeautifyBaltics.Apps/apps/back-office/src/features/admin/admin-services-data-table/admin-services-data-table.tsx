import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PagedDataTable, PagedDataTableColumn, usePagedTableQuery } from '@beautify-baltics-apps/components';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { getGetServiceStatisticsQueryKey, useAdminDeleteJobCategory } from '@/state/endpoints/admin';
import {
  FindJobCategoriesParams,
  FindJobCategoriesResponse,
  FindJobCategoriesResponsePagedResponse,
  FindJobsParams,
  FindJobsResponse,
  FindJobsResponsePagedResponse,
} from '@/state/endpoints/api.schemas';
import {
  getFindJobCategoriesQueryKey,
  useFindJobCategories,
  useFindJobs,
} from '@/state/endpoints/jobs';

import { AdminCategoryFormModal } from '../admin-services-modals/admin-category-form-modal';
import { AdminJobFormModal } from '../admin-services-modals/admin-job-form-modal';

import { AdminServicesStats } from './admin-services-stats';

const DEFAULT_PAGE_SIZE = 10;

export function AdminServicesDataTable() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>('services');
  const [selectedJob, setSelectedJob] = useState<FindJobsResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FindJobCategoriesResponse | null>(null);

  const [jobModalOpened, { open: openJobModal, close: closeJobModal }] = useDisclosure(false);
  const [categoryModalOpened, { open: openCategoryModal, close: closeCategoryModal }] = useDisclosure(false);

  const {
    query: servicesQuery,
    sortStatus: servicesSortStatus,
    onPageChange: onServicesPageChange,
    onRecordsPerPageChange: onServicesRecordsPerPageChange,
    onFilterChange: onServicesFilterChange,
    handleSortStatusChange: handleServicesSortStatusChange,
  } = usePagedTableQuery<FindJobsParams, FindJobsResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'name',
    ascending: true,
    name: undefined as string | undefined,
    categoryId: undefined as string | undefined,
  });

  const {
    query: categoriesQuery,
    sortStatus: categoriesSortStatus,
    onPageChange: onCategoriesPageChange,
    onRecordsPerPageChange: onCategoriesRecordsPerPageChange,
    onFilterChange: onCategoriesFilterChange,
    handleSortStatusChange: handleCategoriesSortStatusChange,
  } = usePagedTableQuery<FindJobCategoriesParams, FindJobCategoriesResponse>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'name',
    ascending: true,
    name: undefined as string | undefined,
  });

  const { data: jobsData, isLoading: isJobsLoading } = useFindJobs({
    page: servicesQuery.page,
    pageSize: servicesQuery.pageSize,
    sortBy: servicesQuery.sortBy,
    ascending: servicesQuery.ascending,
    name: servicesQuery.name || undefined,
    categoryId: servicesQuery.categoryId || undefined,
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useFindJobCategories({
    page: categoriesQuery.page,
    pageSize: categoriesQuery.pageSize,
    sortBy: categoriesQuery.sortBy,
    ascending: categoriesQuery.ascending,
    name: categoriesQuery.name || undefined,
  });

  const { data: allCategoriesData } = useFindJobCategories({ all: true });
  const categoryFilterOptions = [
    { value: '', label: t('admin.services.filters.categoryFilterPlaceholder') },
    ...(allCategoriesData?.items ?? []).map((c) => ({ value: c.id ?? '', label: c.name ?? '' })),
  ];

  const { mutate: deleteCategory } = useAdminDeleteJobCategory({
    mutation: {
      onSuccess: () => {
        notifications.show({ message: t('admin.services.categoryModal.notifications.deleteSuccess'), color: 'green' });
        queryClient.invalidateQueries({ queryKey: getFindJobCategoriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetServiceStatisticsQueryKey() });
      },
      onError: (error: any) => {
        notifications.show({
          title: t('admin.services.categoryModal.notifications.errorTitle'),
          message: error?.detail ?? t('admin.services.categoryModal.notifications.error'),
          color: 'red',
        });
      },
    },
  });

  const handleOpenCreateJob = () => {
    setSelectedJob(null);
    openJobModal();
  };

  const handleOpenEditJob = (job: FindJobsResponse) => {
    setSelectedJob(job);
    openJobModal();
  };

  const handleOpenCreateCategory = () => {
    setSelectedCategory(null);
    openCategoryModal();
  };

  const handleOpenEditCategory = (category: FindJobCategoriesResponse) => {
    setSelectedCategory(category);
    openCategoryModal();
  };

  const handleDeleteCategory = (category: FindJobCategoriesResponse) => {
    modals.openConfirmModal({
      title: t('admin.services.categoryModal.deleteTitle'),
      children: <Text size="sm">{t('admin.services.categoryModal.deleteMessage')}</Text>,
      labels: { confirm: t('admin.services.actions.delete'), cancel: t('actions.cancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteCategory({ id: category.id ?? '' }),
    });
  };

  const serviceColumns: PagedDataTableColumn<FindJobsResponse>[] = [
    {
      accessor: 'name',
      title: t('admin.services.servicesTable.columns.name'),
      sortKey: 'name',
      render: (job) => (
        <div>
          <Text fw={600} size="sm">{job.name}</Text>
          <Text size="xs" c="dimmed" lineClamp={1}>{job.description}</Text>
        </div>
      ),
    },
    {
      accessor: 'categoryName',
      title: t('admin.services.servicesTable.columns.category'),
      render: (job) => (
        <Badge variant="light" color="brand" radius="sm">{job.categoryName}</Badge>
      ),
    },
    {
      accessor: 'actions',
      title: t('admin.services.servicesTable.columns.actions'),
      render: (job) => (
        <ActionIcon variant="subtle" color="gray" onClick={() => handleOpenEditJob(job)}>
          <IconEdit size={16} />
        </ActionIcon>
      ),
    },
  ];

  const categoryColumns: PagedDataTableColumn<FindJobCategoriesResponse>[] = [
    {
      accessor: 'name',
      title: t('admin.services.categoriesTable.columns.name'),
      sortKey: 'name',
      render: (category) => <Text fw={600} size="sm">{category.name}</Text>,
    },
    {
      accessor: 'actions',
      title: t('admin.services.categoriesTable.columns.actions'),
      render: (category) => (
        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray" onClick={() => handleOpenEditCategory(category)}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteCategory(category)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  return (
    <>
      <AdminServicesStats />

      <Card withBorder radius="md" p="lg">
        <Stack gap="lg">
          <Group justify="space-between">
            <Tabs value={activeTab} onChange={(v) => setActiveTab(v ?? 'services')}>
              <Tabs.List>
                <Tabs.Tab value="services">{t('admin.services.tabs.services')}</Tabs.Tab>
                <Tabs.Tab value="categories">{t('admin.services.tabs.categories')}</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Group gap="sm">
              <Button
                leftSection={<IconPlus size={16} />}
                variant="default"
                onClick={handleOpenCreateCategory}
              >
                {t('admin.services.actions.addCategory')}
              </Button>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={handleOpenCreateJob}
              >
                {t('admin.services.actions.addService')}
              </Button>
            </Group>
          </Group>

          <Box display={activeTab === 'services' ? 'block' : 'none'}>
            <Stack gap="md">
              <Group gap="sm">
                <TextInput
                  placeholder={t('admin.services.filters.searchPlaceholder')}
                  leftSection={<IconSearch size={16} />}
                  value={servicesQuery.name ?? ''}
                  onChange={(e) => onServicesFilterChange('name', e.currentTarget.value || undefined)}
                  radius="md"
                  style={{ flex: 1 }}
                />
                <Select
                  data={categoryFilterOptions}
                  value={servicesQuery.categoryId ?? ''}
                  onChange={(v) => onServicesFilterChange('categoryId', v || undefined)}
                  radius="md"
                  clearable
                  style={{ minWidth: 200 }}
                />
              </Group>
              <PagedDataTable<FindJobsResponsePagedResponse, FindJobsResponse>
                idAccessor="id"
                data={jobsData}
                columns={serviceColumns}
                fetching={isJobsLoading}
                onPageChange={onServicesPageChange}
                onRecordsPerPageChange={onServicesRecordsPerPageChange}
                sortStatus={servicesSortStatus}
                onSortStatusChange={(s) => handleServicesSortStatusChange(s, serviceColumns)}
                noRecordsText={t('admin.services.servicesTable.noRecords')}
              />
            </Stack>
          </Box>

          <Box display={activeTab === 'categories' ? 'block' : 'none'}>
            <Stack gap="md">
              <TextInput
                placeholder={t('admin.services.filters.categorySearchPlaceholder')}
                leftSection={<IconSearch size={16} />}
                value={categoriesQuery.name ?? ''}
                onChange={(e) => onCategoriesFilterChange('name', e.currentTarget.value || undefined)}
                radius="md"
                style={{ maxWidth: 360 }}
              />
              <PagedDataTable<FindJobCategoriesResponsePagedResponse, FindJobCategoriesResponse>
                idAccessor="id"
                data={categoriesData}
                columns={categoryColumns}
                fetching={isCategoriesLoading}
                onPageChange={onCategoriesPageChange}
                onRecordsPerPageChange={onCategoriesRecordsPerPageChange}
                sortStatus={categoriesSortStatus}
                onSortStatusChange={(s) => handleCategoriesSortStatusChange(s, categoryColumns)}
                noRecordsText={t('admin.services.categoriesTable.noRecords')}
              />
            </Stack>
          </Box>
        </Stack>
      </Card>

      <AdminJobFormModal
        opened={jobModalOpened}
        onClose={closeJobModal}
        job={selectedJob}
      />
      <AdminCategoryFormModal
        opened={categoryModalOpened}
        onClose={closeCategoryModal}
        category={selectedCategory}
      />
    </>
  );
}
