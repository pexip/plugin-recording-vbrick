const response = await fetch('./config.json')

interface Config {
  vbrick: {
    url: string
    client_id: string
    redirect_uri: string
  }
  infinity: {
    sip_domain: string
  }
}

export const config: Config = await response.json()
