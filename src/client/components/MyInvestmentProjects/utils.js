import { assign } from 'lodash'

export const saveToSession = (payload) => {
  const state = assign(getFromSession(), payload)
  window.sessionStorage.setItem('myInvestmentProjects', JSON.stringify(state))
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
