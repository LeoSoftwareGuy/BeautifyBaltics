import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

interface Master {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  location: { lat: number; lng: number };
  image: string;
}

interface MapViewProps {
  masters: Master[];
  onMarkerClick?: (master: Master) => void;
}

const MapView = ({ masters, onMarkerClick }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 12,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    map.current.on("load", () => {
      if (!map.current) return;

      // Add source for markers
      map.current.addSource("masters", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: masters.map((master) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [master.location.lng, master.location.lat],
            },
            properties: {
              id: master.id,
              name: master.name,
              category: master.category,
              rating: master.rating,
              reviews: master.reviews,
              price: master.price,
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add cluster circle layer
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "masters",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "hsl(350, 70%, 68%)",
            10,
            "hsl(350, 75%, 60%)",
            30,
            "hsl(350, 80%, 50%)",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // Add cluster count layer
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "masters",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 14,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Add unclustered point layer
      map.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "masters",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "hsl(350, 70%, 68%)",
          "circle-radius": 12,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#fff",
        },
      });

      // Click event for clusters
      map.current.on("click", "clusters", (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        const source = map.current.getSource("masters") as mapboxgl.GeoJSONSource;
        
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !map.current) return;
          const coordinates = (features[0].geometry as any).coordinates;
          map.current.easeTo({
            center: coordinates,
            zoom: zoom,
          });
        });
      });

      // Click event for individual markers
      map.current.on("click", "unclustered-point", (e) => {
        if (!e.features || !e.features[0]) return;
        const properties = e.features[0].properties;
        const master = masters.find((m) => m.id === properties.id);
        if (master && onMarkerClick) {
          onMarkerClick(master);
        }
      });

      // Change cursor on hover
      map.current.on("mouseenter", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      map.current.on("mouseenter", "unclustered-point", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "unclustered-point", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    });

    setIsInitialized(true);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setMapboxToken(tokenInput);
      initializeMap(tokenInput);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="h-full bg-muted rounded-lg flex items-center justify-center p-8">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center mb-4">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get your free token at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZS..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="font-mono text-sm"
            />
            <Button type="submit" className="w-full">
              Initialize Map
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            💡 For production, store tokens securely in Lovable Cloud
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="h-full w-full rounded-lg shadow-lg overflow-hidden" />
  );
};

export default MapView;
