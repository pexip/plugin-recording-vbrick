import EventEmitter from 'eventemitter3'
import { Auth } from './auth'
import { config } from './config'
import { getPlugin } from './plugin'

let videoId: string = ''

const startRecording = async (title: string, address: string, pin: string): Promise<void> => {
  const plugin = getPlugin()

  const path = '/api/v2/vc/start-recording'
  const url = new URL(path, config.vbrick.url)

  const body = {
    title,
    sipAddress: address,
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

  const json = await response.json()
  videoId = json.videoId
  emitter.emit('changed')
  await plugin.ui.showToast({ message: 'Recording started. It will appear in a few seconds.' })
}

const stopRecording = async (): Promise<void> => {
  const plugin = getPlugin()

  const path = '/api/v2/vc/stop-recording'
  const url = new URL(path, config.vbrick.url)

  const body = { videoId }

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `VBrick ${Auth.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  })
  videoId = ''
  emitter.emit('changed')
  await plugin.ui.showToast({ message: 'Recording stopped' })
}

const isRecording = (): boolean => {
  return videoId !== ''
}

const emitter = new EventEmitter()

export const Recording = {
  startRecording,
  stopRecording,
  isRecording,
  emitter
}
