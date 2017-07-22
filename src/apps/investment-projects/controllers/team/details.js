const { projectManagementLabels } = require('../../labels')
const { transformProjectManagementForView } = require('../../services/formatting')

function getDetailsHandler (req, res, next) {
  try {
    const projectManagementData = transformProjectManagementForView(res.locals.investmentData)

    res
      .breadcrumb('Project team')
      .render('investment-projects/views/team/details', {
        projectManagementData,
        projectManagementLabels,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetailsHandler,
}
