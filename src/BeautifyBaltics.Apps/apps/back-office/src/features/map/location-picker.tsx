import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Card, Group, Loader, Stack, Text,
} from '@mantine/core';
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapMouseEvent,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Default center: Tallinn, Estonia
const DEFAULT_CENTER = { lat: 59.437, lng: 24.7536 };
const DEFAULT_ZOOM = 12;

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
}

interface LocationPickerProps {
  value?: Partial<LocationData> | null;
  onChange?: (location: LocationData) => void;
  height?: number | string;
}

interface LocationPickerContentProps {
  value?: Partial<LocationData> | null;
  onChange?: (location: LocationData) => void;
}

type GeocoderAddressComponent = {
  long_name: string;
  types: string[];
};

type GeocoderResult = {
  address_components: GeocoderAddressComponent[];
};

type GeocoderResponse = {
  results?: GeocoderResult[];
};

type Geocoder = {
  geocode: (request: { location: { lat: number; lng: number } }) => Promise<GeocoderResponse>;
};

function LocationPickerContent({ value, onChange }: LocationPickerContentProps) {
  const map = useMap();
  const geocodingLib = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<Geocoder | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    city: string | null;
    country: string | null;
  } | null>(
    value?.latitude && value?.longitude
      ? {
        lat: value.latitude,
        lng: value.longitude,
        city: value.city ?? null,
        country: value.country ?? null,
      }
      : null,
  );

  useEffect(() => {
    if (geocodingLib) {
      setGeocoder(new geocodingLib.Geocoder() as Geocoder);
    }
  }, [geocodingLib]);

  const reverseGeocode = useCallback(
    (lat: number, lng: number): Promise<{ city: string | null; country: string | null }> => {
      if (!geocoder) return Promise.resolve({ city: null, country: null });

      return geocoder
        .geocode({ location: { lat, lng } })
        .then((response) => {
          const components = response.results
            ?.flatMap((result) => result.address_components)
            ?? [];

          const locations = components.reduce(
            (acc, component) => {
              const updates = { ...acc };
              if (!updates.city && component.types.includes('locality')) {
                updates.city = component.long_name;
              }
              if (!updates.country && component.types.includes('country')) {
                updates.country = component.long_name;
              }
              return updates;
            },
            { city: null as string | null, country: null as string | null },
          );

          return locations;
        })
        .catch(() => ({ city: null, country: null }));
    },
    [geocoder],
  );

  const upsertLocation = useCallback(
    (lat: number, lng: number, shouldPan = false) => {
      setIsGeocoding(true);
      reverseGeocode(lat, lng)
        .then(({ city, country }) => {
          const location = {
            lat, lng, city, country,
          };
          setSelectedLocation(location);

          if (shouldPan) {
            map?.panTo({ lat, lng });
          }

          onChange?.({
            latitude: lat,
            longitude: lng,
            city,
            country,
          });
        })
        .finally(() => {
          setIsGeocoding(false);
        });
    },
    [map, onChange, reverseGeocode],
  );

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      const { latLng } = event.detail;
      if (!latLng) return;

      const latValue = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
      const lngValue = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;

      upsertLocation(latValue, lngValue);
    },
    [upsertLocation],
  );

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        upsertLocation(position.coords.latitude, position.coords.longitude, true);
      },
      () => {
      },
    );
  }, [upsertLocation]);

  const center = selectedLocation
    ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
    : DEFAULT_CENTER;

  return (
    <Stack gap="sm">
      <Box pos="relative" style={{ borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden' }}>
        <Map
          defaultCenter={center}
          defaultZoom={DEFAULT_ZOOM}
          mapId="location-picker-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          style={{ width: '100%', height: 300 }}
        >
          {selectedLocation && (
            <AdvancedMarker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}>
              <Pin
                background="#6f283b"
                borderColor="#4a1a28"
                glyphColor="white"
                scale={1.2}
              />
            </AdvancedMarker>
          )}
        </Map>

        {isGeocoding && (
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(255,255,255,0.7)"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Loader size="sm" />
          </Box>
        )}
      </Box>

      <Group justify="space-between" align="flex-start">
        <Box>
          {selectedLocation ? (
            <Group gap="xs">
              <MapPin size={16} />
              <Text size="sm">
                {[selectedLocation.city, selectedLocation.country].filter(Boolean).join(', ')
                  || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
              </Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">
              Click on the map to set your location
            </Text>
          )}
        </Box>

        <Button
          variant="light"
          size="xs"
          leftSection={<Navigation size={14} />}
          onClick={handleUseMyLocation}
        >
          Use my location
        </Button>
      </Group>
    </Stack>
  );
}

function LocationPicker({ value, onChange, height = 'auto' }: LocationPickerProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card radius="md" withBorder h={height} pos="relative">
        <Stack justify="center" align="center" h="100%">
          <Text c="dimmed">Location picker unavailable</Text>
          <Text size="sm" c="dimmed">
            Google Maps API key is not configured
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <LocationPickerContent value={value} onChange={onChange} />
    </APIProvider>
  );
}

export default LocationPicker;
