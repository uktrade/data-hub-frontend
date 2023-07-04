/* eslint-disable no-console */

// Keys
export const DASHBOARD_TAB = 'dashboard-tab'

export const writeToLocalStorage = (key, value, stringify = false) => {
  try {
    window.localStorage.setItem(key, stringify ? JSON.stringify(value) : value)
  } catch (error) {
    // The user may have configured the browser to prevent the page from persisting data.
    console.error(`Unable to write ${key} to local storage: ${error}`)
  }
}

export const readFromLocalStorage = (key, parse = false) => {
  const item = window.localStorage.getItem(key)
  try {
    return parse ? JSON.parse(item) : item
  } catch (error) {
    console.error(`Unable to read ${key} from local storage: ${error}`)
    return null
  }
}
