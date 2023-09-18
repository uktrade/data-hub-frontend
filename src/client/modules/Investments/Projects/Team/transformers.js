import { transformArrayToObject } from '../../../../components/Form/elements/FieldAddAnother/utils'

export const transformAdviserForAPI = (adviser) =>
  adviser ? adviser.value : null

export const transformTeamMembersForFieldAddAnother = (teamMembers = []) => {
  const teamMemberArray = teamMembers.map((teamMember, index) => ({
    ['adviser' + `_${index}`]: {
      value: teamMember.adviser?.id,
      label: teamMember.adviser?.name,
    },
    ['role' + `_${index}`]: teamMember.role,
  }))

  return transformArrayToObject(teamMemberArray)
}

export const transformValuesToArray = (values) => {
  let result = []

  Object.entries(values).forEach(([key, value]) => {
    const prefix = key.split('_')[0]
    const index = key.split('_')[1]
    result[index] = {
      ...result[index],
      [prefix]: value.value || value,
    }
  })
  return result.filter((item) => item !== null)
}

export const transformObjectForTable = (object, emptyText = '') =>
  object ? object.name : emptyText

export const transformLocationsForTable = (locations) =>
  locations ? locations.map((location) => location.name).join(', ') : ''
