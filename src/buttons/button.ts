import { authOPopUpOpts, authPopUpId } from '../authPopUp'
import { StartButtonPayload } from './buttonGroup/StartButtonPayload'
import { LogoutButtonPayload } from './buttonGroup/LogoutButtonPayload'
import { ButtonId } from './buttonGroup/ButtonId'
import { Auth } from '../auth'
import { VideosButtonPayload } from './buttonGroup/VideoButtonPayload'
import { showLogoutPrompt } from '../logoutPrompt'
import { Recording } from '../recording'
import { StopButtonPayload } from './buttonGroup/StopButtonPayload'
import { getPlugin } from '../plugin'

import type { Button, RPCCallPayload } from '@pexip/plugin-api'

const baseButtonPayload: RPCCallPayload<'ui:button:add'> = {
  position: 'toolbar',
  icon: 'IconLiveStream',
  tooltip: 'Recordings',
  roles: ['chair']
}

let button: Button<'toolbar'>

export const initButton = async (): Promise<void> => {
  const plugin = getPlugin()

  const payload: RPCCallPayload<'ui:button:add'> = {
    ...baseButtonPayload,
    group: undefined,
    opensPopup: {
      id: authPopUpId,
      openParams: [await Auth.getAuthUrl(), '', authOPopUpOpts]
    }
  }

  if (button != null) {
    await button.update(payload)
  } else {
    button = await plugin.ui.addButton(payload)
    button.onClick.add(handleClickGroup)
  }
}

export const initButtonGroup = async (): Promise<void> => {
  const payload = {
    ...baseButtonPayload,
    group: [
      Recording.isRecording() ? StopButtonPayload : StartButtonPayload,
      VideosButtonPayload,
      LogoutButtonPayload
    ]
  }

  await button.update(payload)
}

const handleClickGroup = ({ buttonId }: { buttonId: string }): void => {
  switch (buttonId) {
    case ButtonId.Start: {
      Recording.startRecording().catch((e) => { console.error(e) })
      break
    }
    case ButtonId.Stop: {
      Recording.stopRecording().catch((e) => { console.error(e) })
      break
    }
    case ButtonId.Videos: {
      break
    }
    case ButtonId.Logout: {
      showLogoutPrompt().catch((e) => { console.error(e) })
      break
    }
    default: {
      window.plugin.popupManager.get(authPopUpId)?.focus()
    }
  }
}
