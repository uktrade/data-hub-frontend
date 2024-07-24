import Cookies from 'js-cookie'

export const COOKIE_CONSENT_COOKIE_NAME = 'cookie-consent'
export const GRANTED = 'granted'
export const DENIED = 'denied'

export const loadCookiePreference = () =>
  localStorage.getItem(COOKIE_CONSENT_COOKIE_NAME)

export const saveCookiePreference = (payload) => {
  if (!window.gtag) {
    throw Error(
      'window.gtag not defined, you probably forgot to set the GOOGLE_TAG_MANAGER_KEY env var.'
    )
  }
  if (![GRANTED, DENIED].includes(payload)) {
    throw Error('Payload must be "granted" or "denied"')
  }

  localStorage.setItem(COOKIE_CONSENT_COOKIE_NAME, payload)

  window.gtag('consent', 'update', {
    analytics_storage: payload,
  })

  if (payload === DENIED) {
    for (const cookieName in Cookies.get()) {
      Cookies.remove(cookieName)
    }
  }

  return payload
}
