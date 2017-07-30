const {
  projectManagementLabels,
  clientRelationshipManagementLabels,
  teamMembersLabels,
} = require('../../labels')

const {
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
  transformTeamMembersForView,
} = require('../../services/formatting')

function getDetailsHandler (req, res, next) {
  try {
    const investmentData = res.locals.investmentData

    const projectManagementData = transformProjectManagementForView(investmentData)
    const clientRelationshipManagementData = transformClientRelationshipManagementForView(investmentData)
    const teamMembersData = investmentData.team_members.map(transformTeamMembersForView)

    res
      .breadcrumb('Project team')
      .render('investment-projects/views/team/details', {
        projectManagementData,
        projectManagementLabels,
        clientRelationshipManagementData,
        clientRelationshipManagementLabels,
        teamMembersData,
        teamMembersLabels,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetailsHandler,
}
