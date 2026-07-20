'use client'

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BadgeIcon from '@mui/icons-material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'
import GroupsIcon from '@mui/icons-material/Groups'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import ReplayIcon from '@mui/icons-material/Replay'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useMachine } from '@xstate/react'
import { useEffect, type ReactNode } from 'react'
import { assign, setup } from 'xstate'

type RequestStatus = 'initial' | 'fetching' | 'successEmpty' | 'successFull' | 'error'

type Face = {
  id: string
  label: string
  confidence: number
  box: {
    x: number
    y: number
    width: number
    height: number
  }
}

type UploadImage = {
  id: string
  name: string
  uploadStatus: RequestStatus
  detectionStatus: RequestStatus
  identityStatus: RequestStatus
  faces: Face[]
  selectedFaceId?: string
}

type MachineContext = {
  images: UploadImage[]
  activeImageId?: string
  draftFaceId?: string
  identityId?: string
}

type MachineEvent =
  | { type: 'START_UPLOAD' }
  | { type: 'UPLOAD_RESOLVED'; outcome: 'full' | 'error' }
  | { type: 'RETRY_UPLOAD'; imageId: string }
  | { type: 'UPLOAD_RETRY_RESOLVED'; imageId: string; outcome: 'full' | 'error' }
  | { type: 'DETECTIONS_RESOLVED'; errorImageId?: string; outcome: 'empty' | 'full' | 'error'; facesByImageId: Record<string, Face[]> }
  | { type: 'RETRY_DETECTIONS' }
  | { type: 'OPEN_DISAMBIGUATION'; imageId: string }
  | { type: 'SELECT_FACE'; faceId: string }
  | { type: 'CONFIRM_FACE' }
  | { type: 'CANCEL_DISAMBIGUATION' }
  | { type: 'OMIT_IMAGE'; imageId: string }
  | { type: 'CREATE_IDENTITY' }
  | { type: 'CREATE_IDENTITY_RESOLVED'; outcome: 'full' | 'error'; identityId?: string }
  | { type: 'RETRY_CREATE_IDENTITY' }
  | { type: 'ADD_IMAGES_RESOLVED'; outcome: 'full' | 'error' }
  | { type: 'RETRY_ADD_IMAGES' }
  | { type: 'RESET' }

const initialImages: UploadImage[] = [
  {
    id: 'portrait',
    name: 'Badge portrait.jpg',
    uploadStatus: 'initial',
    detectionStatus: 'initial',
    identityStatus: 'initial',
    faces: []
  },
  {
    id: 'platform',
    name: 'Transit platform.png',
    uploadStatus: 'initial',
    detectionStatus: 'initial',
    identityStatus: 'initial',
    faces: []
  },
  {
    id: 'lobby',
    name: 'Lobby still.jpeg',
    uploadStatus: 'initial',
    detectionStatus: 'initial',
    identityStatus: 'initial',
    faces: []
  }
]

const cloneInitialImages = () => initialImages.map(image => ({ ...image, faces: [] }))

