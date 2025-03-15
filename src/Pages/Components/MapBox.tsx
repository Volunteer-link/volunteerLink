import React, { useCallback, useRef, useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import type { MapRef } from 'react-map-gl/mapbox';
import mapboxgl, { MapMouseEvent } from 'mapbox-gl';

interface MarkerPosition {
  longitude: number;
  latitude: number;
}

const MapBox = ({
  marker,
  setMarker,
}: {
  marker: MarkerPosition | null;
  setMarker: (marker: MarkerPosition) => void;
}) => {
  const [viewport, setViewport] = useState({
    latitude: 37.7577, // Vị trí mặc định Hà Nội
    longitude: -122.4376,
    zoom: 8,
  });
  const mapRef = useRef<MapRef>(null);
  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      // Khởi tạo Mapbox Geocoder
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.REACT_APP_MAPBOX_CLIENTID as string,
        mapboxgl: require('mapbox-gl'),
      });

      map?.addControl(geocoder);
      // Xử lý sự kiện khi tìm kiếm
      geocoder.on('result', (e: any) => {
        const { coordinates } = e.result.geometry;
        setViewport({
          ...viewport,
          latitude: coordinates[1],
          longitude: coordinates[0],
          zoom: 12,
        });
      });
    }
  }, []);

  const handleMapClick = (event: MapMouseEvent) => {
    const { lngLat } = event;

    // Lưu trữ tọa độ vào state marker
    setMarker({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
    });
  };
  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_CLIENTID as string}
      initialViewState={{
        longitude: 105.804817,
        latitude: 21.028511,
        zoom: 14,
      }}
      onLoad={onMapLoad}
      ref={mapRef}
      dragRotate={false}
      onMove={(evt) => setViewport(evt.viewState)}
      onClick={handleMapClick}
      style={{ position: 'relative', width: '100%', height: '400px' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <div className="searchbar">
        <div id="geocoder" />
      </div>
      {marker && (
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          color="red"
        />
      )}
    </Map>
  );
};

export default MapBox;
