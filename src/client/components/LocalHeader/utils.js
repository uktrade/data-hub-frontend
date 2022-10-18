export const saveToLocalStorage = (isBannerDismissed = true) => {
  window.localStorage.setItem('isBannerDismissed', isBannerDismissed)
}

export const getFromLocalStorage = () => {
  try {
    return window.localStorage.getItem('isBannerDismissed') || true
  } catch {
    return {}
  }
}