const identityUploadMachine = setup({
  types: {} as {
    context: MachineContext
    events: MachineEvent
  }
}).createMachine({
  id: 'identityImageUpload',
  initial: 'idle',
  context: {
    images: cloneInitialImages()
  },
  on: {
    RETRY_UPLOAD: {
      target: '.retryingUpload',
      actions: assign({
        images: ({ context, event }) =>
          context.images.map(image =>
            image.id === event.imageId
              ? {
                  ...image,
                  uploadStatus: 'fetching',
                  detectionStatus: 'initial',
                  identityStatus: 'initial',
                  faces: [],
                  selectedFaceId: undefined
                }
              : image
          )
      })
    },
    START_UPLOAD: {
      target: '.uploading',
      actions: assign({
        images: ({ context }) =>
          context.images.map(image => ({
            ...image,
            uploadStatus: 'fetching',
            detectionStatus: 'initial',
            identityStatus: 'initial',
            faces: [],
            selectedFaceId: undefined,
          })),
        activeImageId: () => undefined,
        draftFaceId: () => undefined,
        identityId: () => undefined
      })
    },
    RESET: {
      target: '.idle',
      actions: assign({
        images: () => cloneInitialImages(),
        activeImageId: () => undefined,
        draftFaceId: () => undefined,
        identityId: () => undefined
      })
    }
  },
  states: {
    idle: {
      on: {
        START_UPLOAD: {
          target: 'uploading',
          actions: assign({
            images: ({ context }) =>
              context.images.map(image => ({
                ...image,
                uploadStatus: 'fetching',
                detectionStatus: 'initial',
                identityStatus: 'initial',
                faces: [],
                selectedFaceId: undefined,
              })),
            identityId: () => undefined
          })
        }
      }
    },
    uploading: {
      on: {
        UPLOAD_RESOLVED: [
          {
            guard: ({ event }) => event.outcome === 'error',
            target: 'detecting',
            actions: assign({
              images: ({ context }) =>
                context.images.map((image, index) => ({
                  ...image,
                  uploadStatus: index === 1 ? 'error' : 'successFull',
                  detectionStatus: index === 1 ? 'initial' : 'fetching',
                  identityStatus: 'initial'
                }))
            })
          },
          {
            target: 'detecting',
            actions: assign({
              images: ({ context }) =>
                context.images.map(image => ({
                  ...image,
                  uploadStatus: 'successFull',
                  detectionStatus: 'fetching',
                  identityStatus: 'initial',
                  faces: [],
                  selectedFaceId: undefined
                }))
            })
          }
        ]
      }
    },
    uploadProblem: {
      on: {
        START_UPLOAD: {
          target: 'uploading',
          actions: assign({
            images: ({ context }) =>
              context.images.map(image => ({
                ...image,
                uploadStatus: 'fetching',
                detectionStatus: 'initial',
                identityStatus: 'initial',
                faces: [],
                selectedFaceId: undefined,
              }))
          })
        }
      }
    },
    retryingUpload: {
      on: {
        UPLOAD_RETRY_RESOLVED: [
          {
            guard: ({ context, event }) => event.outcome === 'full' && uploadsCompleteAfterRetry(context.images, event.imageId),
            target: 'detecting',
            actions: assign({
              images: ({ context, event }) =>
                context.images.map(image => ({
                  ...image,
                  uploadStatus: image.id === event.imageId ? 'successFull' : image.uploadStatus,
                  detectionStatus:
                    image.id === event.imageId || image.detectionStatus === 'initial' ? 'fetching' : image.detectionStatus,
                  identityStatus: 'initial',
                  faces: image.id === event.imageId ? [] : image.faces,
                  selectedFaceId: image.id === event.imageId ? undefined : image.selectedFaceId
                }))
            })
          },
          {
            target: 'uploadProblem',
            actions: assign({
              images: ({ context, event }) =>
                context.images.map(image =>
                  image.id === event.imageId
                    ? {
                        ...image,
                        uploadStatus: event.outcome === 'full' ? 'successFull' : 'error',
                        detectionStatus: 'initial',
                        identityStatus: 'initial',
                        faces: [],
                        selectedFaceId: undefined
                      }
                    : image
                )
            })
          }
        ]
      }
    },
    detecting: {
      on: {
        DETECTIONS_RESOLVED: [
          {
            guard: ({ event }) => event.outcome === 'empty',
            target: 'reviewing',
            actions: assign({
              images: ({ context }) =>
                context.images.map(image =>
                  shouldResolveDetection(image)
                    ? {
                        ...image,
                        detectionStatus: 'successEmpty',
                        faces: [],
                        selectedFaceId: undefined
                      }
                    : image
                )
            })
          },
          {
            guard: ({ event }) => event.outcome === 'error',
            target: 'retryingDetections',
            actions: assign({
              images: ({ context, event }) =>
                context.images.map(image => {
                  if (!shouldResolveDetection(image)) {
                    return image
                  }

                  if (image.id === event.errorImageId) {
                    return {
                      ...image,
                      detectionStatus: 'error',
                      faces: [],
                      selectedFaceId: undefined
                    }
                  }

                  const faces = event.facesByImageId[image.id] ?? []

                  return {
                    ...image,
                    detectionStatus: faces.length > 0 ? 'successFull' : 'successEmpty',
                    faces,
                    selectedFaceId: faces.length === 1 ? faces[0].id : undefined
                  }
                })
            })
          },
          {
            target: 'reviewing',
            actions: assign({
              images: ({ context, event }) =>
                context.images.map(image => {
                  if (!shouldResolveDetection(image)) {
                    return image
                  }

                  const faces = event.facesByImageId[image.id] ?? []

                  return {
                    ...image,
                    detectionStatus: faces.length > 0 ? 'successFull' : 'successEmpty',
                    faces,
                    selectedFaceId: faces.length === 1 ? faces[0].id : undefined
                  }
                })
            })
          }
        ]
      }
    },
    retryingDetections: {
      on: {
        RETRY_DETECTIONS: {
          target: 'detecting',
          actions: assign({
            images: ({ context }) =>
              context.images.map(image =>
                image.detectionStatus === 'error'
                  ? {
                      ...image,
                      detectionStatus: 'fetching',
                      faces: [],
                      selectedFaceId: undefined
                    }
                  : image
              )
          })
        }
      }
    },
    reviewing: {
      on: {
        OPEN_DISAMBIGUATION: {
          target: 'disambiguating',
          actions: assign({
            activeImageId: ({ event }) => event.imageId,
            draftFaceId: ({ context, event }) =>
              context.images.find(image => image.id === event.imageId)?.selectedFaceId
          })
        },
        OMIT_IMAGE: {
          actions: assign({
            images: ({ context, event }) => context.images.filter(image => image.id !== event.imageId)
          })
        },
        CREATE_IDENTITY: [
          {
            guard: ({ context }) => readyForIdentity(context.images),
            target: 'creatingIdentity',
            actions: assign({
              images: ({ context }) =>
                context.images.map((image, index) => ({
                  ...image,
                  identityStatus: index === 0 ? 'fetching' : 'initial'
                }))
            })
          }
        ]
      }
    },
    disambiguating: {
      on: {
        SELECT_FACE: {
          actions: assign({
            draftFaceId: ({ event }) => event.faceId
          })
        },
        CONFIRM_FACE: {
          target: 'reviewing',
          guard: ({ context }) => Boolean(context.activeImageId && context.draftFaceId),
          actions: assign({
            images: ({ context }) =>
              context.images.map(image =>
                image.id === context.activeImageId
                  ? {
                      ...image,
                      selectedFaceId: context.draftFaceId
                    }
                  : image
              ),
            activeImageId: () => undefined,
            draftFaceId: () => undefined
          })
        },
        CANCEL_DISAMBIGUATION: {
          target: 'reviewing',
          actions: assign({
            activeImageId: () => undefined,
            draftFaceId: () => undefined
          })
        }
      }
    },
    creatingIdentity: {
      on: {
        CREATE_IDENTITY_RESOLVED: [
          {
            guard: ({ event }) => event.outcome === 'error',
            target: 'retryingCreateIdentity',
            actions: assign({
              images: ({ context }) =>
                context.images.map((image, index) => ({
                  ...image,
                  identityStatus: index === 0 ? 'error' : 'initial'
                })),
              identityId: () => undefined
            })
          },
          {
            guard: ({ context }) => context.images.length === 1,
            target: 'complete',
            actions: assign({
              images: ({ context }) =>
                context.images.map((image, index) => ({
                  ...image,
                  identityStatus: index === 0 ? 'successFull' : image.identityStatus
                })),
              identityId: ({ event }) => event.identityId
            })
          },
          {
            target: 'addingImagesToIdentity',
            actions: assign({
              images: ({ context }) =>
                context.images.map((image, index) => ({
                  ...image,
                  identityStatus: index === 0 ? 'successFull' : 'fetching'
                })),
              identityId: ({ event }) => event.identityId
            })
          }
        ]
      }
    },
    retryingCreateIdentity: {
      on: {
        RETRY_CREATE_IDENTITY: {
          target: 'creatingIdentity',
          actions: assign({
            images: ({ context }) =>
              context.images.map((image, index) => ({
                ...image,
                identityStatus: index === 0 ? 'fetching' : 'initial'
              })),
            identityId: () => undefined
          })
        }
      }
    },
    addingImagesToIdentity: {
      on: {
        ADD_IMAGES_RESOLVED: [
          {
            guard: ({ event }) => event.outcome === 'error',
            target: 'retryingAddImagesToIdentity',
            actions: assign({
              images: ({ context }) =>
                context.images.map((image, index) => ({
                  ...image,
                  identityStatus: index === 0 ? 'successFull' : index === 1 ? 'error' : 'successFull'
                }))
            })
          },
          {
            target: 'complete',
            actions: assign({
              images: ({ context }) =>
                context.images.map(image => ({
                  ...image,
                  identityStatus: 'successFull'
                }))
            })
          }
        ]
      }
    },
    retryingAddImagesToIdentity: {
      on: {
        RETRY_ADD_IMAGES: {
          target: 'addingImagesToIdentity',
          actions: assign({
            images: ({ context }) =>
              context.images.map((image, index) => ({
                ...image,
                identityStatus: index === 0 ? 'successFull' : 'fetching'
              }))
          })
        }
      }
    },
    complete: {}
  }
})

