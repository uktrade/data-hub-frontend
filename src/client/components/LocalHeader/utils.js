const BANNER_DISMISSED = 'isBannerDismissed'

export const saveToLocalStorage = (isBannerDismissed = true) => {
  window.localStorage.setItem(BANNER_DISMISSED, isBannerDismissed)
}

export const getFromLocalStorage = () => {
  try {
    return window.localStorage.getItem(BANNER_DISMISSED) === 'true'
  } catch {
    return {}
  }
}
