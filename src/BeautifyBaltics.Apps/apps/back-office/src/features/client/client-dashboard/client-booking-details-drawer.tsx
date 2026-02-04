import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCalendar,
  IconClock,
  IconCurrencyDollar,
  IconMail,
  IconPhone,
  IconTool,
  IconX,
} from '@tabler/icons-react';

import { BookingStatus, FindBookingsResponse } from '@/state/endpoints/api.schemas';
import { useGetMasterById } from '@/state/endpoints/masters';
import datetime from '@/utils/datetime';

import { ClientBookingLocationMap } from './client-booking-location-map';

interface ClientBookingDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
  booking: FindBookingsResponse | null;
  onCancel: (bookingId: string) => void;
  isCancelling: boolean;
}

function getStatusColor(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.Confirmed:
      return 'green';
    case BookingStatus.Requested:
      return 'yellow';
    case BookingStatus.Completed:
      return 'blue';
    case BookingStatus.Cancelled:
      return 'red';
    default:
      return 'gray';
  }
}

function canCancelBooking(booking: FindBookingsResponse): boolean {
  if (booking.status === BookingStatus.Cancelled || booking.status === BookingStatus.Completed) {
    return false;
  }
  const scheduledAt = new Date(booking.scheduledAt);
  const hoursUntilBooking = (scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilBooking >= 24;
}

export function ClientBookingDetailsDrawer({
  opened,
  onClose,
  booking,
  onCancel,
  isCancelling,
}: ClientBookingDetailsDrawerProps) {
  const { data: master, isLoading: isMasterLoading } = useGetMasterById(
    booking?.masterId ?? '',
    { id: booking?.masterId ?? '' },
    { query: { enabled: !!booking?.masterId && opened } },
  );

  if (!booking) {
    return null;
  }

  const location = [
    booking.locationAddressLine1,
    booking.locationAddressLine2,
    booking.locationCity,
    booking.locationCountry,
  ].filter(Boolean).join(', ') || 'Location not specified';

  const showCancelButton = canCancelBooking(booking);

  const handleCancel = () => {
    onCancel(booking.id);
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={null}
      size="md"
      position="right"
      overlayProps={{ opacity: 0.4, blur: 2 }}
      styles={{
        header: { display: 'none' },
        body: {
          padding: 0, height: '100%', display: 'flex', flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <ThemeIcon
              variant="light"
              size="lg"
              radius="xl"
              color="gray"
              onClick={onClose}
              style={{ cursor: 'pointer' }}
            >
              <IconX size={18} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="lg">Booking Details</Text>
              <Group gap="xs">
                <Box
                  w={8}
                  h={8}
                  style={{
                    borderRadius: '50%',
                    backgroundColor: `var(--mantine-color-${getStatusColor(booking.status)}-6)`,
                  }}
                />
                <Text size="xs" fw={600} c={getStatusColor(booking.status)} tt="uppercase">
                  {booking.status}
                </Text>
              </Group>
            </div>
          </Group>
          <Text size="sm" c="dimmed">
            #
            {booking.id.slice(0, 8).toUpperCase()}
          </Text>
        </Group>
      </Box>

      {/* Scrollable Content */}
      <ScrollArea style={{ flex: 1 }} type="auto">
        {/* Master Profile */}
        <Box p="md">
          <Group gap="md">
            {isMasterLoading ? (
              <Skeleton height={56} width={56} radius="md" />
            ) : (
              <Avatar
                src={master?.profileImageUrl}
                size="lg"
                radius="md"
              >
                {booking.masterName?.charAt(0)}
              </Avatar>
            )}
            <div>
              <Text fw={700} size="lg">{booking.masterName}</Text>
              <Text size="sm" c="dimmed">{booking.masterJobTitle}</Text>
            </div>
          </Group>
        </Box>

        {/* Service Details Grid */}
        <Box px="md" pb="md">
          <SimpleGrid cols={2} spacing="sm">
            <Paper p="md" radius="md" withBorder bg="var(--mantine-color-gray-0)">
              <Group gap="xs" mb={4}>
                <IconTool size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Service</Text>
              </Group>
              <Text fw={700}>{booking.masterJobTitle}</Text>
            </Paper>

            <Paper p="md" radius="md" withBorder bg="var(--mantine-color-gray-0)">
              <Group gap="xs" mb={4}>
                <IconCurrencyDollar size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Price</Text>
              </Group>
              <Text fw={700} c="brand">
                €
                {booking.price.toFixed(2)}
              </Text>
            </Paper>

            <Paper p="md" radius="md" withBorder bg="var(--mantine-color-gray-0)">
              <Group gap="xs" mb={4}>
                <IconClock size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Duration</Text>
              </Group>
              <Text fw={700}>{booking.duration}</Text>
            </Paper>

            <Paper p="md" radius="md" withBorder bg="var(--mantine-color-gray-0)">
              <Group gap="xs" mb={4}>
                <IconCalendar size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Date</Text>
              </Group>
              <Text fw={700}>{datetime.formatDate(booking.scheduledAt)}</Text>
            </Paper>
          </SimpleGrid>
        </Box>

        {/* Location */}
        <Box px="md" pb="md">
          <Text size="sm" fw={700} tt="uppercase" mb="sm" c="dimmed">Service Location</Text>
          <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
            <ClientBookingLocationMap
              latitude={master?.latitude}
              longitude={master?.longitude}
            />
            <Box p="md">
              <Text size="sm">{location}</Text>
            </Box>
          </Paper>
        </Box>

        <Divider />

        {/* Booking Info */}
        <Box p="md" bg="var(--mantine-color-gray-0)">
          <Text size="sm" fw={700} tt="uppercase" mb="sm" c="dimmed">Booking Info</Text>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Scheduled Time</Text>
              <Text size="sm" fw={500}>{datetime.formatTimeFromDate(booking.scheduledAt)}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Status</Text>
              <Badge color={getStatusColor(booking.status)} variant="light">
                {booking.status}
              </Badge>
            </Group>
          </Stack>
        </Box>

        <Divider />

        {/* Contact Details */}
        <Box p="md" bg="var(--mantine-color-gray-0)">
          <Text size="sm" fw={700} tt="uppercase" mb="sm" c="dimmed">Contact Details</Text>
          <Stack gap="sm">
            {isMasterLoading ? (
              <>
                <Skeleton height={48} radius="md" />
                <Skeleton height={48} radius="md" />
              </>
            ) : (
              <>
                {master?.email && (
                  <Paper p="sm" radius="md" withBorder>
                    <Group gap="sm">
                      <ThemeIcon variant="light" color="gray" size="md" radius="md">
                        <IconMail size={16} />
                      </ThemeIcon>
                      <Text size="sm">{master.email}</Text>
                    </Group>
                  </Paper>
                )}
                {master?.phoneNumber && (
                  <Paper p="sm" radius="md" withBorder>
                    <Group gap="sm">
                      <ThemeIcon variant="light" color="gray" size="md" radius="md">
                        <IconPhone size={16} />
                      </ThemeIcon>
                      <Text size="sm">{master.phoneNumber}</Text>
                    </Group>
                  </Paper>
                )}
                {!master?.email && !master?.phoneNumber && (
                  <Text size="sm" c="dimmed">No contact details available</Text>
                )}
              </>
            )}
          </Stack>
        </Box>
      </ScrollArea>

      {/* Footer Actions */}
      {showCancelButton && (
        <Box
          p="md"
          style={{
            borderTop: '1px solid var(--mantine-color-gray-3)',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Button
            fullWidth
            variant="outline"
            color="red"
            size="md"
            leftSection={<IconX size={18} />}
            onClick={handleCancel}
            loading={isCancelling}
          >
            Cancel Booking
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
