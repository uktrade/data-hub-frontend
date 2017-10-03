const clientRelationshipManagementFormMiddleware = require('./client-relationship-management')
const detailsFormMiddleware = require('./details')
const investmentTypeFormMiddleware = require('./investment-type')
const projectManagementFormMiddleware = require('./project-management')
const projectStageFormMiddleware = require('./project-stage')
const requirementsFormMiddleware = require('./requirements')
const teamMembersFormMiddleware = require('./team-members')
const valueFormMiddleware = require('./value')

module.exports = {
  clientRelationshipManagementFormMiddleware,
  detailsFormMiddleware,
  investmentTypeFormMiddleware,
  projectManagementFormMiddleware,
  projectStageFormMiddleware,
  requirementsFormMiddleware,
  teamMembersFormMiddleware,
  valueFormMiddleware,
}
