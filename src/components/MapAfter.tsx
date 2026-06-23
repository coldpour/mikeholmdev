'use client'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ScheduleIcon from '@mui/icons-material/Schedule'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'

import { withBasePath } from '@/app/paths'

type Video = {
  id: string
  name: string
  date: string
  duration: string
  location?: {
    lat: number
    lng: number
  }
}

type Result = {
  id: string
  videoId: Video['id']
  timestamp: string
  label: string
  confidence: number
}

type Camera = {
  id: string
  name: string
  videos: Array<Video['id']>
  location?: {
    lat: number
    lng: number
  }
  venueMap?: {
    image: string
    name: string
    location: {
      x: number
      y: number
    }
    look: {
      direction: number
      arc: number
      distance: number
    }
  }
}

type MapMode = 'geo' | 'venue'

export type MapVideo = Video
export type MapCenterPoint = [number, number]

const ResultsLeafletMap = dynamic(
  () => import('@/components/ResultsLeafletMap').then(mod => mod.ResultsLeafletMap),
  {
    loading: () => (
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Loading map
        </Typography>
      </Box>
    ),
    ssr: false
  }
)

const videos: Video[] = [
  {
    id: 'vid-1042',
    name: 'Market Street mobile camera',
    date: '2025-04-18',
    duration: '12:44',
    location: { lat: 37.7897, lng: -122.4011 }
  },
  {
    id: 'vid-1178',
    name: 'Embarcadero plaza overview',
    date: '2025-04-19',
    duration: '08:31',
    location: { lat: 37.7955, lng: -122.3937 }
  },
  {
    id: 'vid-1220',
    name: 'Union Square entrance',
    date: '2025-04-20',
    duration: '16:09'
  },
  {
    id: 'vid-1304',
    name: 'Financial District lobby',
    date: '2025-04-21',
    duration: '10:18',
    location: { lat: 37.7941, lng: -122.4004 }
  },
  {
    id: 'vid-1369',
    name: 'Ferry Building concourse',
    date: '2025-04-21',
    duration: '14:52',
    location: { lat: 37.7959, lng: -122.3934 }
  },
  {
    id: 'vid-1411',
    name: 'Powell station platform',
    date: '2025-04-22',
    duration: '09:47',
    location: { lat: 37.7845, lng: -122.4079 }
  }
]

const cameras: Camera[] = [
  {
    id: 'cam-fd-lobby-02',
    name: 'Lobby camera 02',
    videos: ['vid-1304'],
    location: { lat: 37.7941, lng: -122.4004 },
    venueMap: {
      image: withBasePath('/images/financial-district-venue-map.svg'),
      name: 'Financial District lobby',
      location: { x: 45, y: 40 },
      look: {
        direction: 8,
        arc: 54,
        distance: 30
      }
    }
  },
  {
    id: 'cam-fd-lobby-07',
    name: 'Lobby camera 07',
    videos: [],
    venueMap: {
      image: withBasePath('/images/financial-district-venue-map.svg'),
      name: 'Financial District lobby',
      location: { x: 76, y: 72 },
      look: {
        direction: 218,
        arc: 62,
        distance: 34
      }
    }
  }
]

const results: Result[] = [
  {
    id: 'res-612',
    videoId: 'vid-1304',
    timestamp: '01:11',
    label: 'Identity match at lobby desk',
    confidence: 96
  },
  {
    id: 'res-578',
    videoId: 'vid-1369',
    timestamp: '03:28',
    label: 'Person near west entrance',
    confidence: 94
  },
  {
    id: 'res-381',
    videoId: 'vid-1042',
    timestamp: '00:48',
    label: 'Face match near crosswalk',
    confidence: 91
  },
  {
    id: 'res-604',
    videoId: 'vid-1411',
    timestamp: '04:42',
    label: 'Candidate descending stairs',
    confidence: 89
  },
  {
    id: 'res-506',
    videoId: 'vid-1220',
    timestamp: '07:04',
    label: 'Identity candidate',
    confidence: 88
  },
  {
    id: 'res-417',
    videoId: 'vid-1178',
    timestamp: '02:16',
    label: 'Person entering frame',
    confidence: 84
  },
  {
    id: 'res-553',
    videoId: 'vid-1304',
    timestamp: '06:20',
    label: 'Person crossing elevator bank',
    confidence: 82
  },
  {
    id: 'res-591',
    videoId: 'vid-1369',
    timestamp: '10:44',
    label: 'Subject near ticket counter',
    confidence: 80
  },
  {
    id: 'res-442',
    videoId: 'vid-1042',
    timestamp: '05:32',
    label: 'Vehicle beside curb',
    confidence: 77
  },
  {
    id: 'res-566',
    videoId: 'vid-1411',
    timestamp: '06:03',
    label: 'Person waiting near column',
    confidence: 76
  },
  {
    id: 'res-529',
    videoId: 'vid-1178',
    timestamp: '07:55',
    label: 'Object carried through plaza',
    confidence: 73
  },
  {
    id: 'res-638',
    videoId: 'vid-1220',
    timestamp: '12:18',
    label: 'Candidate leaving entrance',
    confidence: 71
  },
  {
    id: 'res-649',
    videoId: 'vid-1042',
    timestamp: '09:41',
    label: 'Person beside bus shelter',
    confidence: 69
  },
  {
    id: 'res-657',
    videoId: 'vid-1369',
    timestamp: '12:07',
    label: 'Identity candidate by kiosks',
    confidence: 66
  },
  {
    id: 'res-663',
    videoId: 'vid-1411',
    timestamp: '08:35',
    label: 'Person exiting platform',
    confidence: 62
  }
]

