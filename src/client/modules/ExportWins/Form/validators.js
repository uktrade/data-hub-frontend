export const validateTeamMembers = (team_members) =>
  Array.isArray(team_members) && team_members.length > 5
    ? 'You can only add 5 team members'
    : null
