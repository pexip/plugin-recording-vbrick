import { authPopUpId } from '../authPopUp'
import { StartButtonPayload } from './buttonGroup/StartButtonPayload'
import { LogoutButtonPayload } from './buttonGroup/LogoutButtonPayload'
import { ButtonId } from './buttonGroup/ButtonId'
import { Auth } from '../auth'
import { VideosButtonPayload } from './buttonGroup/VideoButtonPayload'
import { showLogoutPrompt } from '../logoutPrompt'
import { Recording } from '../recording'

import type { Button, RPCCallPayload } from '@pexip/plugin-api'
import { StopButtonPayload } from './buttonGroup/StopButtonPayload'
import { getPlugin } from '../plugin'

const opts = 'toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,width=500,height=500,left=250,top=250'

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
      openParams: [await Auth.getAuthUrl(), '', opts]
    }
  }

  if (button != null) {
    await button.update(payload)
    button.onClick.remove(handleClickGroup)
  } else {
    button = await plugin.ui.addButton(payload)
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

  // Avoid to observer the event more than once
  try {
    button.onClick.add(handleClickGroup)
  } catch (e) {
    console.error(e)
  }
}

const handleClickGroup = ({ buttonId }: { buttonId: string }): void => {
  switch (buttonId) {
    case ButtonId.Start: {
      Recording.startRecording('My recoding', 'meet.marcoscereijo@pexipdemo.com', '').catch((e) => { console.error(e) })
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
      throw new Error('Unknown button pressed')
    }
  }
}
