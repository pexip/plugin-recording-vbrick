import { getPlugin } from './plugin'

let conferenceAlias = ''

export const subscribeConferenceAlias = (): void => {
  const plugin = getPlugin()
  plugin.events.authenticatedWithConference.add((conference) => {
    conferenceAlias = conference.conferenceAlias
  })
  plugin.events.conferenceStatus.add((conference) => {
    console.log(conference)
  })
}

export const getConferenceAlias = (): string => {
  return conferenceAlias
}
