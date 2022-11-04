const ANNOUNCEMENT_LINK = 'announcement-link'

export const writeToLocalStorage = (announcementLink) => {
  window.localStorage.setItem(ANNOUNCEMENT_LINK, announcementLink)
}

export const readFromLocalStorage = () => {
  try {
    return window.localStorage.getItem(ANNOUNCEMENT_LINK)
  } catch {
    return {}
  }
}
