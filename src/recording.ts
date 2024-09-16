import EventEmitter from 'eventemitter3'
import { Auth } from './auth'
import { config } from './config'
import { updateButton } from './button'
import type { InfinityParticipant } from '@pexip/plugin-api'
import { plugin } from './plugin'
import { conferenceAlias } from './conferenceAlias'
import { LocalStorageKey } from './LocalStorageKey'

let videoId: string = ''

let participants: InfinityParticipant[] = []

const init = (): void => {
  // Initialize the videoId at the beginning of the conference
  plugin.events.authenticatedWithConference.add(() => {
    console.log('Authenticated with conference')
    console.log('Participant list', participants)
    if (participants.length === 0) {
      videoId = ''
    }
  })

  plugin.events.participantJoined.add(async (event) => {
    const vbrickHostname = new URL(config.vbrick.url).hostname

    if (event.participant.uri.split('@')[1] === vbrickHostname) {
      ;(plugin.conference as any).sendRequest({
        path: 'transform_layout',
        method: 'POST',
        payload: {
          transforms: {
            recording_indicator: true
          }
        }
      })
      // With this we avoid having to pass the PIN (host or guest) to Vbrick
      await plugin.conference.setRole({
        role: 'chair',
        participantUuid: event.participant.uuid
      })
      await plugin.conference.setRole({
        role: 'guest',
        participantUuid: event.participant.uuid
      })
    }
  })

  plugin.events.participantLeft.add((event) => {
    const vbrickHostname = new URL(config.vbrick.url).hostname

    if (event.participant.uri.split('@')[1] === vbrickHostname) {
      ;(plugin.conference as any).sendRequest({
        path: 'transform_layout',
        method: 'POST',
        payload: {
          transforms: {
            recording_indicator: false
          }
        }
      })
    }
  })

  // Check if we were recording before. This way we can recover the state in
  // case the user reload the page
  plugin.events.participants.add(async (event) => {
    participants = event.participants
  })

  plugin.events.participantLeft.add(async (event) => {
    const participant = event.participant
    if (isRecordingParticipant(participant)) {
      videoId = ''
      await updateButton()
    }
  })
}

const startRecording = async (): Promise<void> => {
  if (isAnotherRecordingActive()) {
    await plugin.ui.showToast({
      message: 'Another user has already enabled the recording'
    })
    return
  }

  const domain = config.infinity.sip_domain
  const uri = `${conferenceAlias}@${domain}`
  const pin = ''

  const path = '/api/v2/vc/start-recording'
  const url = new URL(path, config.vbrick.url)

  const body = {
    title: uri,
    sipAddress: uri,
    sipPin: pin
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `VBrick ${Auth.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  })

  if (response.status === 200) {
    const json = await response.json()
    videoId = json.videoId
    localStorage.setItem(LocalStorageKey.VideoId, videoId)
    emitter.emit('changed')
    await plugin.ui.showToast({
      message: 'Recording requested. It will start in a few seconds.'
    })
  } else {
    await plugin.ui.showToast({ message: 'Cannot start the recording' })
  }
}

const stopRecording = async (): Promise<void> => {
  const path = '/api/v2/vc/stop-recording'
  const url = new URL(path, config.vbrick.url)

  const body = { videoId }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `VBrick ${Auth.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  })
  if (response.status === 200) {
    videoId = ''
    localStorage.removeItem(LocalStorageKey.VideoId)
    emitter.emit('changed')
    await plugin.ui.showToast({ message: 'Recording stopped' })
  } else {
    await plugin.ui.showToast({ message: 'Cannot stop the recording' })
  }
}

const isRecording = (): boolean => {
  return videoId !== ''
}

/**
 * Check if there is another user making a recording.
 */
const isAnotherRecordingActive = (): boolean => {
  if (participants == null) {
    return false
  }
  const vbrickDomain = new URL(config.vbrick.url).hostname
  const recordingParticipant = participants.find((participant) => {
    const domain = participant.uri.split('@')[1]
    return domain === vbrickDomain
  })
  const active = recordingParticipant != null
  return active
}

const isRecordingParticipant = (participant: InfinityParticipant): boolean => {
  const domain = new URL(config.vbrick.url).hostname
  const recordingUri = `sip:${Auth.getUser()?.username}@${domain}`

  return participant.uri === recordingUri
}

const emitter = new EventEmitter()

export const Recording = {
  init,
  startRecording,
  stopRecording,
  isRecording,
  emitter
}
