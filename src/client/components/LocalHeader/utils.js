const BANNER_DISMISSED = 'isBannerDismissed'

export const saveToLocalStorage = (isBannerDismissed = '') => {
  window.localStorage.setItem(BANNER_DISMISSED, isBannerDismissed)
}

export const getFromLocalStorage = () => {
  try {
    return window.localStorage.getItem(BANNER_DISMISSED)
  } catch {
    return {}
  }
}
