import { isWithinLastTwelveMonths } from './date'

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
