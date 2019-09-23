exports.companyAdd = require('./company/add-company')
exports.companyActivity = require('./company/activity')
exports.companyBusinessDetails = require('./company/business-details')
exports.companyAddStep2 = require('./company/add-step-2')
exports.companyEdit = require('./company/edit')
exports.companyCollection = require('./company/company-collection')
exports.companyInvestment = require('./company/investment')
exports.companySubsidiariesLink = require('./company/subsidiaries-link')
exports.companySubsidiaries = require('./company/subsidiaries')
exports.companyAddToListButton = require('./company/add-to-list')
exports.companyCreateListButton = require('./company')

exports.companyList = {
  delete: require('./company-lists/delete'),
  create: require('./company-lists/create'),
}

exports.contactCreate = require('./contact/create')

exports.omisCreate = require('./omis/create')
exports.omisSummary = require('./omis/summary')

exports.breadcrumbs = require('./breadcrumbs')
exports.detailsContainer = require('./details-container')
exports.document = require('./document')
exports.entityCollection = require('./entity-collection')
exports.filter = require('./filter')

exports.interaction = {
  complete: require('./interaction/complete'),
  details: require('./interaction/details'),
}
exports.interactionForm = require('./interaction-form')
exports.keyValueTable = require('./key-value-table')
exports.localHeader = require('./local-header')
exports.nav = require('./nav')
exports.tabbedLocalNav = require('./tabbed-local-nav')
exports.uneditableField = require('./uneditable-field')
exports.createInteractionContext = require('./create-interaction-context')
