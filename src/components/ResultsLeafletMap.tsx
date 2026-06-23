'use client'

import { useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import type { MapCenterPoint, MapVideo } from '@/components/MapAfter'

type ResultsLeafletMapProps = {
  center: MapCenterPoint
  videos: MapVideo[]
  selectedVideoId: string
  onSelectVideo: (videoId: string) => void
}

function MapCenter({ center }: { center: MapCenterPoint }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, 15, { animate: true })
  }, [center, map])

  return null
}

export function ResultsLeafletMap({
  center,
  onSelectVideo,
  selectedVideoId,
  videos
}: ResultsLeafletMapProps) {
  return (
    <MapContainer center={center} scrollWheelZoom={false} zoom={15}>
      <MapCenter center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {videos.map(video =>
        video.location ? (
          <CircleMarker
            center={[video.location.lat, video.location.lng]}
            eventHandlers={{
              click: () => onSelectVideo(video.id)
            }}
            key={video.id}
            pathOptions={{
              color:
                video.id === selectedVideoId
                  ? 'var(--mui-palette-primary-main)'
                  : 'var(--mui-palette-secondary-main)',
              fillColor:
                video.id === selectedVideoId
                  ? 'var(--mui-palette-primary-main)'
                  : 'var(--mui-palette-secondary-main)',
              fillOpacity: 0.72
            }}
            radius={video.id === selectedVideoId ? 12 : 8}
          >
            <Popup>{video.name}</Popup>
          </CircleMarker>
        ) : null
      )}
    </MapContainer>
  )
}
