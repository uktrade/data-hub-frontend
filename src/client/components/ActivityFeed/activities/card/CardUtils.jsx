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

const getCompany = (activity) => {
  return get(activity, 'object.attributedTo', [])
    .filter(({ type }) => type !== 'dit:Company')
    .map(({ name }) => ({ name }))
    .shift()
}

const getAdvisers = (activity) => {
  return mapPeople(
    activity,
    'dit:Adviser',
    ({ id, name, 'dit:emailAddress': emailAddress, 'dit:team': team }) => {
      return pickBy({
        id,
        name,
        emailAddress,
        team: get(team, 'name'), // Only available for Interactions
        type: 'Adviser',
      })
    }
  )
}

const canRenderByTypes = (activity, types) => {
  const activityTypes = get(activity, 'object.type')

  return some(types, (type) => includes(activityTypes, type))
}

const getAdviser = (activity) => {
  const adviser = {
    id: get(activity, 'actor.id'),
    name: get(activity, 'actor.name'),
    emailAddress: get(activity, 'actor.dit:emailAddress'),
  }

  return adviser.name && adviser.emailAddress ? adviser : null
}

const transform = (activity) => ({
  url: get(activity, 'object.url'),
  subject: get(activity, 'object.dit:subject'),
  service: get(activity, 'object.dit:service.name'),
  startTime: get(activity, 'object.startTime'),
})

export default {
  canRenderByTypes,
  getAdvisers,
  getContacts,
  getCompany,
  getAdviser,
  transform,
  getContactsGroupedByRegistrationStatus,
  getStatusByLatest,
}
