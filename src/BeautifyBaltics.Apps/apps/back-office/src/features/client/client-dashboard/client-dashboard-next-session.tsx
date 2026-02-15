import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCalendarEvent, IconMapPin } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { useTranslateData } from '@/hooks/use-translate-data';
import { FindBookingsResponse } from '@/state/endpoints/api.schemas';
import { getFindBookingsQueryKey, useCancelBooking } from '@/state/endpoints/bookings';
import { useGetUser } from '@/state/endpoints/users';

import { ClientBookingDetailsDrawer } from './client-booking-details-drawer';

interface ClientDashboardNextSessionProps {
  booking?: FindBookingsResponse;
  isLoading?: boolean;
}

export function ClientDashboardNextSession({ booking, isLoading }: ClientDashboardNextSessionProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { translateService } = useTranslateData();

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: t('client.bookings.notifications.cancelSuccessTitle'),
          message: t('client.bookings.notifications.cancelSuccessMessage'),
          color: 'green',
        });
        queryClient.invalidateQueries({ queryKey: getFindBookingsQueryKey() });
        setDrawerOpened(false);
      },
      onError: (error: any) => {
        notifications.show({
          title: t('client.bookings.notifications.cancelErrorTitle'),
          message: error.message || t('client.bookings.notifications.cancelErrorMessage'),
          color: 'red',
        });
      },
    },
  });

  const handleCancel = (bookingId: string) => {
    cancelBooking({
      id: bookingId,
      data: { bookingId, clientId: user?.id ?? '' },
    });
  };

  if (isLoading) {
    return (
      <Card withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconCalendarEvent size={20} />
          <Title order={4}>{t('client.nextSession.title')}</Title>
        </Group>
        <Skeleton height={200} radius="md" />
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconCalendarEvent size={20} />
          <Title order={4}>{t('client.nextSession.title')}</Title>
        </Group>
        <Box
          bg="var(--mantine-color-gray-1)"
          p="xl"
          style={{ borderRadius: 'var(--mantine-radius-md)' }}
        >
          <Text c="dimmed" ta="center">{t('client.nextSession.emptyTitle')}</Text>
          <Text size="sm" c="dimmed" ta="center" mt="xs">
            {t('client.nextSession.emptySubtitle')}
          </Text>
        </Box>
      </Card>
    );
  }

  const scheduledDate = dayjs(booking.scheduledAt);
  const now = dayjs();
  const diffMinutes = scheduledDate.diff(now, 'minute');
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  let timeUntil = '';
  if (diffHours > 24) {
    const days = Math.floor(diffHours / 24);
    timeUntil = t('client.nextSession.startsInDays', { count: days });
  } else if (diffHours > 0) {
    timeUntil = t('client.nextSession.startsInHours', { hours: diffHours, minutes: remainingMinutes });
  } else if (diffMinutes > 0) {
    timeUntil = t('client.nextSession.startsInMinutes', { minutes: diffMinutes });
  } else {
    timeUntil = t('client.nextSession.startingSoon');
  }

  const location = [booking.locationCity, booking.locationCountry]
    .filter(Boolean)
    .join(', ') || t('client.bookings.locationFallback');

  const fullLocation = [
    booking.locationAddressLine1,
    booking.locationAddressLine2,
    booking.locationCity,
  ].filter(Boolean).join(', ') || location;

  return (
    <Card withBorder radius="md" p="lg">
      <Group gap="xs" mb="md">
        <IconCalendarEvent size={20} />
        <Title order={4}>{t('client.nextSession.title')}</Title>
      </Group>

      <Card radius="md" p={0} style={{ overflow: 'hidden' }}>
        <Group gap={0} align="stretch" wrap="nowrap">
          <Image
            src={null}
            w={220}
            h={160}
            alt={translateService(booking.masterJobTitle)}
            fallbackSrc="https://placehold.co/180x160/e9ecef/868e96?text=Session"
            style={{ objectFit: 'cover', flexShrink: 0 }}
          />

          <Stack gap="sm" p="md" style={{ flex: 1 }}>
            <Group gap="xs">
              <Badge color="blue" variant="filled" size="sm">
                {t('client.nextSession.badges.today')}
              </Badge>
              <Badge color="dark" variant="filled" size="sm">
                {timeUntil}
              </Badge>
            </Group>

            <div>
              <Text fw={600} size="md">
                {translateService(booking.masterJobTitle)}
                {' '}
                {t('client.nextSession.withLabel', { name: booking.masterName })}
              </Text>
            </div>

            <Group gap="xs">
              <IconMapPin size={16} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed">{fullLocation}</Text>
            </Group>

            <Group gap="sm" mt="auto">
              <Button
                variant="filled"
                color="brand"
                size="sm"
                onClick={() => setDrawerOpened(true)}
              >
                {t('client.nextSession.viewDetails')}
              </Button>
            </Group>
          </Stack>
        </Group>
      </Card>

      <ClientBookingDetailsDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        booking={booking}
        onCancel={handleCancel}
        isCancelling={isCancelling}
      />
    </Card>
  );
}