const sortedResults = [...results].sort((first, second) => second.confidence - first.confidence)

const defaultCenter: MapCenterPoint = [37.7925, -122.3974]
const searchControlHeight = 'clamp(34px, 3vw, 40px)'
const mediaStackHeight = 'calc(min(24vw, 300px) + clamp(8px, 1.6vw, 20px) + min(26vw, 360px))'
const venueMapWidth = 960
const venueMapHeight = 560

function PersonResultIcon() {
  return (
    <Box
      aria-hidden="true"
      component="svg"
      fill="none"
      role="img"
      viewBox="0 0 48 48"
      sx={{
        width: 'clamp(22px, 4vw, 48px)',
        height: 'clamp(22px, 4vw, 48px)',
        color: 'primary.main',
        flex: '0 0 auto'
      }}
    >
      <Box
        component="circle"
        cx="24"
        cy="15"
        r="8"
        sx={{ stroke: 'currentColor', strokeWidth: 3 }}
      />
      <Box
        component="path"
        d="M10 41c2.6-9 7.2-13.5 14-13.5S35.4 32 38 41"
        sx={{ stroke: 'currentColor', strokeLinecap: 'round', strokeWidth: 3 }}
      />
    </Box>
  )
}

function getFovConePath(camera: Camera) {
  if (!camera.venueMap) {
    return ''
  }

  const { arc, direction, distance } = camera.venueMap.look
  const x = (camera.venueMap.location.x / 100) * venueMapWidth
  const y = (camera.venueMap.location.y / 100) * venueMapHeight
  const radius = (distance / 100) * Math.min(venueMapWidth, venueMapHeight)
  const startAngle = ((direction - arc / 2) * Math.PI) / 180
  const endAngle = ((direction + arc / 2) * Math.PI) / 180
  const startX = x + Math.cos(startAngle) * radius
  const startY = y + Math.sin(startAngle) * radius
  const endX = x + Math.cos(endAngle) * radius
  const endY = y + Math.sin(endAngle) * radius
  const largeArcFlag = arc > 180 ? 1 : 0

  return `M ${x} ${y} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
}

function VenueMapPanel({
  camera,
  cameras,
  onShowGeo,
  showGeoToggle
}: {
  camera: Camera
  cameras: Camera[]
  onShowGeo: () => void
  showGeoToggle: boolean
}) {
  if (!camera.venueMap) {
    return null
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        bgcolor: 'background.default',
        overflow: 'hidden'
      }}
    >
      <Box
        alt={`${camera.venueMap.name} venue map`}
        component="img"
        src={camera.venueMap.image}
        sx={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover'
        }}
      />
      <Box
        component="svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox={`0 0 ${venueMapWidth} ${venueMapHeight}`}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {cameras.map(venueCamera => (
          <Box
            component="path"
            d={getFovConePath(venueCamera)}
            key={venueCamera.id}
            sx={{
              fill:
                venueCamera.id === camera.id
                  ? 'var(--mui-palette-primary-main)'
                  : 'var(--mui-palette-secondary-main)',
              fillOpacity: venueCamera.id === camera.id ? 0.24 : 0.16,
              stroke:
                venueCamera.id === camera.id
                  ? 'var(--mui-palette-primary-main)'
                  : 'var(--mui-palette-secondary-main)',
              strokeOpacity: 0.85,
              strokeWidth: 5
            }}
          />
        ))}
      </Box>
      {cameras.map(venueCamera => {
        if (!venueCamera.venueMap) {
          return null
        }

        return (
          <Box key={venueCamera.id}>
            <Box
              sx={{
                position: 'absolute',
                left: `${venueCamera.venueMap.location.x}%`,
                top: `${venueCamera.venueMap.location.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 'clamp(16px, 4vw, 42px)',
                height: 'clamp(16px, 4vw, 42px)',
                borderRadius: '50%',
                border:
                  venueCamera.id === camera.id
                    ? 'clamp(3px, 0.75vw, 7px) solid var(--mui-palette-primary-main)'
                    : 'clamp(2px, 0.55vw, 5px) solid var(--mui-palette-secondary-main)',
                bgcolor: theme =>
                  alpha(
                    venueCamera.id === camera.id
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                    venueCamera.id === camera.id ? 0.28 : 0.2
                  ),
                boxShadow: '0 0 0 3px var(--mui-palette-background-paper)'
              }}
            />
            <Typography
              sx={{
                position: 'absolute',
                left: `${venueCamera.venueMap.location.x}%`,
                top: `${venueCamera.venueMap.location.y}%`,
                transform: 'translate(-50%, calc(-100% - clamp(10px, 1.4vw, 16px)))',
                px: 'clamp(4px, 0.7vw, 8px)',
                py: 'clamp(2px, 0.35vw, 4px)',
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: venueCamera.id === camera.id ? 'primary.main' : 'divider',
                fontSize: 'clamp(0.5rem, 0.9vw, 0.72rem)',
                whiteSpace: 'nowrap'
              }}
              variant="body2"
            >
              {venueCamera.name}
            </Typography>
          </Box>
        )
      })}
      {showGeoToggle ? (
        <Button
          onClick={onShowGeo}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 'clamp(4px, 1.2vw, 10px)',
            left: 'clamp(4px, 1.2vw, 10px)',
            minWidth: 'clamp(54px, 10vw, 92px)',
            height: 'clamp(22px, 4vw, 30px)',
            px: 'clamp(6px, 1vw, 12px)',
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            fontSize: 'clamp(0.55rem, 1vw, 0.78rem)',
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: 'background.default'
            }
          }}
          variant="outlined"
        >
          Geo map
        </Button>
      ) : null}
    </Box>
  )
}

