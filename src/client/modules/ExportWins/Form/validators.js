import { isDateWithinLastTwelveMonths } from './utils'

export const POSITIVE_INT_REGEX = /^[0-9]{1,19}$/
export const isPositiveInteger = (value) => POSITIVE_INT_REGEX.test(value)

export const validateTeamMembers = (team_members) =>
  Array.isArray(team_members) && team_members.length > 5
    ? 'You can only add 5 team members'
    : null

export const validateWinDate = ({ month, year }) =>
  !isDateWithinLastTwelveMonths(new Date(year, month - 1))
