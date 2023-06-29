/* eslint-disable no-console */
const COMPANY_INTERACTION = 'company-interaction'

export const writeThemeAndKindToLocalStorage = (theme, kind) => {
  try {
    window.localStorage.setItem(
      COMPANY_INTERACTION,
      JSON.stringify({
        theme,
        kind,
      })
    )
  } catch (error) {
    // The user may have configured the browser to prevent the page from persisting data.
    console.error(`Unable to write theme and kind to local storage: ${error}`)
  }
}

export const readThemeAndKindFromLocalStorage = () => {
  try {
    return JSON.parse(window.localStorage.getItem(COMPANY_INTERACTION)) || {}
  } catch (error) {
    console.error(`Unable to read theme and kind from local storage: ${error}`)
    return {}
  }
}