export function MapAfter() {
  const [query, setQuery] = useState('Mike')
  const [submittedQuery, setSubmittedQuery] = useState('Mike')
  const [selectedResultId, setSelectedResultId] = useState(sortedResults[0].id)
  const [fitAllRequest, setFitAllRequest] = useState(0)
  const [mapMode, setMapMode] = useState<MapMode>('venue')
  const selectedResult =
    sortedResults.find(result => result.id === selectedResultId) ?? sortedResults[0]
  const selectedVideo = videos.find(video => video.id === selectedResult.videoId) ?? videos[0]
  const selectedCamera = cameras.find(camera => camera.videos.includes(selectedVideo.id))
  const selectedLocation = selectedVideo.location ?? selectedCamera?.location
  const selectedVideoCenter: MapCenterPoint = selectedVideo.location
    ? [selectedVideo.location.lat, selectedVideo.location.lng]
    : selectedCamera?.location
      ? [selectedCamera.location.lat, selectedCamera.location.lng]
    : defaultCenter
  const hasVenueMap = Boolean(selectedCamera?.venueMap)
  const hasGeoMap = Boolean(selectedLocation)
  const shouldShowVenueMap = hasVenueMap && mapMode === 'venue'
  const venueMapCameras = selectedCamera?.venueMap
    ? cameras.filter(
        venueCamera => venueCamera.venueMap?.image === selectedCamera.venueMap?.image
      )
    : []

  useEffect(() => {
    setMapMode(selectedCamera?.venueMap ? 'venue' : 'geo')
  }, [selectedCamera?.id])

  const videoNames = useMemo(
    () => new Map(videos.map(video => [video.id, video.name])),
    []
  )

  const selectedVideoResults = sortedResults.filter(result => result.videoId === selectedVideo.id)
  const selectFirstResultForVideo = (videoId: Video['id']) => {
    const nextResult = sortedResults.find(result => result.videoId === videoId)

    if (nextResult) {
      setSelectedResultId(nextResult.id)
    }
  }

  return (
    <Card
      sx={{
        width: '92vw',
        maxWidth: 1120,
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        '& .MuiTypography-h3': {
          fontSize: 'clamp(0.72rem, 1.25vw, 1.25rem)'
        },
        '& .MuiTypography-body2': {
          fontSize: 'clamp(0.58rem, 0.95vw, 0.95rem)'
        },
        '& .MuiChip-root': {
          height: 'clamp(20px, 2.4vw, 32px)',
          maxWidth: '100%'
        },
        '& .MuiChip-label': {
          px: 'clamp(6px, 0.8vw, 12px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        '& .confidence-chip .MuiChip-label': {
          fontSize: 'clamp(0.7rem, 1.35vw, 1.1rem)',
          lineHeight: 1
        },
        '& .MuiSvgIcon-root': {
          fontSize: 'clamp(0.9rem, 1.4vw, 1.25rem)'
        },
        '& .leaflet-control-zoom a': {
          width: 'clamp(20px, 4.6vw, 30px)',
          height: 'clamp(20px, 4.6vw, 30px)',
          fontSize: 'clamp(0.9rem, 3.6vw, 1.35rem)',
          lineHeight: 'clamp(20px, 4.6vw, 30px)'
        },
        '& .leaflet-control-zoom': {
          marginLeft: 'clamp(4px, 1.2vw, 10px)',
          marginTop: 'clamp(4px, 1.2vw, 10px)'
        }
      }}
    >
      <CardContent sx={{ p: 'clamp(8px, 1.6vw, 24px)' }}>
        <Stack spacing="clamp(8px, 1.4vw, 20px)">
          <Box
            component="form"
            onSubmit={event => {
              event.preventDefault()
              setSubmittedQuery(query)
            }}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 'clamp(8px, 1.2vw, 16px)',
              minWidth: 0
            }}
          >
            <TextField
              value={query}
              onChange={event => setQuery(event.target.value)}
              label="Search"
              sx={{
                minWidth: 0,
                '& .MuiInputBase-root': {
                  height: searchControlHeight,
                  alignItems: 'center'
                },
                '& .MuiInputBase-input': {
                  py: 0,
                  fontSize: 'clamp(0.65rem, 1vw, 1rem)'
                },
                '& .MuiInputLabel-root': {
                  fontSize: 'clamp(0.65rem, 1vw, 1rem)'
                }
              }}
            />
            <Button
              type="submit"
              variant={query === submittedQuery ? 'outlined' : 'contained'}
              sx={{
                height: searchControlHeight,
                minWidth: 'clamp(64px, 10vw, 112px)',
                px: 'clamp(8px, 1.2vw, 18px)',
                fontSize: 'clamp(0.62rem, 0.9vw, 0.88rem)',
                whiteSpace: 'nowrap'
              }}
            >
              Search
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '28vw minmax(0, 1fr)',
              gap: 'clamp(8px, 1.6vw, 20px)',
              minWidth: 0
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Stack
                spacing="clamp(6px, 0.8vw, 10px)"
                sx={{
                  height: mediaStackHeight,
                  overflow: 'auto',
                  pr: '0.4vw'
                }}
              >
                {sortedResults.map(result => {
                  const isSelected = result.id === selectedResult.id

                  return (
                    <ButtonBase
                      aria-label={`${result.label} in ${videoNames.get(result.videoId)}`}
                      aria-pressed={isSelected}
                      disableRipple
                      key={result.id}
                      onClick={() => setSelectedResultId(result.id)}
                      sx={{
                        display: 'block',
                        width: '100%',
                        border: 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        textAlign: 'left',
                        bgcolor: isSelected ? 'action.selected' : 'background.paper',
                        transition: theme =>
                          theme.transitions.create(['background-color', 'border-color'])
                      }}
                    >
                      <Box sx={{ p: 'clamp(6px, 1vw, 14px)' }}>
                        <Stack spacing="clamp(4px, 0.7vw, 8px)">
                          <Stack
                            direction="row"
                            spacing="clamp(4px, 0.7vw, 8px)"
                            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <PersonResultIcon />
                            <Chip
                              className="confidence-chip"
                              label={`${result.confidence}%`}
                              size="small"
                            />
                          </Stack>
                          <Typography color="text.secondary" variant="body2">
                            {videoNames.get(result.videoId)}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {result.timestamp} in video
                          </Typography>
                        </Stack>
                      </Box>
                    </ButtonBase>
                  )
                })}
              </Stack>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Stack spacing="clamp(8px, 1.6vw, 20px)">
                <Box
                  sx={{
                    height: '24vw',
                    maxHeight: 300,
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    display: 'grid',
                    alignContent: 'space-between'
                  }}
                >
                  <Stack
                    direction="row"
                    spacing="clamp(5px, 0.8vw, 10px)"
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 'clamp(8px, 1.2vw, 16px)',
                      minWidth: 0
                    }}
                  >
                    <Typography component="h3" sx={{ minWidth: 0 }} variant="h3">
                      {selectedVideo.name}
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 0
                    }}
                  >
                    <Box
                      sx={{
                        width: 'clamp(28px, 5.2vw, 72px)',
                        height: 'clamp(28px, 5.2vw, 72px)',
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: theme => alpha(theme.palette.text.primary, 0.08)
                      }}
                    >
                      <PlayArrowIcon fontSize="large" />
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    divider={<Divider flexItem orientation="vertical" />}
                    spacing="clamp(6px, 1vw, 16px)"
                    sx={{
                      p: 'clamp(8px, 1.2vw, 16px)',
                      alignItems: 'center',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Stack direction="row" spacing="clamp(4px, 0.6vw, 8px)" sx={{ alignItems: 'center' }}>
                      <CalendarMonthIcon fontSize="small" />
                      <Typography variant="body2">{selectedVideo.date}</Typography>
                    </Stack>
                    <Stack direction="row" spacing="clamp(4px, 0.6vw, 8px)" sx={{ alignItems: 'center' }}>
                      <ScheduleIcon fontSize="small" />
                      <Typography variant="body2">{selectedVideo.duration}</Typography>
                    </Stack>
                    <Typography variant="body2">
                      {selectedVideoResults.length} matching results
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    height: '26vw',
                    maxHeight: 360,
                    overflow: 'hidden',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '& .leaflet-container': {
                      height: '100%',
                      width: '100%'
                    },
                    '& .leaflet-control-attribution': {
                      fontSize: '0.7rem'
                    }
                  }}
                >
                  {shouldShowVenueMap && selectedCamera ? (
                    <VenueMapPanel
                      camera={selectedCamera}
                      cameras={venueMapCameras}
                      onShowGeo={() => setMapMode('geo')}
                      showGeoToggle={hasGeoMap}
                    />
                  ) : (
                    <>
                      <Stack
                        direction="row"
                        spacing="clamp(4px, 0.8vw, 8px)"
                        sx={{
                          position: 'absolute',
                          bottom: 'clamp(4px, 1.2vw, 10px)',
                          left: 'clamp(4px, 1.2vw, 10px)',
                          zIndex: 500
                        }}
                      >
                        {hasVenueMap ? (
                          <Button
                            onClick={() => setMapMode('venue')}
                            size="small"
                            sx={{
                              minWidth: 'clamp(54px, 10vw, 92px)',
                              height: 'clamp(22px, 4vw, 30px)',
                              px: 'clamp(6px, 1vw, 12px)',
                              bgcolor: 'background.paper',
                              border: 1,
                              borderColor: 'divider',
                              fontSize: 'clamp(0.55rem, 1vw, 0.78rem)',
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                bgcolor: 'background.default'
                              }
                            }}
                            variant="outlined"
                          >
                            Venue map
                          </Button>
                        ) : null}
                      </Stack>
                      <Button
                        onClick={() => setFitAllRequest(request => request + 1)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 'clamp(4px, 1.2vw, 10px)',
                          right: 'clamp(4px, 1.2vw, 10px)',
                          zIndex: 500,
                          minWidth: 'clamp(54px, 10vw, 92px)',
                          height: 'clamp(22px, 4vw, 30px)',
                          px: 'clamp(6px, 1vw, 12px)',
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider',
                          fontSize: 'clamp(0.55rem, 1vw, 0.78rem)',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            bgcolor: 'background.default'
                          }
                        }}
                        variant="outlined"
                      >
                        Center all
                      </Button>
                      <ResultsLeafletMap
                        center={selectedVideoCenter}
                        fitAllRequest={fitAllRequest}
                        onSelectVideo={selectFirstResultForVideo}
                        selectedVideoId={selectedVideo.id}
                        videos={videos}
                      />
                    </>
                  )}
                  {!hasGeoMap ? (
                    <Chip
                      icon={<WarningAmberIcon />}
                      label="No GPS"
                      sx={{
                        position: 'absolute',
                        top: 'clamp(4px, 1.2vw, 10px)',
                        left: '50%',
                        zIndex: 600,
                        transform: 'translateX(-50%)',
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'warning.main',
                        color: 'text.primary',
                        fontSize: 'clamp(0.55rem, 1vw, 0.78rem)',
                        '& .MuiChip-icon': {
                          color: 'warning.main',
                          fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)'
                        }
                      }}
                      variant="outlined"
                    />
                  ) : null}
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
