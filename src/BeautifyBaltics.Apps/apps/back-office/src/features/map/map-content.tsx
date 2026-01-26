import { useCallback, useMemo } from 'react';
import {
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';

import type { MasterDTO } from '@/state/endpoints/api.schemas';

const DEFAULT_CENTER = { lat: 59.437, lng: 24.7536 }; // Tallinn, Estonia
const DEFAULT_ZOOM = 10;

export interface MapContentProps {
  masters: MasterDTO[];
  selectedMasterId?: string | null;
  onSelectMaster?: (masterId: string) => void;
  userLocation?: { lat: number; lng: number } | null;
}

interface MasterMarkerProps {
  master: MasterDTO;
  isSelected: boolean;
  onClick: () => void;
}

function MasterMarker({ master, isSelected, onClick }: MasterMarkerProps) {
  if (!master.latitude || !master.longitude) return null;

  return (
    <AdvancedMarker
      position={{ lat: master.latitude, lng: master.longitude }}
      onClick={onClick}
      title={`${master.firstName} ${master.lastName}`}
    >
      <Pin
        background={isSelected ? 'var(--mantine-color-brand-6)' : '#6f283b'}
        borderColor={isSelected ? 'var(--mantine-color-brand-9)' : '#4a1a28'}
        glyphColor="white"
        scale={isSelected ? 1.3 : 1}
      />
    </AdvancedMarker>
  );
}

function MapContent({
  masters,
  selectedMasterId,
  onSelectMaster,
  userLocation,
}: MapContentProps) {
  const map = useMap();

  const mastersWithLocation = useMemo(
    () => masters.filter((m) => m.latitude != null && m.longitude != null),
    [masters],
  );

  const center = useMemo(() => {
    if (userLocation) {
      return userLocation;
    }

    if (mastersWithLocation.length > 0) {
      const avgLat = mastersWithLocation.reduce((sum, m) => sum + (m.latitude ?? 0), 0)
        / mastersWithLocation.length;
      const avgLng = mastersWithLocation.reduce((sum, m) => sum + (m.longitude ?? 0), 0)
        / mastersWithLocation.length;
      return { lat: avgLat, lng: avgLng };
    }

    return DEFAULT_CENTER;
  }, [mastersWithLocation, userLocation]);

  const handleMarkerClick = useCallback(
    (masterId: string) => {
      const master = masters.find((m) => m.id === masterId);
      if (master?.latitude && master?.longitude && map) {
        map.panTo({ lat: master.latitude, lng: master.longitude });
      }
      onSelectMaster?.(masterId);
    },
    [masters, map, onSelectMaster],
  );

  return (
    <Map
      defaultCenter={center}
      defaultZoom={DEFAULT_ZOOM}
      mapId="masters-map"
      gestureHandling="greedy"
      disableDefaultUI={false}
      style={{ width: '100%', height: '100%' }}
    >
      {mastersWithLocation.map((master) => (
        <MasterMarker
          key={master.id}
          master={master}
          isSelected={selectedMasterId === master.id}
          onClick={() => master.id && handleMarkerClick(master.id)}
        />
      ))}
    </Map>
  );
}

export default MapContent;
