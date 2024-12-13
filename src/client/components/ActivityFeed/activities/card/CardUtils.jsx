import { filter, get, includes, map, some, pickBy } from 'lodash'

const mapPeople = (activity, personType, mapper) => {
  const { attributedTo } = activity.object
  return map(
    filter(attributedTo, ({ type }) => {
      return includes(type, personType)
    }),
    mapper
  )
}

const getContacts = (activity) => {
  return mapPeople(
    activity,
    'dit:Contact',
    ({ id, url, name, 'dit:jobTitle': jobTitle, registrationStatus }) => {
      return pickBy({
        id,
        url,
        name,
        jobTitle, // Optional field,
        type: 'Contact',
        registrationStatus,
      })
    }
  )
}

const getContactsGroupedByRegistrationStatus = (activity) => {
  return getContacts(activity)
    .filter((a) => a.registrationStatus)
    .reduce((r, a) => {
      if (r[a.registrationStatus]) {
        r[a.registrationStatus].push(a)
      } else {
        r[a.registrationStatus] = [a]
      }
      return r
    }, {})
}

const getStatusByLatest = (contactsList) => {
  let status
  if (contactsList.WaitingList) {
    status = 'Waiting List'
  }
  if (contactsList.Cancelled) {
    status = 'Cancelled'
  }
  if (contactsList.Registered) {
    status = 'Registered'
  }
  if (contactsList.Attended) {
    status = 'Attended'
  }
  return status
}

const canRenderByTypes = (activity, types) => {
  const activityTypes = get(activity, 'object.type')

  return some(types, (type) => includes(activityTypes, type))
}

export default {
  canRenderByTypes,
  getContacts,
  getContactsGroupedByRegistrationStatus,
  getStatusByLatest,
}
