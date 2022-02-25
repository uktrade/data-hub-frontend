export const validateTeamAdvisersAreUnique = (teamMembers) => {
  const advisers = teamMembers.map((teamMember) => teamMember.adviser)
  const uniqueAdvisers = new Set(advisers)
  if (advisers.length != uniqueAdvisers.size) {
    return 'You cannot add the same adviser as a team member more than once.'
  }
  return null
}
