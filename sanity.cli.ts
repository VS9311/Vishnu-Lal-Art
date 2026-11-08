import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2gtua40d',
    dataset: 'staging'
  },
  deployment: {
    appId: 'eg3sonyqqeyg8c3mvsl7hejh',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
