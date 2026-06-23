'use client'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ScheduleIcon from '@mui/icons-material/Schedule'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

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
  }
]

const results: Result[] = [
  {
    id: 'res-381',
    videoId: 'vid-1042',
    timestamp: '00:48',
    label: 'Face match near crosswalk',
    confidence: 91
  },
  {
    id: 'res-417',
    videoId: 'vid-1178',
    timestamp: '02:16',
    label: 'Person entering frame',
    confidence: 84
  },
  {
    id: 'res-442',
    videoId: 'vid-1042',
    timestamp: '05:32',
    label: 'Vehicle beside curb',
    confidence: 77
  },
  {
    id: 'res-506',
    videoId: 'vid-1220',
    timestamp: '07:04',
    label: 'Identity candidate',
    confidence: 88
  },
  {
    id: 'res-529',
    videoId: 'vid-1178',
    timestamp: '07:55',
    label: 'Object carried through plaza',
    confidence: 73
  }
]

const defaultCenter: MapCenterPoint = [37.7925, -122.3974]

export function MapAfter() {
  const [selectedVideoId, setSelectedVideoId] = useState(videos[0].id)
  const selectedVideo = videos.find(video => video.id === selectedVideoId) ?? videos[0]
  const selectedVideoCenter: MapCenterPoint = selectedVideo.location
    ? [selectedVideo.location.lat, selectedVideo.location.lng]
    : defaultCenter

  const videoNames = useMemo(
    () => new Map(videos.map(video => [video.id, video.name])),
    []
  )

  const selectedVideoResults = results.filter(result => result.videoId === selectedVideo.id)

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              defaultValue="face"
              label="Search"
              size="small"
              sx={{ maxWidth: { md: 280 } }}
            />
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {videos.map(video => (
                <Chip
                  clickable
                  color={video.id === selectedVideo.id ? 'primary' : 'default'}
                  key={video.id}
                  label={video.name}
                  onClick={() => setSelectedVideoId(video.id)}
                  variant={video.id === selectedVideo.id ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack
                spacing={1}
                sx={{
                  maxHeight: { md: 520 },
                  overflow: 'auto',
                  pr: { md: 0.5 }
                }}
              >
                {results.map(result => {
                  const isSelected = result.videoId === selectedVideo.id

                  return (
                    <ButtonBase
                      disableRipple
                      key={result.id}
                      onClick={() => setSelectedVideoId(result.videoId)}
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
                      <Box sx={{ p: 1.5 }}>
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <Typography component="h3" variant="h3">
                              {result.label}
                            </Typography>
                            <Chip label={`${result.confidence}%`} size="small" />
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
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    minHeight: { xs: 240, md: 280 },
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
                    spacing={1}
                    sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}
                  >
                    <Typography component="h3" variant="h3">
                      {selectedVideo.name}
                    </Typography>
                    <Chip
                      color={selectedVideo.location ? 'primary' : 'default'}
                      label={selectedVideo.location ? 'Location available' : 'No GPS'}
                      size="small"
                    />
                  </Stack>
                  <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 140 }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
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
                    direction={{ xs: 'column', sm: 'row' }}
                    divider={<Divider flexItem orientation="vertical" />}
                    spacing={2}
                    sx={{ p: 2 }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <CalendarMonthIcon fontSize="small" />
                      <Typography variant="body2">{selectedVideo.date}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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
                    height: { xs: 300, md: 360 },
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
                  <ResultsLeafletMap
                    center={selectedVideoCenter}
                    onSelectVideo={setSelectedVideoId}
                    selectedVideoId={selectedVideo.id}
                    videos={videos}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
