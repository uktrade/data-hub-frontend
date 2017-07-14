const { projectManagementTableLabels } = require('../../labels')
const { transformProjectManagementForView } = require('../../services/formatting')

function getDetailsHandler (req, res, next) {
  try {
    const projectManagementData = transformProjectManagementForView(res.locals.investmentData)

    res
      .breadcrumb('Project team')
      .render('investment-projects/views/team/details', {
        currentNavItem: 'team',
        projectManagementData,
        projectManagementTableLabels,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetailsHandler,
}
