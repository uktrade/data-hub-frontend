import { isWithinLastTwelveMonths } from './date'
import { ERROR_MESSAGES } from './constants'

const TEXT_FIELD_MAX_LENGTH = 128

export const POSITIVE_INT_REGEX = /^[0-9]{1,19}$/
export const isPositiveInteger = (value) => POSITIVE_INT_REGEX.test(value)

export const validateTeamMembers = (team_members) =>
  Array.isArray(team_members) && team_members.length > 5
    ? 'You can only add 5 team members'
    : null

export const validateWinDate = ({ month, year }) =>
  isWithinLastTwelveMonths(new Date(year, month - 1))
    ? null
    : 'Date must be in the last 12 months'

export const validateTextField = (name) => (value) =>
  value && value.length > TEXT_FIELD_MAX_LENGTH
    ? `${name} must be 128 characters or less`
    : null

export const validateLeadOfficer = (leadOfficer, field, { values }) => {
  const leadOfficerId = leadOfficer?.value
  if (!leadOfficerId) return null

  const inContributors = Object.keys(values)
    .filter((k) => k.startsWith('contributing_officer_'))
    .some((k) => values[k]?.value === leadOfficerId)

  return inContributors ? ERROR_MESSAGES.lead_officer_contributor : null
}

export const validateTeamMembersAreNotContributors = (
  teamMembers,
  field,
  { values }
) => {
  if (!Array.isArray(teamMembers)) return null

  const contributors = Object.keys(values)
    .filter((k) => k.startsWith('contributing_officer_'))
    .map((k) => values[k]?.value)

  const isContributor = teamMembers.some((m) => contributors.includes(m?.value))
  return isContributor ? ERROR_MESSAGES.team_member_contributor : null
}

export const validateTeamMembersAndLeadOfficer = (
  teamMembers,
  field,
  { values }
) => {
  if (!Array.isArray(teamMembers)) return null

  const leadOfficerId = values.lead_officer?.value

  const hasConflict = teamMembers.some((m) => m?.value === leadOfficerId)
  return hasConflict ? ERROR_MESSAGES.lead_officer_team_member : null
}

export const validateContributorIsNotLeadOfficer = (
  contributor,
  field,
  { values }
) => {
  const contributorId = contributor?.value

  const isLeadOfficer = values.lead_officer?.value == contributorId

  return isLeadOfficer ? ERROR_MESSAGES.lead_officer_contributor : null
}

export const validateContributorIsNotTeamMember = (
  contributor,
  field,
  { values }
) => {
  if (!values.team_members) {
    return null
  }
  const contributorId = contributor?.value
  const isTeamMember = values.team_members.some(
    (m) => m?.value === contributorId
  )
  return isTeamMember ? ERROR_MESSAGES.contributing_officer_team_member : null
}

export const validateContributorDuplication = (
  contributor,
  field,
  { values }
) => {
  const contributorId = contributor?.value
  if (!contributorId) return null

  const contributors = Object.keys(values).filter((k) =>
    k.startsWith('contributing_officer_')
  )

  const idToFields = {}

  for (const contributor of contributors) {
    const id = values[contributor]?.value
    if (!id) continue
    if (!idToFields[id]) idToFields[id] = []
    idToFields[id].push(contributor)
  }

  const duplicates = Object.entries(idToFields).filter(
    ([, keys]) => keys.length > 1
  )
  for (const [id, keys] of duplicates) {
    // Show error only for the last duplicated field
    // for each duplicated contributing officer
    if (id === contributorId && keys[keys.length - 1] === field.name) {
      return ERROR_MESSAGES.contributing_officer_duplicate
    }
  }

  return null
}
