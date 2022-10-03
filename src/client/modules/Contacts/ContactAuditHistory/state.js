import qs from 'qs'

export const ID = 'contactAuditLog'

export const state2props = ({ ...state }) => {
  const page = qs.parse(location.search.slice(1)).page || '1'

  return {
    ...state[ID],
    page: parseInt(page, 10),
  }
}
