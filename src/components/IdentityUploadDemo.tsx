'use client'

import AccessibilityIcon from '@mui/icons-material/Accessibility'
import AccessibleIcon from '@mui/icons-material/Accessible'
import AirlineSeatLegroomExtraIcon from '@mui/icons-material/AirlineSeatLegroomExtra'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BadgeIcon from '@mui/icons-material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ConstructionIcon from '@mui/icons-material/Construction'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import ElderlyIcon from '@mui/icons-material/Elderly'
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'
import ForestIcon from '@mui/icons-material/Forest'
import GroupsIcon from '@mui/icons-material/Groups'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import ParkIcon from '@mui/icons-material/Park'
import PersonIcon from '@mui/icons-material/Person'
import ReplayIcon from '@mui/icons-material/Replay'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import WcIcon from '@mui/icons-material/Wc'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
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
  sceneIcon: SceneIconName
  willFindFaces: boolean
  willNeedDisambiguation: boolean
  uploadStatus: RequestStatus
  detectionStatus: RequestStatus
  identityStatus: RequestStatus
  faces: Face[]
  selectedFaceId?: string
}

type SceneIconName =
  | 'accessible'
  | 'accessibility'
  | 'airlineSeatLegroomExtra'
  | 'construction'
  | 'directionsCar'
  | 'directionsRun'
  | 'directionsWalk'
  | 'diversity'
  | 'elderly'
  | 'elderlyWoman'
  | 'forest'
  | 'groups'
  | 'park'
  | 'sportsKabaddi'
  | 'whatshot'
  | 'wc'

const sceneIcons = {
  accessible: AccessibleIcon,
  accessibility: AccessibilityIcon,
  airlineSeatLegroomExtra: AirlineSeatLegroomExtraIcon,
  construction: ConstructionIcon,
  directionsCar: DirectionsCarIcon,
  directionsRun: DirectionsRunIcon,
  directionsWalk: DirectionsWalkIcon,
  diversity: Diversity3Icon,
  elderly: ElderlyIcon,
  elderlyWoman: ElderlyWomanIcon,
  forest: ForestIcon,
  groups: GroupsIcon,
  park: ParkIcon,
  sportsKabaddi: SportsKabaddiIcon,
  whatshot: WhatshotIcon,
  wc: WcIcon
}

type DetectionStory = 'autoSelectable' | 'needsDisambiguation' | 'noDetections'

const singlePersonSceneIcons: SceneIconName[] = [
  'directionsRun',
  'directionsWalk',
  'elderly',
  'elderlyWoman',
  'accessibility',
  'accessible'
]

const disambiguationSceneIcons: SceneIconName[] = ['diversity', 'groups', 'sportsKabaddi', 'wc']

const noDetectionSceneIcons: SceneIconName[] = [
  'airlineSeatLegroomExtra',
  'forest',
  'park',
  'whatshot',
  'directionsCar',
  'construction'
]

const imageShells = [
  { id: 'portrait', name: 'Badge portrait.jpg' },
  { id: 'platform', name: 'Transit platform.png' },
  { id: 'lobby', name: 'Lobby still.jpeg' }
]

const detectionScenarios: DetectionStory[][] = [
  ['noDetections', 'noDetections', 'noDetections'],
  ['needsDisambiguation', 'needsDisambiguation', 'needsDisambiguation'],
  ['autoSelectable', 'autoSelectable', 'autoSelectable'],
  ['autoSelectable', 'noDetections', 'needsDisambiguation'],
  ['noDetections', 'autoSelectable', 'needsDisambiguation'],
  ['needsDisambiguation', 'noDetections', 'autoSelectable'],
  ['noDetections', 'autoSelectable', 'autoSelectable'],
  ['needsDisambiguation', 'autoSelectable', 'needsDisambiguation']
]

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

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] as T
}

function sceneIconForStory(story: DetectionStory) {
  if (story === 'noDetections') {
    return randomItem(noDetectionSceneIcons)
  }

  if (story === 'needsDisambiguation') {
    return randomItem(disambiguationSceneIcons)
  }

  return randomItem(singlePersonSceneIcons)
}

