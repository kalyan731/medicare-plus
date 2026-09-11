import { Client, Account } from 'appwrite'

const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

const isValidUrl = (url) => {
  try {
    return Boolean(new URL(url))
  } catch {
    return false
  }
}

export const isAppwriteConfigured = Boolean(
  appwriteEndpoint &&
  appwriteProjectId &&
  isValidUrl(appwriteEndpoint) &&
  !appwriteEndpoint.includes('your_appwrite') &&
  !appwriteProjectId.includes('your_project')
)

if (!isAppwriteConfigured) {
  console.warn(
    '[MediCare Plus] Appwrite endpoint or project ID is missing or invalid in .env. Please update .env with your Appwrite credentials.'
  )
}

export const appwriteClient = isAppwriteConfigured
  ? new Client()
      .setEndpoint(appwriteEndpoint)
      .setProject(appwriteProjectId)
  : null

export const appwriteAccount = isAppwriteConfigured
  ? new Account(appwriteClient)
  : null
