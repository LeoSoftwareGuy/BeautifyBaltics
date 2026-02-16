import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
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
  geometry?: {
    location?: {
      lat: number | (() => number);
      lng: number | (() => number);
    };
  };
};

type GeocoderResponse = {
  results?: GeocoderResult[];
};

type GeocodeRequest =
  | { location: { lat: number; lng: number } }
  | { address: string };

type Geocoder = {
  geocode: (request: GeocodeRequest) => Promise<GeocoderResponse>;
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
  const { t } = useTranslation();
  const [manualAddress, setManualAddress] = useState<LocationDetails>({
    city: value?.city ?? null,
    country: value?.country ?? null,
    addressLine1: value?.addressLine1 ?? null,
    addressLine2: value?.addressLine2 ?? null,
    postalCode: value?.postalCode ?? null,
  });
  const [manualError, setManualError] = useState<string | null>(null);

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

  const updateManualAddress = useCallback((updates: Partial<LocationDetails>) => {
    setManualAddress((prev) => ({
      ...emptyDetails,
      ...(prev ?? emptyDetails),
      ...updates,
    }));
  }, [emptyDetails]);

  useEffect(() => {
    if (typeof value?.latitude !== 'number' || typeof value?.longitude !== 'number') {
      setSelectedLocation(null);
      return;
    }

    const syncedDetails: SelectedLocation = {
      lat: value.latitude,
      lng: value.longitude,
      city: value.city ?? null,
      country: value.country ?? null,
      addressLine1: value.addressLine1 ?? null,
      addressLine2: value.addressLine2 ?? null,
      postalCode: value.postalCode ?? null,
    };
    setSelectedLocation(syncedDetails);
    updateManualAddress({
      city: syncedDetails.city,
      country: syncedDetails.country,
      addressLine1: syncedDetails.addressLine1,
      addressLine2: syncedDetails.addressLine2,
      postalCode: syncedDetails.postalCode,
    });
  }, [
    updateManualAddress,
    value?.addressLine1,
    value?.addressLine2,
    value?.city,
    value?.country,
    value?.latitude,
    value?.longitude,
    value?.postalCode,
  ]);

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

  const applyLocation = useCallback(
    (
      lat: number,
      lng: number,
      details: LocationDetails,
      options?: { pan?: boolean },
    ) => {
      setSelectedLocation({
        lat,
        lng,
        ...details,
      });
      updateManualAddress({
        city: details.city ?? null,
        country: details.country ?? null,
        addressLine1: details.addressLine1 ?? null,
        addressLine2: details.addressLine2 ?? null,
        postalCode: details.postalCode ?? null,
      });

      if (options?.pan) {
        map?.panTo({ lat, lng });
      }

      onChange?.({
        latitude: lat,
        longitude: lng,
        ...details,
      });
    },
    [map, onChange, updateManualAddress],
  );

  const upsertLocation = useCallback(
    (lat: number, lng: number, shouldPan = false) => {
      setIsGeocoding(true);
      reverseGeocode(lat, lng)
        .then(({
          city, country, addressLine1, addressLine2, postalCode,
        }) => {
          applyLocation(
            lat,
            lng,
            {
              city,
              country,
              addressLine1,
              addressLine2,
              postalCode,
            },
            { pan: shouldPan },
          );
        })
        .finally(() => {
          setIsGeocoding(false);
        });
    },
    [applyLocation, reverseGeocode],
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
              {t('map.locationPicker.clickHint')}
            </Text>
          )}
        </Box>

        <Button
          variant="light"
          size="xs"
          leftSection={<Navigation size={14} />}
          onClick={handleUseMyLocation}
        >
          {t('map.locationPicker.useMyLocation')}
        </Button>
      </Group>

      <Card withBorder radius="md" p="md">
        <Stack gap="xs">
          <Text fw={600} size="sm">{t('map.locationPicker.manualTitle')}</Text>
          <Text size="xs" c="dimmed">
            {t('map.locationPicker.manualDescription')}
          </Text>
          <TextInput
            label={t('map.locationPicker.addressLine1')}
            value={manualAddress.addressLine1 ?? ''}
            onChange={(event) => {
              setManualError(null);
              updateManualAddress({ addressLine1: event.currentTarget.value || null });
            }}
          />
          <TextInput
            label={t('map.locationPicker.addressLine2')}
            value={manualAddress.addressLine2 ?? ''}
            onChange={(event) => {
              setManualError(null);
              updateManualAddress({ addressLine2: event.currentTarget.value || null });
            }}
          />
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <TextInput
              label={t('map.locationPicker.city')}
              value={manualAddress.city ?? ''}
              onChange={(event) => {
                setManualError(null);
                updateManualAddress({ city: event.currentTarget.value || null });
              }}
            />
            <TextInput
              label={t('map.locationPicker.postalCode')}
              value={manualAddress.postalCode ?? ''}
              onChange={(event) => {
                setManualError(null);
                updateManualAddress({ postalCode: event.currentTarget.value || null });
              }}
            />
            <TextInput
              label={t('map.locationPicker.country')}
              value={manualAddress.country ?? ''}
              onChange={(event) => {
                setManualError(null);
                updateManualAddress({ country: event.currentTarget.value || null });
              }}
            />
          </SimpleGrid>
          {manualError && (
            <Text size="xs" c="red">
              {manualError}
            </Text>
          )}
          <Group justify="flex-end">
            <Button
              variant="light"
              size="xs"
              onClick={() => {
                updateManualAddress({
                  city: null,
                  country: null,
                  addressLine1: null,
                  addressLine2: null,
                  postalCode: null,
                });
                setManualError(null);
              }}
            >
              {t('map.locationPicker.clear')}
            </Button>
            <Button
              size="xs"
              onClick={() => {
                const segments = [
                  manualAddress.addressLine1,
                  manualAddress.addressLine2,
                  manualAddress.city,
                  manualAddress.postalCode,
                  manualAddress.country,
                ].filter(isNonEmptyString);

                if (segments.length < 2) {
                  setManualError(t('map.locationPicker.manualErrorMissingFields'));
                  return;
                }

                if (!geocoder) {
                  setManualError(t('map.locationPicker.manualErrorUnavailable'));
                  return;
                }

                setIsGeocoding(true);
                setManualError(null);
                geocoder
                  .geocode({ address: segments.join(', ') })
                  .then((response) => {
                    const firstResult = response.results?.[0];
                    const location = firstResult?.geometry?.location;
                    if (!firstResult || !location) {
                      throw new Error('NO_RESULT');
                    }

                    const lat = typeof location.lat === 'function' ? location.lat() : location.lat;
                    const lng = typeof location.lng === 'function' ? location.lng() : location.lng;

                    const parsedDetails = parseLocationDetails(
                      firstResult.address_components ?? [],
                    );

                    applyLocation(
                      lat,
                      lng,
                      {
                        city: manualAddress.city || parsedDetails.city,
                        country: manualAddress.country || parsedDetails.country,
                        addressLine1: manualAddress.addressLine1 || parsedDetails.addressLine1,
                        addressLine2: manualAddress.addressLine2 || parsedDetails.addressLine2,
                        postalCode: manualAddress.postalCode || parsedDetails.postalCode,
                      },
                      { pan: true },
                    );
                  })
                  .catch(() => {
                    setManualError(t('map.locationPicker.manualErrorGeocode'));
                  })
                  .finally(() => {
                    setIsGeocoding(false);
                  });
              }}
              loading={isGeocoding}
            >
              {t('map.locationPicker.apply')}
            </Button>
          </Group>
        </Stack>
      </Card>
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