const requestLabels: Record<RequestStatus, string> = {
  initial: 'Initial',
  fetching: 'Fetching',
  successEmpty: 'Success - empty',
  successFull: 'Success - full',
  error: 'Error'
}

const requestColor: Record<RequestStatus, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  initial: 'default',
  fetching: 'primary',
  successEmpty: 'warning',
  successFull: 'success',
  error: 'error'
}

const stateNodes = [
  { id: 'idle', label: 'Initial' },
  { id: 'uploading', label: 'Upload images' },
  { id: 'uploadProblem', label: 'Upload problem' },
  { id: 'retryingUpload', label: 'Retry upload' },
  { id: 'detecting', label: 'Detect faces' },
  { id: 'retryingDetections', label: 'Auto retry detections' },
  { id: 'reviewing', label: 'Review selections' },
  { id: 'disambiguating', label: 'Disambiguate' },
  { id: 'creatingIdentity', label: 'Create identity' },
  { id: 'retryingCreateIdentity', label: 'Retry create' },
  { id: 'addingImagesToIdentity', label: 'Add images' },
  { id: 'retryingAddImagesToIdentity', label: 'Retry add images' },
  { id: 'complete', label: 'Complete' }
]

function readyForIdentity(images: UploadImage[]) {
  return (
    images.length > 0 &&
    images.every(
      image => image.uploadStatus === 'successFull' && image.detectionStatus === 'successFull' && Boolean(image.selectedFaceId)
    )
  )
}

