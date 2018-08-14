const addController = require('./add')
const editController = require('./edit')
const archiveController = require('./archive')
const auditController = require('./audit')
const contactsController = require('./contacts')
const exportsController = require('./exports')
const interactionsController = require('./interactions')
const investmentsController = require('./investments')
const renderCompanyList = require('./list')

module.exports = {
  addController,
  editController,
  archiveController,
  auditController,
  contactsController,
  exportsController,
  interactionsController,
  investmentsController,
  renderCompanyList,
}
