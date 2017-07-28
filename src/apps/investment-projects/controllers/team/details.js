const {
  projectManagementLabels,
  clientRelationshipManagementLabels,
} = require('../../labels')

const {
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
} = require('../../services/formatting')

function getDetailsHandler (req, res, next) {
  try {
    const projectManagementData = transformProjectManagementForView(res.locals.investmentData)
    const clientRelationshipManagementData = transformClientRelationshipManagementForView(res.locals.investmentData)

    res
      .breadcrumb('Project team')
      .render('investment-projects/views/team/details', {
        projectManagementData,
        projectManagementLabels,
        clientRelationshipManagementData,
        clientRelationshipManagementLabels,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetailsHandler,
}
