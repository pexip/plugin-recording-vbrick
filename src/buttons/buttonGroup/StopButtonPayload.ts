import type { GroupButtonPayload } from '@pexip/plugin-api'
import { ButtonId } from './ButtonId'

export const StopButtonPayload: GroupButtonPayload = {
  id: ButtonId.Stop,
  position: 'toolbar',
  icon: 'IconStopRound',
  tooltip: 'Stop recording',
  roles: ['chair'],
  isActive: true
}
