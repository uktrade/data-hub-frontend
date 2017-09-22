const addController = require('./add')
const editController = require('./edit')
const archiveController = require('./archive')
const auditController = require('./audit')
const chController = require('./ch')
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
  archiveController,
  auditController,
  chController,
  contactsController,
  expController,
  foreignController,
  interactionsController,
  investmentsController,
  ltdController,
  ukotherController,
  renderCompanyList,
}