function uploadsCompleteAfterRetry(images: UploadImage[], retriedImageId: string) {
  return images.every(image => image.id === retriedImageId || image.uploadStatus === 'successFull')
}

function shouldResolveDetection(image: UploadImage) {
  return image.uploadStatus === 'successFull' && image.detectionStatus === 'fetching'
}

function randomLatency() {
  return 900 + Math.round(Math.random() * 1100)
}

function randomOutcome(emptyWeight = 0.12, errorWeight = 0.16): 'empty' | 'full' | 'error' {
  const roll = Math.random()

  if (roll < errorWeight) {
    return 'error'
  }

  if (roll < errorWeight + emptyWeight) {
    return 'empty'
  }

  return 'full'
}

function randomUploadOutcome(): 'full' | 'error' {
  return Math.random() < 0.18 ? 'error' : 'full'
}

function randomPostOutcome(): 'full' | 'error' {
  return Math.random() < 0.18 ? 'error' : 'full'
}

function randomFaceCount() {
  const roll = Math.random()

  if (roll < 0.16) {
    return 0
  }

  if (roll < 0.7) {
    return 1
  }

  return Math.random() < 0.78 ? 2 : 3
}

function createRandomFaces(imageId: string): Face[] {
  return Array.from({ length: randomFaceCount() }, (_, index) => ({
    id: `${imageId}-face-${Date.now()}-${index}`,
    label: `Face ${index + 1}`,
    confidence: 72 + Math.round(Math.random() * 25),
    box: {
      x: 14 + index * 24 + Math.round(Math.random() * 7),
      y: 18 + Math.round(Math.random() * 10),
      width: 18 + Math.round(Math.random() * 8),
      height: 26 + Math.round(Math.random() * 10)
    }
  }))
}

function createOneRandomFace(imageId: string): Face {
  return {
    id: `${imageId}-face-${Date.now()}-required`,
    label: 'Face 1',
    confidence: 72 + Math.round(Math.random() * 25),
    box: {
      x: 30 + Math.round(Math.random() * 18),
      y: 18 + Math.round(Math.random() * 10),
      width: 18 + Math.round(Math.random() * 8),
      height: 26 + Math.round(Math.random() * 10)
    }
  }
}

