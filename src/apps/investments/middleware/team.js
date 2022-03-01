const { getAdviser } = require('../../adviser/repos')

async function expandTeamMembers(req, res, next) {
  try {
    // Fetch further details about any team members so their team can be displayed.
    // Note - Looping through items and fetching data instead of using map
    // as await cannot be used arrow functions
    const teamMembers = []

    for (const teamMember of res.locals.investment.team_members) {
      const teamMemberAdvisor = await getAdviser(req, teamMember.adviser.id)
      teamMembers.push({
        adviser: teamMemberAdvisor,
        role: teamMember.role,
      })
    }

    res.locals.investment.team_members = teamMembers
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  expandTeamMembers,
}
