'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { emptyReport, parseReport, serializeReport, type ReportState } from './model'

const event = 'equipment-report-change'
let lastEdit = 0

function subscribe(listener: () => void) {
  const onNavigate = () => {
    lastEdit = 0
    listener()
  }
  window.addEventListener('popstate', onNavigate)
  window.addEventListener(event, listener)
  return () => {
    window.removeEventListener('popstate', onNavigate)
    window.removeEventListener(event, listener)
  }
}

function getSnapshot() {
  return new URL(window.location.href).searchParams.get('report') ?? ''
}

export function writeReport(state: ReportState, coalesce = false) {
  const url = new URL(window.location.href)
  const raw = serializeReport(state)
  if (serializeReport(emptyReport) === raw) url.searchParams.delete('report')
  else url.searchParams.set('report', raw)
  if (url.href === window.location.href) return
  const now = Date.now()
  // The first edit pushes a checkpoint; continued typing replaces only that checkpoint.
  if (coalesce && now - lastEdit < 700) window.history.replaceState(window.history.state, '', url)
  else window.history.pushState(window.history.state, '', url)
  lastEdit = coalesce ? now : 0
  window.dispatchEvent(new Event(event))
}

export function updateReport(update: (state: ReportState) => ReportState, coalesce = false) {
  writeReport(update(parseReport(getSnapshot()).state), coalesce)
}

export function useReportUrl() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => '')
  return useMemo(() => parseReport(raw), [raw])
}
