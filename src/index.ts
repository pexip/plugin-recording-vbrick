import { registerPlugin } from '@pexip/plugin-api'
import { initButton, initButtonGroup } from './buttons/button'
import { initAuthPopUp } from './authPopUp'
import { Auth } from './auth'
import { Recording } from './recording'
import { setPlugin } from './plugin'
import { subscribeConferenceAlias } from './conferenceAlias'

const plugin = await registerPlugin({
  id: 'plugin-recording-vbrick',
  version: 0
})

setPlugin(plugin)

subscribeConferenceAlias()
Recording.init()

Auth.emitter.on('login', () => {
  initButtonGroup().catch((e) => { console.error(e) })
  plugin.ui.showToast({ message: 'Logged into Vbrick' }).catch((e) => { console.error(e) })
})

Auth.emitter.on('refreshed_token', () => {
  initButtonGroup().catch((e) => { console.error(e) })
})

Auth.emitter.on('logout', () => {
  initButton().catch((e) => { console.error(e) })
  plugin.ui.showToast({ message: 'Logged out from Vbrick' }).catch((e) => { console.error(e) })
})

Recording.emitter.on('changed', () => {
  initButtonGroup().catch((e) => { console.error(e) })
})

initAuthPopUp()
await initButton()

if (await Auth.isSessionValid()) {
  await Auth.refreshAccessToken()
}