function createFacesByImageId(images: UploadImage[], outcome: 'empty' | 'full' | 'error') {
  if (outcome === 'empty') {
    return Object.fromEntries(images.map(image => [image.id, []]))
  }

  const candidates = images.filter(shouldResolveDetection)
  const facesByImageId = Object.fromEntries(candidates.map(image => [image.id, createRandomFaces(image.id)]))

  if (outcome === 'full' && candidates.length > 0 && Object.values(facesByImageId).every(faces => faces.length === 0)) {
    facesByImageId[candidates[0].id] = [createOneRandomFace(candidates[0].id)]
  }

  return facesByImageId
}

function randomDetectionErrorImageId(images: UploadImage[]) {
  const candidates = images.filter(shouldResolveDetection)

  return candidates[Math.floor(Math.random() * candidates.length)]?.id
}

function randomIdentityId() {
  return `identity-${1000 + Math.floor(Math.random() * 9000)}`
}

function IdentityUploadDemo() {
  const [snapshot, send] = useMachine(identityUploadMachine)
  const { images, activeImageId, draftFaceId, identityId } = snapshot.context
  const activeImage = images.find(image => image.id === activeImageId)
  const canCreateIdentity = readyForIdentity(images)
  const currentState = String(snapshot.value)
  const isInitial = snapshot.matches('idle')

  useEffect(() => {
    if (
      !snapshot.matches('uploading') &&
      !snapshot.matches('retryingUpload') &&
      !snapshot.matches('detecting') &&
      !snapshot.matches('retryingDetections') &&
      !snapshot.matches('creatingIdentity') &&
      !snapshot.matches('retryingCreateIdentity') &&
      !snapshot.matches('addingImagesToIdentity') &&
      !snapshot.matches('retryingAddImagesToIdentity')
    ) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      if (snapshot.matches('uploading')) {
        send({ type: 'UPLOAD_RESOLVED', outcome: randomUploadOutcome() })
        return
      }

      if (snapshot.matches('retryingUpload')) {
        const retryingImage = images.find(image => image.uploadStatus === 'fetching')

        if (retryingImage) {
          send({ type: 'UPLOAD_RETRY_RESOLVED', imageId: retryingImage.id, outcome: randomUploadOutcome() })
        }

        return
      }

      if (snapshot.matches('detecting')) {
        const outcome = randomOutcome(0.1, 0.12)
        send({
          type: 'DETECTIONS_RESOLVED',
          errorImageId: outcome === 'error' ? randomDetectionErrorImageId(images) : undefined,
          outcome,
          facesByImageId: createFacesByImageId(images, outcome)
        })
        return
      }

      if (snapshot.matches('retryingDetections')) {
        send({ type: 'RETRY_DETECTIONS' })
        return
      }

      if (snapshot.matches('creatingIdentity')) {
        const outcome = randomPostOutcome()
        send({
          type: 'CREATE_IDENTITY_RESOLVED',
          outcome,
          identityId: outcome === 'full' ? randomIdentityId() : undefined
        })
        return
      }

      if (snapshot.matches('retryingCreateIdentity')) {
        send({ type: 'RETRY_CREATE_IDENTITY' })
        return
      }

      if (snapshot.matches('addingImagesToIdentity')) {
        send({ type: 'ADD_IMAGES_RESOLVED', outcome: randomPostOutcome() })
        return
      }

      if (snapshot.matches('retryingAddImagesToIdentity')) {
        send({ type: 'RETRY_ADD_IMAGES' })
      }
    }, randomLatency())

    return () => window.clearTimeout(timeoutId)
  }, [currentState, images, send, snapshot])

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h2" variant="h2">
          State machine walkthrough
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Start the simulated upload to see the workflow move straight into face detection, then resolve ambiguity before identity creation.
        </Typography>
      </Stack>

      <Card>
        <CardContent data-testid="identity-upload-demo">
          <Stack spacing={3}>
            <StateMachineDiagram currentState={currentState} />
            <Divider />
            {snapshot.matches('disambiguating') && activeImage ? (
              <DisambiguationScreen
                draftFaceId={draftFaceId}
                image={activeImage}
                onBack={() => send({ type: 'CANCEL_DISAMBIGUATION' })}
                onConfirm={() => send({ type: 'CONFIRM_FACE' })}
                onSelectFace={faceId => send({ type: 'SELECT_FACE', faceId })}
              />
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Stack spacing={2}>
                    {isInitial ? (
                      <InitialUploadPanel onStartUpload={() => send({ type: 'START_UPLOAD' })} />
                    ) : (
                      <>
                        <Toolbar
                          canCreateIdentity={canCreateIdentity}
                          identityId={identityId}
                          state={currentState}
                          onCreateIdentity={() => send({ type: 'CREATE_IDENTITY' })}
                          onStartUpload={() => send({ type: 'START_UPLOAD' })}
                          onReset={() => send({ type: 'RESET' })}
                        />
                      <Grid container spacing={2}>
                        {images.map((image, index) => (
                          <Grid key={image.id} size={{ xs: 12, md: 4 }}>
                            <ImageTile
                              canRemove={currentState === 'reviewing' || image.uploadStatus === 'error'}
                              identityLabel={index === 0 ? 'Create identity' : 'Add to identity'}
                              image={image}
                              onDisambiguate={() => send({ type: 'OPEN_DISAMBIGUATION', imageId: image.id })}
                              onOmit={() => send({ type: 'OMIT_IMAGE', imageId: image.id })}
                              onRetryUpload={() => send({ type: 'RETRY_UPLOAD', imageId: image.id })}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      </>
                    )}
                  </Stack>
                </Grid>
                {!isInitial ? (
                  <Grid size={{ xs: 12, lg: 4 }}>
                    <SimulationPanel images={images} state={currentState} />
                  </Grid>
                ) : null}
              </Grid>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

type ToolbarProps = {
  canCreateIdentity: boolean
  identityId?: string
  state: string
  onCreateIdentity: () => void
  onReset: () => void
  onStartUpload: () => void
}

type InitialUploadPanelProps = {
  onStartUpload: () => void
}

function InitialUploadPanel({ onStartUpload }: InitialUploadPanelProps) {
  return (
    <Box
      data-testid="initial-upload-reserved-space"
      sx={{
        minHeight: { xs: 420, md: 360 },
        display: 'grid',
        placeItems: 'center'
      }}
    >
      <Button
        data-testid="start-upload"
        onClick={onStartUpload}
        startIcon={<CloudUploadIcon />}
        variant="contained"
      >
        Simulate upload
      </Button>
    </Box>
  )
}

function Toolbar({
  canCreateIdentity,
  identityId,
  state,
  onCreateIdentity,
  onReset,
  onStartUpload
}: ToolbarProps) {
  const requestInFlight =
    state === 'uploading' ||
    state === 'retryingUpload' ||
    state === 'detecting' ||
    state === 'retryingDetections' ||
    state === 'creatingIdentity' ||
    state === 'retryingCreateIdentity' ||
    state === 'addingImagesToIdentity' ||
    state === 'retryingAddImagesToIdentity'
  const canStartUpload = state === 'idle' || state === 'uploadProblem'
  const canShowCreateIdentity = state !== 'idle' && state !== 'complete'
  const canShowReset = state !== 'idle'

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      sx={{ alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}
    >
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        {canStartUpload ? (
          <Button
            data-testid="start-upload"
            disabled={requestInFlight}
            onClick={onStartUpload}
            startIcon={<CloudUploadIcon />}
            variant="contained"
          >
            Simulate upload
          </Button>
        ) : null}
        {canShowCreateIdentity ? (
          <Button
            data-testid="create-identity"
            disabled={requestInFlight || !canCreateIdentity}
            onClick={onCreateIdentity}
            startIcon={<BadgeIcon />}
            variant="contained"
          >
            Create identity
          </Button>
        ) : null}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        {identityId ? <Chip color="success" icon={<CheckCircleIcon />} label={identityId} /> : null}
        {canShowReset ? (
          <Tooltip title="Reset demo">
            <Button aria-label="Reset demo" data-testid="reset-demo" onClick={onReset} startIcon={<ReplayIcon />}>
              Reset
            </Button>
          </Tooltip>
        ) : null}
      </Stack>
    </Stack>
  )
}

type SimulationPanelProps = {
  images: UploadImage[]
  state: string
}

function SimulationPanel({ images, state }: SimulationPanelProps) {
  const selectedFaceCount = images.filter(image => image.selectedFaceId).length
  const multiFaceCount = images.filter(image => image.faces.length > 1 && !image.selectedFaceId).length
  const errorCount = images.filter(
    image => image.uploadStatus === 'error' || image.detectionStatus === 'error' || image.identityStatus === 'error'
  ).length
  const emptyDetectionCount = images.filter(image => image.detectionStatus === 'successEmpty').length
  const isFetching =
    state === 'uploading' ||
    state === 'retryingUpload' ||
    state === 'detecting' ||
    state === 'retryingDetections' ||
    state === 'creatingIdentity' ||
    state === 'retryingCreateIdentity' ||
    state === 'addingImagesToIdentity' ||
    state === 'retryingAddImagesToIdentity'

  return (
    <Stack spacing={2}>
      <Typography component="h3" variant="h3">
        Local simulator
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {isFetching ? <HourglassEmptyIcon color="primary" /> : <CheckCircleIcon color="success" />}
            <Typography variant="body2">
              {isFetching ? 'Pretending to wait on a backend response' : 'No network requests are sent'}
            </Typography>
          </Stack>
          {isFetching ? <LinearProgress /> : null}
          <Typography color="text.secondary" variant="body2">
            Each request resolves after artificial latency. Upload failures, detection counts, empty detections, create failures, and add-image failures are generated in memory.
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 700 }} variant="body2">
            Current batch
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {selectedFaceCount} selected, {multiFaceCount} ambiguous, {emptyDetectionCount} empty detections, {errorCount} errors.
          </Typography>
        </Stack>
      </Box>
    </Stack>
  )
}

type ImageTileProps = {
  canRemove: boolean
  identityLabel: string
  image: UploadImage
  onDisambiguate: () => void
  onOmit: () => void
  onRetryUpload: () => void
}

function ImageTile({ canRemove, identityLabel, image, onDisambiguate, onOmit, onRetryUpload }: ImageTileProps) {
  const hasMultipleFaces = image.faces.length > 1 && !image.selectedFaceId
  const hasNoFaces = image.detectionStatus === 'successEmpty'
  const hasUploadError = image.uploadStatus === 'error'
  const hasPostUploadError = image.detectionStatus === 'error' || image.identityStatus === 'error'
  const hasRequestError = hasUploadError || hasPostUploadError
  const borderColor = hasRequestError ? 'error.main' : hasMultipleFaces ? 'warning.main' : hasNoFaces ? 'error.main' : 'divider'

  return (
    <Box
      sx={{
        position: 'relative',
        border: 2,
        borderColor,
        borderRadius: 1,
        height: '100%',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        '&:hover .remove-image-button, &:focus-within .remove-image-button': {
          opacity: 1
        }
      }}
    >
      {canRemove ? (
        <Tooltip title="Remove from batch">
          <IconButton
            aria-label={`Remove ${image.name} from batch`}
            className="remove-image-button"
            color="error"
            onClick={onOmit}
            size="small"
            sx={theme => ({
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2,
              width: 32,
              height: 32,
              opacity: 0,
              bgcolor: alpha(theme.palette.background.paper, 0.92),
              border: 1,
              borderColor: 'divider',
              transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shortest
              }),
              '&:hover': {
                bgcolor: 'background.paper'
              },
              '&:focus-visible': {
                opacity: 1
              }
            })}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
      <ButtonBase
        disabled={!hasMultipleFaces}
        onClick={onDisambiguate}
        sx={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          cursor: hasMultipleFaces ? 'pointer' : 'default'
        }}
      >
        <Thumbnail image={image} />
      </ButtonBase>
      <Stack spacing={1.5} sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component="h3" sx={{ fontWeight: 700 }} variant="body2">
            {image.name}
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <RequestChip label="Upload" status={image.uploadStatus} />
          <RequestChip label="Detections" status={image.detectionStatus} />
          <RequestChip label={identityLabel} status={image.identityStatus} />
        </Stack>
        {hasMultipleFaces ? (
          <Button color="warning" onClick={onDisambiguate} size="small" startIcon={<ReportProblemIcon />} variant="outlined">
            Choose face
          </Button>
        ) : null}
        {hasUploadError ? (
          <Button color="error" onClick={onRetryUpload} size="small" startIcon={<ReplayIcon />} variant="outlined">
            Retry upload
          </Button>
        ) : null}
      </Stack>
    </Box>
  )
}

type ThumbnailProps = {
  image: UploadImage
}

function Thumbnail({ image }: ThumbnailProps) {
  return (
    <Box
      sx={theme => ({
        position: 'relative',
        aspectRatio: '4 / 3',
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(
          theme.palette.secondary.main,
          0.2
        )})`,
        overflow: 'hidden'
      })}
    >
      <Box
        sx={theme => ({
          position: 'absolute',
          inset: '16% 10%',
          borderRadius: 1,
          border: 1,
          borderColor: alpha(theme.palette.text.primary, 0.18),
          bgcolor: alpha(theme.palette.background.paper, 0.32)
        })}
      />
      {image.detectionStatus === 'fetching' ? <LinearProgress sx={{ position: 'absolute', insetInline: 0, top: 0 }} /> : null}
      {image.faces.map(face => (
        <Box
          aria-hidden="true"
          key={face.id}
          sx={{
            position: 'absolute',
            left: `${face.box.x}%`,
            top: `${face.box.y}%`,
            width: `${face.box.width}%`,
            height: `${face.box.height}%`,
            border: 2,
            borderColor: image.selectedFaceId === face.id ? 'success.main' : 'warning.main',
            borderRadius: 1,
            boxShadow: 2
          }}
        />
      ))}
      {image.uploadStatus === 'initial' ? <CenteredStatus icon={<AddPhotoAlternateIcon />} label="Ready" /> : null}
      {image.uploadStatus === 'fetching' ? <CenteredStatus icon={<HourglassEmptyIcon />} label="Uploading" /> : null}
      {image.uploadStatus === 'error' ? <CenteredStatus icon={<ErrorOutlineIcon />} label="Upload failed" /> : null}
    </Box>
  )
}

type CenteredStatusProps = {
  icon: ReactNode
  label: string
}

function CenteredStatus({ icon, label }: CenteredStatusProps) {
  return (
    <Stack
      spacing={0.5}
      sx={{
        position: 'absolute',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary'
      }}
    >
      {icon}
      <Typography variant="body2">{label}</Typography>
    </Stack>
  )
}

type RequestChipProps = {
  label: string
  status: RequestStatus
}

function RequestChip({ label, status }: RequestChipProps) {
  return (
    <Chip
      color={requestColor[status]}
      icon={status === 'error' ? <ErrorOutlineIcon /> : status === 'fetching' ? <HourglassEmptyIcon /> : undefined}
      label={`${label}: ${requestLabels[status]}`}
      size="small"
      sx={{ justifyContent: 'flex-start' }}
      variant={status === 'initial' ? 'outlined' : 'filled'}
    />
  )
}

type DisambiguationScreenProps = {
  draftFaceId?: string
  image: UploadImage
  onBack: () => void
  onConfirm: () => void
  onSelectFace: (faceId: string) => void
}

function DisambiguationScreen({ draftFaceId, image, onBack, onConfirm, onSelectFace }: DisambiguationScreenProps) {
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Stack spacing={0.5}>
          <Typography component="h3" variant="h3">
            Select the correct face
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {image.name} returned multiple detections, so the machine pauses before identity creation.
          </Typography>
        </Stack>
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to images
        </Button>
      </Stack>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Thumbnail image={{ ...image, selectedFaceId: draftFaceId }} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={1.5}>
            {image.faces.map(face => (
              <Button
                color={draftFaceId === face.id ? 'success' : 'primary'}
                key={face.id}
                onClick={() => onSelectFace(face.id)}
                startIcon={<FaceRetouchingNaturalIcon />}
                variant={draftFaceId === face.id ? 'contained' : 'outlined'}
              >
                {face.label} - {face.confidence}%
              </Button>
            ))}
            <Button disabled={!draftFaceId} onClick={onConfirm} startIcon={<CheckCircleIcon />} variant="contained">
              Confirm selected face
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}

type StateMachineDiagramProps = {
  currentState: string
}

function StateMachineDiagram({ currentState }: StateMachineDiagramProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <GroupsIcon color="primary" />
        <Typography component="h3" variant="h3">
          Machine states
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 1.5
        }}
      >
        {stateNodes.map(node => {
          const active = currentState === node.id

          return (
            <Box
              key={node.id}
              sx={theme => ({
                minHeight: 76,
                border: 1,
                borderColor: active ? 'primary.main' : 'divider',
                borderRadius: 1,
                p: 1.5,
                bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1
              })}
            >
              <Typography sx={{ fontWeight: active ? 700 : 500 }} variant="body2">
                {node.label}
              </Typography>
              {active ? <Chip color="primary" label="Active" size="small" /> : null}
            </Box>
          )
        })}
      </Box>
    </Stack>
  )
}

export { IdentityUploadDemo }
