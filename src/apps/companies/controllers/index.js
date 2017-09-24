const addController = require('./add')
const editController = require('./edit')
const viewController = require('./view')
const archiveController = require('./archive')
const auditController = require('./audit')
const companiesHouseController = require('./companies-house')
const contactsController = require('./contacts')
const expController = require('./exp')
const foreignController = require('./foreign')
const interactionsController = require('./interactions')
const investmentsController = require('./investments')
const ltdController = require('./ltd')
const ukotherController = require('./ukother')
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
  foreignController,
  interactionsController,
  investmentsController,
  ltdController,
  ukotherController,
  renderCompanyList,
}
