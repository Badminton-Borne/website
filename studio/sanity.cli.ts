import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'jouw-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Gehoste Studio: `npx sanity deploy` → https://badminton-borne.sanity.studio
  studioHost: 'badminton-borne',
  deployment: {
    appId: 'ij0gevsu5zzx9t50kw1jjll6',
    autoUpdates: true,
  },
})
