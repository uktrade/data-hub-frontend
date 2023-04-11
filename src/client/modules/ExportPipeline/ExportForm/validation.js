import { ERROR_MESSAGES } from './constants'

export const validateTeamMembers = (team_members) =>
  Array.isArray(team_members) && team_members.length > 5
    ? ERROR_MESSAGES.team_members
    : null
