const {
  projectManagementLabels,
  clientRelationshipManagementLabels,
  teamMembersLabels,
} = require('../../labels')

const {
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
  transformTeamMembersForView,
} = require('../../transformers')

function getDetailsHandler(req, res, next) {
  try {
    const { investment } = res.locals

    const clientRelationshipManagementData =
      transformClientRelationshipManagementForView(investment)
    const projectManagementData = transformProjectManagementForView(investment)
    const teamMembersData = investment.team_members.map(
      transformTeamMembersForView
    )

    res.breadcrumb('Project team').render('investments/views/team/details', {
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
