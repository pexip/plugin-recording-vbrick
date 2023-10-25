import type { GroupButtonPayload } from '@pexip/plugin-api'
import { ButtonId } from './ButtonId'

export const StartButtonPayload: GroupButtonPayload = {
  id: ButtonId.Start,
  position: 'toolbar',
  icon: 'IconPlayRound',
  tooltip: 'Start recording',
  roles: ['chair']
}