function createInitialImages() {
  const scenario = randomItem(detectionScenarios)

  return imageShells.map((image, index) => {
    const story = scenario[index] ?? 'autoSelectable'

    return {
      ...image,
      sceneIcon: sceneIconForStory(story),
      willFindFaces: story !== 'noDetections',
      willNeedDisambiguation: story === 'needsDisambiguation',
      uploadStatus: 'initial' as const,
      detectionStatus: 'initial' as const,
      identityStatus: 'initial' as const,
      faces: []
    }
  })
}

const identityUploadMachine = setup({
  types: {} as {
    context: MachineContext
    events: MachineEvent
  }
}).createMachine({
  id: 'identityImageUpload',
  initial: 'idle',
  context: {
    images: createInitialImages()
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
        images: () => createInitialImages(),
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
                  uploadStatus: index === 0 ? 'error' : 'successFull',
                  detectionStatus: index === 0 ? 'initial' : 'fetching',
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
            guard: ({ context, event }) =>
              event.outcome === 'error' && context.images.some(image => image.id !== event.imageId && image.detectionStatus === 'fetching'),
            target: 'detecting',
            actions: assign({
              images: ({ context, event }) =>
                context.images.map(image =>
                  image.id === event.imageId
                    ? {
                        ...image,
                        uploadStatus: 'error',
                        detectionStatus: 'initial',
                        identityStatus: 'initial',
                        faces: [],
                        selectedFaceId: undefined
                      }
                    : image
                )
            })
          },
          {
            target: 'reviewing',
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

const stateNodes = [
  { id: 'idle', label: 'Initial' },
  { id: 'uploading', label: 'Upload images' },
  { id: 'retryingUpload', label: 'Retry upload' },
  { id: 'detecting', label: 'Detect faces' },
  { id: 'retryingDetections', label: 'Retry detections' },
  { id: 'reviewing', label: 'Review selections' },
  { id: 'disambiguating', label: 'Disambiguate' },
  { id: 'creatingIdentity', label: 'Create identity' },
  { id: 'retryingCreateIdentity', label: 'Retry create' },
  { id: 'addingImagesToIdentity', label: 'Add images' },
  { id: 'retryingAddImagesToIdentity', label: 'Retry add images' },
  { id: 'complete', label: 'Complete' }
]

const stateTransitions = [
  { from: 'idle', to: 'uploading' },
  { from: 'uploading', to: 'detecting' },
  { from: 'detecting', to: 'retryingUpload' },
  { from: 'reviewing', to: 'retryingUpload' },
  { from: 'retryingUpload', to: 'detecting' },
  { from: 'retryingUpload', to: 'reviewing' },
  { from: 'detecting', to: 'reviewing' },
  { from: 'detecting', to: 'retryingDetections' },
  { from: 'retryingDetections', to: 'detecting' },
  { from: 'reviewing', to: 'disambiguating' },
  { from: 'disambiguating', to: 'reviewing' },
  { from: 'reviewing', to: 'creatingIdentity' },
  { from: 'creatingIdentity', to: 'retryingCreateIdentity' },
  { from: 'retryingCreateIdentity', to: 'creatingIdentity' },
  { from: 'creatingIdentity', to: 'addingImagesToIdentity' },
  { from: 'creatingIdentity', to: 'complete' },
  { from: 'addingImagesToIdentity', to: 'retryingAddImagesToIdentity' },
  { from: 'retryingAddImagesToIdentity', to: 'addingImagesToIdentity' },
  { from: 'addingImagesToIdentity', to: 'complete' }
]

const graphSize = {
  width: 1280,
  height: 430
}

const stateGraphNodes: Record<string, { x: number; y: number; width: number; height: number }> = {
  idle: { x: 32, y: 186, width: 122, height: 58 },
  uploading: { x: 184, y: 186, width: 142, height: 58 },
  retryingUpload: { x: 348, y: 50, width: 146, height: 58 },
  detecting: { x: 356, y: 186, width: 132, height: 58 },
  retryingDetections: { x: 340, y: 322, width: 164, height: 58 },
  reviewing: { x: 524, y: 186, width: 166, height: 58 },
  disambiguating: { x: 530, y: 50, width: 154, height: 58 },
  creatingIdentity: { x: 724, y: 186, width: 156, height: 58 },
  retryingCreateIdentity: { x: 734, y: 50, width: 136, height: 58 },
  addingImagesToIdentity: { x: 914, y: 186, width: 136, height: 58 },
  retryingAddImagesToIdentity: { x: 892, y: 50, width: 180, height: 58 },
  complete: { x: 1080, y: 186, width: 162, height: 58 }
}

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

function isCardRetrying(state: string, image: UploadImage, index: number) {
  if (state === 'retryingUpload') {
    return image.uploadStatus === 'fetching'
  }

  if (state === 'retryingDetections') {
    return image.detectionStatus === 'error'
  }

  if (state === 'retryingCreateIdentity') {
    return index === 0
  }

  if (state === 'retryingAddImagesToIdentity') {
    return index > 0
  }

  return false
}

function nodeAnchor(nodeId: string, side: 'top' | 'right' | 'bottom' | 'left') {
  const node = stateGraphNodes[nodeId]
  const centerX = node.x + node.width / 2
  const centerY = node.y + node.height / 2

  if (side === 'top') {
    return { x: centerX, y: node.y }
  }

  if (side === 'right') {
    return { x: node.x + node.width, y: centerY }
  }

  if (side === 'bottom') {
    return { x: centerX, y: node.y + node.height }
  }

  return { x: node.x, y: centerY }
}

function getTransitionPath(fromId: string, toId: string) {
  const pathKey = `${fromId}->${toId}`

  if (pathKey === 'creatingIdentity->complete') {
    const start = nodeAnchor('creatingIdentity', 'bottom')
    const end = nodeAnchor('complete', 'bottom')

    return `M ${start.x} ${start.y} C ${start.x} 332, ${end.x} 332, ${end.x} ${end.y}`
  }

  const from = stateGraphNodes[fromId]
  const to = stateGraphNodes[toId]

  if (!from || !to) {
    return ''
  }

  const fromCenter = {
    x: from.x + from.width / 2,
    y: from.y + from.height / 2
  }
  const toCenter = {
    x: to.x + to.width / 2,
    y: to.y + to.height / 2
  }
  const dx = toCenter.x - fromCenter.x
  const dy = toCenter.y - fromCenter.y
  const startScale = Math.min(from.width / 2 / Math.max(Math.abs(dx), 1), from.height / 2 / Math.max(Math.abs(dy), 1))
  const endScale = Math.min(to.width / 2 / Math.max(Math.abs(dx), 1), to.height / 2 / Math.max(Math.abs(dy), 1))
  const start = {
    x: fromCenter.x + dx * startScale,
    y: fromCenter.y + dy * startScale
  }
  const end = {
    x: toCenter.x - dx * endScale,
    y: toCenter.y - dy * endScale
  }
  const hasReverse = stateTransitions.some(transition => transition.from === toId && transition.to === fromId)
  const bend = hasReverse ? (fromId < toId ? -34 : 34) : 0
  const length = Math.hypot(dx, dy) || 1
  const control = {
    x: (start.x + end.x) / 2 + (-dy / length) * bend,
    y: (start.y + end.y) / 2 + (dx / length) * bend
  }

  return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`
}

function splitStateLabel(label: string) {
  if (label.length <= 18) {
    return [label]
  }

  const words = label.split(' ')
  const midpoint = Math.ceil(words.length / 2)

  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')]
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

function createRandomFaces(image: UploadImage): Face[] {
  if (!image.willFindFaces) {
    return []
  }

  const faceCount = image.willNeedDisambiguation ? (Math.random() < 0.78 ? 2 : 3) : 1

  return Array.from({ length: faceCount }, (_, index) => ({
    id: `${image.id}-face-${Date.now()}-${index}`,
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

function createFacesByImageId(images: UploadImage[], outcome: 'empty' | 'full' | 'error') {
  if (outcome === 'empty') {
    return Object.fromEntries(images.map(image => [image.id, []]))
  }

  const candidates = images.filter(shouldResolveDetection)
  return Object.fromEntries(candidates.map(image => [image.id, createRandomFaces(image)]))
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
  const hasUploadError = images.some(image => image.uploadStatus === 'error')
  const needsDisambiguation = images.some(image => image.faces.length > 1 && !image.selectedFaceId)
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
        const outcome = randomOutcome(0, 0.12)
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
                <Grid size={12}>
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
                                forceProcessing={isCardRetrying(currentState, image, index)}
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
              </Grid>
            )}
            <StateMachineDiagram
              canCreateIdentity={canCreateIdentity}
              currentState={currentState}
              hasUploadError={hasUploadError}
              needsDisambiguation={needsDisambiguation}
            />
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
  const canStartUpload = state === 'idle'
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

type ImageTileProps = {
  canRemove: boolean
  forceProcessing: boolean
  image: UploadImage
  onDisambiguate: () => void
  onOmit: () => void
  onRetryUpload: () => void
}

function ImageTile({ canRemove, forceProcessing, image, onDisambiguate, onOmit, onRetryUpload }: ImageTileProps) {
  const hasMultipleFaces = image.faces.length > 1 && !image.selectedFaceId
  const hasNoFaces = image.detectionStatus === 'successEmpty'
  const hasUploadError = image.uploadStatus === 'error'
  const hasPostUploadError = !forceProcessing && (image.detectionStatus === 'error' || image.identityStatus === 'error')
  const hasRequestError = hasUploadError || hasPostUploadError
  const borderColor = hasRequestError ? 'error.main' : hasMultipleFaces ? 'warning.main' : hasNoFaces ? 'error.main' : 'divider'
  const hasActions = hasMultipleFaces || hasUploadError

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
        disabled={!hasMultipleFaces || forceProcessing}
        onClick={onDisambiguate}
        sx={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          cursor: hasMultipleFaces ? 'pointer' : 'default'
        }}
      >
        <Thumbnail forceProcessing={forceProcessing} image={image} />
      </ButtonBase>
      {hasActions ? (
        <Stack spacing={1.5} sx={{ p: 2 }}>
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
      ) : null}
    </Box>
  )
}

type ThumbnailProps = {
  forceProcessing: boolean
  image: UploadImage
}

function Thumbnail({ forceProcessing, image }: ThumbnailProps) {
  const isProcessing =
    forceProcessing ||
    image.uploadStatus === 'fetching' ||
    image.detectionStatus === 'fetching' ||
    image.identityStatus === 'fetching'
  const hasNoDetections = !isProcessing && image.detectionStatus === 'successEmpty'
  const hasSelectedFace = image.detectionStatus === 'successFull' && Boolean(image.selectedFaceId)
  const SceneIcon = sceneIcons[image.sceneIcon]
  const sceneColor = image.willNeedDisambiguation ? 'warning.main' : image.willFindFaces ? 'text.secondary' : 'text.secondary'

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
      {!hasSelectedFace ? (
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
      ) : null}
      {isProcessing ? <LinearProgress sx={{ position: 'absolute', insetInline: 0, top: 0 }} /> : null}
      {!hasNoDetections && !hasSelectedFace && image.uploadStatus !== 'error' ? (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: sceneColor
          }}
        >
          <SceneIcon sx={{ fontSize: { xs: 104, md: 132 }, opacity: isProcessing ? 0.34 : 0.78 }} />
        </Box>
      ) : null}
      {hasSelectedFace ? (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: 'success.main'
          }}
        >
          <PersonIcon sx={{ fontSize: { xs: 132, md: 168 }, opacity: 0.9 }} />
        </Box>
      ) : null}
      {isProcessing ? <CenteredStatus icon={<HourglassEmptyIcon />} label="Processing" /> : null}
      {image.uploadStatus === 'error' && !isProcessing ? <CenteredStatus icon={<ErrorOutlineIcon />} label="Upload failed" /> : null}
      {hasNoDetections ? <CenteredStatus icon={<ErrorOutlineIcon />} label="No detections found" tone="error" /> : null}
    </Box>
  )
}

type CenteredStatusProps = {
  icon: ReactNode
  label: string
  tone?: 'default' | 'error'
}

function CenteredStatus({ icon, label, tone = 'default' }: CenteredStatusProps) {
  return (
    <Stack
      spacing={0.5}
      sx={{
        position: 'absolute',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
        color: tone === 'error' ? 'error.main' : 'text.secondary'
      }}
    >
      {icon}
      <Typography sx={{ fontWeight: tone === 'error' ? 700 : 500 }} variant="body2">
        {label}
      </Typography>
    </Stack>
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
            Multiple detections were found, so the machine pauses before identity creation.
          </Typography>
        </Stack>
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to images
        </Button>
      </Stack>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Thumbnail forceProcessing={false} image={{ ...image, selectedFaceId: draftFaceId }} />
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
  canCreateIdentity: boolean
  currentState: string
  hasUploadError: boolean
  needsDisambiguation: boolean
}

function StateMachineDiagram({ canCreateIdentity, currentState, hasUploadError, needsDisambiguation }: StateMachineDiagramProps) {
  const isTransitionAvailable = (transition: (typeof stateTransitions)[number]) => {
    if (currentState !== transition.from) {
      return false
    }

    if (transition.to === 'retryingUpload') {
      return hasUploadError
    }

    if (transition.from === 'reviewing' && transition.to === 'disambiguating') {
      return needsDisambiguation
    }

    if (transition.from === 'reviewing' && transition.to === 'creatingIdentity') {
      return canCreateIdentity
    }

    return true
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <GroupsIcon color="primary" />
        <Typography component="h3" variant="h3">
          Machine states
        </Typography>
      </Stack>
      <Box
        sx={theme => ({
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.default',
          boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.background.paper, 0.72)}`
        })}
      >
        <Box
          aria-label="Identity image upload state machine"
          component="svg"
          role="img"
          viewBox={`0 0 ${graphSize.width} ${graphSize.height}`}
          sx={{
            display: 'block',
            width: '100%',
            height: 'auto'
          }}
        >
          <defs>
            <marker id="state-arrow-muted" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
            </marker>
            <marker id="state-arrow-active" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
            </marker>
          </defs>
          {stateTransitions.map(transition => {
            const possible = isTransitionAvailable(transition)
            const unavailableOutgoing = currentState === transition.from && !possible
            const adjacent = possible || currentState === transition.to

            return (
              <path
                d={getTransitionPath(transition.from, transition.to)}
                fill="none"
                key={`${transition.from}-${transition.to}`}
                markerEnd={possible ? 'url(#state-arrow-active)' : 'url(#state-arrow-muted)'}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                strokeDasharray={unavailableOutgoing ? '7 9' : undefined}
                style={{
                  color: possible
                    ? 'var(--mui-palette-primary-main)'
                    : adjacent
                      ? 'var(--mui-palette-text-secondary)'
                      : 'var(--mui-palette-divider)',
                  opacity: possible ? 1 : adjacent ? 0.72 : 0.42
                }}
              />
            )
          })}
          {stateNodes.map(node => {
            const active = currentState === node.id
            const possibleTarget = stateTransitions.some(transition => transition.to === node.id && isTransitionAvailable(transition))
            const graphNode = stateGraphNodes[node.id]
            const labelLines = splitStateLabel(node.label)
            const textStartY = graphNode.y + graphNode.height / 2 - (labelLines.length - 1) * 11

            return (
              <g key={node.id}>
                {active ? (
                  <rect
                    fill="var(--mui-palette-primary-main)"
                    fillOpacity="0.14"
                    height={graphNode.height + 12}
                    rx="10"
                    stroke="none"
                    width={graphNode.width + 12}
                    x={graphNode.x - 6}
                    y={graphNode.y - 6}
                  />
                ) : null}
                <rect
                  fill={active || possibleTarget ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-background-paper)'}
                  fillOpacity={active ? 0.16 : possibleTarget ? 0.08 : 1}
                  height={graphNode.height}
                  rx="8"
                  stroke={active || possibleTarget ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-divider)'}
                  strokeWidth={active ? 3 : possibleTarget ? 2 : 1.5}
                  width={graphNode.width}
                  x={graphNode.x}
                  y={graphNode.y}
                />
                {active ? (
                  <circle
                    cx={graphNode.x + graphNode.width - 13}
                    cy={graphNode.y + 13}
                    fill="var(--mui-palette-primary-main)"
                    r="5"
                  />
                ) : null}
                <text
                  dominantBaseline="middle"
                  fill="var(--mui-palette-text-primary)"
                  fontFamily="var(--mui-font-h3-fontFamily), var(--mui-fontFamily)"
                  fontSize="17"
                  fontWeight={active ? 700 : 500}
                  x={graphNode.x + 14}
                  y={textStartY}
                >
                  {labelLines.map((line, index) => (
                    <tspan dy={index === 0 ? 0 : 22} key={line} x={graphNode.x + 14}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
        </Box>
      </Box>
      <Typography color="text.secondary" variant="body2">
        Active states and available outgoing arrows use the primary color; unavailable guarded paths stay muted.
      </Typography>
    </Stack>
  )
}

export { IdentityUploadDemo }
