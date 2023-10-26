import { Auth } from './auth'
import { config } from './config'

export const authPopUpId = 'vbrick-auth'
export const authOPopUpOpts = 'toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,width=500,height=500,left=600,top=250'

export const initAuthPopUp = (): void => {
  // Hide the interface if we are in the redirect page
  if (parent.location.href.split('?')[0] === config.vbrick.redirect_uri) {
    parent.document.body.style.display = 'none'
  }

  window.plugin.popupManager.add(authPopUpId, (input) => {
    setTimeout(() => { managePopUpRedirect() }, 0)
    return true
  })
}

const managePopUpRedirect = (): void => {
  const popUp = window.plugin.popupManager.get(authPopUpId)
  if (popUp == null) {
    return
  }
  try {
    const url = popUp.location.href
    if (url === 'about:blank') {
      setTimeout(managePopUpRedirect, 1000)
      return
    } else if (popUp.location.href.split('?')[0] !== config.vbrick.redirect_uri) {
      setTimeout(managePopUpRedirect, 1000)
      return
    }
  } catch (e) {
    setTimeout(managePopUpRedirect, 1000)
    return
  }
  const urlParams = new URLSearchParams(popUp.location.search)
  const code: string = urlParams.get('code') ?? ''
  Auth.createAccessToken(code).catch((e) => { console.error(e) })
  popUp.close()
}
