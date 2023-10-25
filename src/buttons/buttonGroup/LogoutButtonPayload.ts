import type { GroupButtonPayload } from '@pexip/plugin-api'
import { ButtonId } from './ButtonId'

export const LogoutButtonPayload: GroupButtonPayload = {
  id: ButtonId.Logout,
  position: 'toolbar',
  icon: 'IconLeave',
  tooltip: 'Log out',
  roles: ['chair']
}
