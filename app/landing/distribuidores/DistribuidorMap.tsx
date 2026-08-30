"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  GeoJSON,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Distributor {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
}

interface Props {
  distributors: Distributor[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const PERU_CENTER: L.LatLngTuple = [-9.19, -75.015];
const PERU_ZOOM = 5;

const deptStyle: L.PathOptions = {
  color: "#0e1469",
  weight: 1,
  opacity: 0.18,
  fillColor: "#0e1469",
  fillOpacity: 0.03,
};

function MapController({
  distributors,
  selectedId,
}: {
  distributors: Distributor[];
  selectedId: string | null;
}) {
  const map = useMap();
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    if (!selectedId) {
      map.flyTo(PERU_CENTER, PERU_ZOOM, { duration: 1 });
      return;
    }

    const d = distributors.find((d) => d.id === selectedId);
    if (d) {
      map.flyTo([d.lat, d.lng], 15, { duration: 1.2 });
    }
  }, [selectedId, distributors, map]);

  return null;
}

export default function DistribuidorMap({
  distributors,
  selectedId,
  onSelect,
}: Props) {
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(
    null,
  );

  useEffect(() => {
    fetch("/geo/peru-departments.json")
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => {});
  }, []);

  return (
    <MapContainer
      center={PERU_CENTER}
      zoom={PERU_ZOOM}
      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />

      {geoData && <GeoJSON data={geoData} style={deptStyle} />}

      {distributors.map((d) => (
        <CircleMarker
          key={d.id}
          center={[d.lat, d.lng]}
          radius={selectedId === d.id ? 10 : 7}
          pathOptions={{
            color: "#fff",
            weight: 2.5,
            fillColor: "#fe0008",
            fillOpacity: selectedId === d.id ? 1 : 0.75,
          }}
          eventHandlers={{ click: () => onSelect(d.id) }}
        >
          <Popup>
            <strong>{d.name}</strong>
            <br />
            <span style={{ fontSize: "12px", color: "#555" }}>{d.address}</span>
          </Popup>
        </CircleMarker>
      ))}

      <MapController distributors={distributors} selectedId={selectedId} />
    </MapContainer>
  );
}
