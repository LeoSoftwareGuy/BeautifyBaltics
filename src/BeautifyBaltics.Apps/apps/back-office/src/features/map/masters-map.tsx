import { Card, Stack, Text } from '@mantine/core';
import { APIProvider } from '@vis.gl/react-google-maps';

import type { MasterDTO } from '@/state/endpoints/api.schemas';

import MapContent from './map-content';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface MastersMapProps {
  masters: MasterDTO[];
  selectedMasterId?: string | null;
  onSelectMaster?: (masterId: string) => void;
  height?: number | string;
  userLocation?: { lat: number; lng: number } | null;
}

function MastersMap({
  masters,
  selectedMasterId,
  onSelectMaster,
  height = 600,
  userLocation,
}: MastersMapProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card radius="lg" withBorder h={height} pos="relative">
        <Stack justify="center" align="center" h="100%">
          <Text c="dimmed">Map unavailable</Text>
          <Text size="sm" c="dimmed">
            Google Maps API key is not configured
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card radius="lg" withBorder h={height} pos="relative" p={0} style={{ overflow: 'hidden' }}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <MapContent
          masters={masters}
          selectedMasterId={selectedMasterId}
          onSelectMaster={onSelectMaster}
          userLocation={userLocation}
        />
      </APIProvider>
    </Card>
  );
}

export default MastersMap;
