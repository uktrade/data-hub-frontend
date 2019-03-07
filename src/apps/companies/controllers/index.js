const addController = require('./add')
const editController = require('./edit')
const archiveController = require('./archive')
const auditController = require('./audit')
const contactsController = require('./contacts')
const exportsController = require('./exports')
const investmentsController = require('./investments/projects')
const renderCompanyList = require('./list')

module.exports = {
  addController,
  editController,
  archiveController,
  auditController,
  contactsController,
  exportsController,
  investmentsController,
  renderCompanyList,
}
