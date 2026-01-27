import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
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
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
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

type LocationDetails = {
  city: string | null;
  country: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  postalCode: string | null;
};

type SelectedLocation = LocationDetails & {
  lat: number;
  lng: number;
};

const isNonEmptyString = (value: string | null | undefined): value is string => (
  typeof value === 'string' && value.trim().length > 0
);

function LocationPickerContent({ value, onChange }: LocationPickerContentProps) {
  const map = useMap();
  const geocodingLib = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<Geocoder | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  useEffect(() => {
    if (typeof value?.latitude !== 'number' || typeof value?.longitude !== 'number') {
      setSelectedLocation(null);
      return;
    }

    setSelectedLocation({
      lat: value.latitude,
      lng: value.longitude,
      city: value.city ?? null,
      country: value.country ?? null,
      addressLine1: value.addressLine1 ?? null,
      addressLine2: value.addressLine2 ?? null,
      postalCode: value.postalCode ?? null,
    });
  }, [
    value?.latitude,
    value?.longitude,
    value?.city,
    value?.country,
    value?.addressLine1,
    value?.addressLine2,
    value?.postalCode,
  ]);

  useEffect(() => {
    if (geocodingLib) {
      setGeocoder(new geocodingLib.Geocoder() as Geocoder);
    }
  }, [geocodingLib]);

  const emptyDetails = useMemo<LocationDetails>(() => ({
    city: null,
    country: null,
    addressLine1: null,
    addressLine2: null,
    postalCode: null,
  }), []);

  const parseLocationDetails = useCallback((components: GeocoderAddressComponent[]): LocationDetails => {
    if (!components.length) {
      return emptyDetails;
    }

    let city: string | null = null;
    let country: string | null = null;
    let postalCode: string | null = null;
    let streetNumber: string | null = null;
    let route: string | null = null;
    let sublocality: string | null = null;
    let neighborhood: string | null = null;
    let adminAreaLevel2: string | null = null;

    components.forEach((component) => {
      if (!city && (component.types.includes('locality') || component.types.includes('postal_town'))) {
        city = component.long_name;
      }
      if (!country && component.types.includes('country')) {
        country = component.long_name;
      }
      if (!postalCode && component.types.includes('postal_code')) {
        postalCode = component.long_name;
      }
      if (!streetNumber && component.types.includes('street_number')) {
        streetNumber = component.long_name;
      }
      if (!route && component.types.includes('route')) {
        route = component.long_name;
      }
      if (!sublocality && component.types.includes('sublocality')) {
        sublocality = component.long_name;
      }
      if (!neighborhood && component.types.includes('neighborhood')) {
        neighborhood = component.long_name;
      }
      if (!adminAreaLevel2 && component.types.includes('administrative_area_level_2')) {
        adminAreaLevel2 = component.long_name;
      }
    });

    const addressLine1Segments = [streetNumber, route].filter(isNonEmptyString);
    const addressLine1 = addressLine1Segments.join(' ').trim();
    const addressLine2 = sublocality ?? neighborhood ?? adminAreaLevel2 ?? null;

    return {
      city,
      country,
      postalCode,
      addressLine1: addressLine1 || route || null,
      addressLine2,
    };
  }, [emptyDetails]);

  const reverseGeocode = useCallback(
    (lat: number, lng: number): Promise<LocationDetails> => {
      if (!geocoder) return Promise.resolve(emptyDetails);

      return geocoder
        .geocode({ location: { lat, lng } })
        .then((response) => {
          const components = response.results
            ?.flatMap((result) => result.address_components)
            ?? [];

          return parseLocationDetails(components);
        })
        .catch(() => emptyDetails);
    },
    [emptyDetails, geocoder, parseLocationDetails],
  );

  const upsertLocation = useCallback(
    (lat: number, lng: number, shouldPan = false) => {
      setIsGeocoding(true);
      reverseGeocode(lat, lng)
        .then(({
          city, country, addressLine1, addressLine2, postalCode,
        }) => {
          const location = {
            lat,
            lng,
            city,
            country,
            addressLine1,
            addressLine2,
            postalCode,
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
            addressLine1,
            addressLine2,
            postalCode,
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

  const locationLineOne = selectedLocation
    ? [selectedLocation.addressLine1, selectedLocation.addressLine2].filter(isNonEmptyString).join(', ')
    : '';
  const locationLineTwo = selectedLocation
    ? [selectedLocation.postalCode, selectedLocation.city, selectedLocation.country].filter(isNonEmptyString).join(', ')
    : '';
  const fallbackLocation = selectedLocation
    ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
    : '';
  const primarySummary = selectedLocation ? (locationLineOne || locationLineTwo || fallbackLocation) : '';
  const secondarySummary = selectedLocation && locationLineOne && locationLineTwo ? locationLineTwo : '';

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
            <Group gap="xs" align="flex-start">
              <MapPin size={16} />
              <Stack gap={2}>
                <Text size="sm">
                  {primarySummary}
                </Text>
                {secondarySummary ? (
                  <Text size="xs" c="dimmed">
                    {secondarySummary}
                  </Text>
                ) : null}
              </Stack>
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
