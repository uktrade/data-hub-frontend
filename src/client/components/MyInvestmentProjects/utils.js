import { assign } from 'lodash'

export const saveToSession = (payload) => {
  const filters = assign(getFromSession(), payload)
  window.sessionStorage.setItem('myInvestmentProjects', JSON.stringify(filters))
}

export const getFromSession = () => {
  try {
    return (
      JSON.parse(window.sessionStorage.getItem('myInvestmentProjects')) || {}
    )
  } catch {
    return {}
  }
}
