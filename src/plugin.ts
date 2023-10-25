import type { Plugin } from '@pexip/plugin-api'

let plugin: Plugin

export const setPlugin = (pluginObj: Plugin): void => {
  plugin = pluginObj
}

export const getPlugin = (): Plugin => {
  return plugin
}
