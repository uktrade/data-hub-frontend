const addController = require('./add')
const editController = require('./edit')
const viewController = require('./view')
const archiveController = require('./archive')
const auditController = require('./audit')
const companiesHouseController = require('./companies-house')
const contactsController = require('./contacts')
const expController = require('./exp')
const interactionsController = require('./interactions')
const investmentsController = require('./investments')
const renderCompanyList = require('./list')

module.exports = {
  addController,
  editController,
  viewController,
  archiveController,
  auditController,
  companiesHouseController,
  contactsController,
  expController,
  interactionsController,
  investmentsController,
  renderCompanyList,
}
