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
import { useMediaQuery } from '@mantine/hooks';
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
  const isMobile = useMediaQuery('(max-width: 62em)');
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
    <Card
      radius="md"
      p="lg"
      style={{ background: 'linear-gradient(135deg, #d8557a 0%, #e8738f 100%)', overflow: 'hidden' }}
    >
      <Group gap="xs" mb="md">
        <IconCalendarEvent size={20} color="#fff" style={{ opacity: 0.85 }} />
        <Title order={4} style={{ color: '#fff' }}>{t('client.nextSession.title')}</Title>
      </Group>

      <Box style={{ borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.15)' }}>
        <Group gap={0} align="stretch" wrap="nowrap">
          {!isMobile && (
            <Image
              src="/salon.jpg"
              w={220}
              h={160}
              alt={translateService(booking.masterJobTitle)}
              style={{ objectFit: 'cover', flexShrink: 0 }}
            />
          )}

          <Stack gap="sm" p="md" style={{ flex: 1 }}>
            <Group gap="xs">
              <Badge variant="white" color="pink" size="sm">
                {t('client.nextSession.badges.today')}
              </Badge>
              <Badge style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }} size="sm">
                {timeUntil}
              </Badge>
            </Group>

            <div>
              <Text fw={600} size="md" style={{ color: '#fff' }}>
                {translateService(booking.masterJobTitle)}
                {' '}
                {t('client.nextSession.withLabel', { name: booking.masterName })}
              </Text>
            </div>

            <Group gap="xs">
              <IconMapPin size={16} color="#fff" style={{ opacity: 0.75 }} />
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{fullLocation}</Text>
            </Group>

            <Group gap="sm" mt="auto">
              <Button
                variant="white"
                color="pink"
                size="sm"
                onClick={() => setDrawerOpened(true)}
              >
                {t('client.nextSession.viewDetails')}
              </Button>
            </Group>
          </Stack>
        </Group>
      </Box>

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
