const { transformBriefInvestmentSummary } = require('../services/formatting')
const { getAdviser } = require('../../adviser/repos')

function getBriefInvestmentSummary (req, res, next) {
  try {
    res.locals.briefInvestmentSummaryData = transformBriefInvestmentSummary(res.locals.investmentData)
    next()
  } catch (error) {
    next(error)
  }
}

async function expandTeamMembers (req, res, next) {
  try {
    // Fetch further details about any team members so their team can be displayed.
    // Note - Looping through items and fetching data instead of using map
    // as await cannot be used arrow functions
    const teamMembers = []

    for (const teamMember of res.locals.investmentData.team_members) {
      const teamMemberAdvisor = await getAdviser(req.session.token, teamMember.adviser.id)
      teamMembers.push({
        adviser: teamMemberAdvisor,
        role: teamMember.role,
      })
    }

    res.locals.investmentData.team_members = teamMembers
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getBriefInvestmentSummary,
  expandTeamMembers,
}
