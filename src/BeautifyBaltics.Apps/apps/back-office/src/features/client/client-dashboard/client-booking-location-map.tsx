import { useTranslation } from 'react-i18next';
import { Box, Text } from '@mantine/core';
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from '@vis.gl/react-google-maps';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface ClientBookingLocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  height?: number;
}

function MapContent({ latitude, longitude }: { latitude: number; longitude: number }) {
  return (
    <Map
      defaultCenter={{ lat: latitude, lng: longitude }}
      defaultZoom={15}
      mapId="booking-location-map"
      gestureHandling="cooperative"
      disableDefaultUI
      zoomControl={false}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <AdvancedMarker position={{ lat: latitude, lng: longitude }}>
        <Pin
          background="var(--mantine-color-brand-6)"
          borderColor="var(--mantine-color-brand-9)"
          glyphColor="white"
          scale={1.2}
        />
      </AdvancedMarker>
    </Map>
  );
}

export function ClientBookingLocationMap({
  latitude,
  longitude,
  height = 140,
}: ClientBookingLocationMapProps) {
  const { t } = useTranslation();
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Box
        h={height}
        bg="var(--mantine-color-gray-1)"
        style={{
          borderRadius: 'var(--mantine-radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="sm" c="dimmed">{t('map.unavailableTitle')}</Text>
      </Box>
    );
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return (
      <Box
        h={height}
        bg="var(--mantine-color-gray-1)"
        style={{
          borderRadius: 'var(--mantine-radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="sm" c="dimmed">{t('map.coordinatesMissing')}</Text>
      </Box>
    );
  }

  return (
    <Box
      h={height}
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        overflow: 'hidden',
      }}
    >
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <MapContent latitude={latitude} longitude={longitude} />
      </APIProvider>
    </Box>
  );
}
