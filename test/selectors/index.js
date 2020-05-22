exports.collection = require('./collection')
exports.companyAdd = require('./company/add-company')
exports.companyMatch = require('./company/match-company')
exports.companyActivity = require('./company/activity')
exports.companyAudit = require('./company/audit')
exports.companyBusinessDetails = require('./company/business-details')
exports.companyContact = require('./company/contact')
exports.companyEdit = require('./company/edit')
exports.companyEditOneList = require('./company/edit-one-list')
exports.companyExport = require('./company/export')
exports.companyCollection = require('./company/company-collection')
exports.companyInvestment = require('./company/investment')
exports.companyInvestmentProjects = require('./company/investment-projects')
exports.companyForm = require('./company/form')
exports.companySubsidiariesLink = require('./company/subsidiaries-link')
exports.companySubsidiaries = require('./company/subsidiaries')
exports.companyAddToListButton = require('./company/add-to-list')
exports.companyCreateListButton = require('./company')
exports.companyAddRemoveFromLists = require('./company-lists/add-remove')
exports.companyLeadAdviser = require('../selectors/company/lead-adviser')

exports.referralDetails = require('../selectors/referrals/referral-details')

exports.companyList = {
  delete: require('./company-lists/delete'),
  create: require('./company-lists/create'),
  edit: require('./company-lists/edit'),
}

exports.companyDnbHierarchy = {
  collection: '#dnb-hierarchy',
}

exports.contactCreate = require('./contact/create')
exports.eventCreate = require('./event/create')

exports.omisCreate = require('./omis/create')
exports.omisSummary = require('./omis/summary')

exports.breadcrumbs = require('./breadcrumbs')
exports.detailsContainer = require('./details-container')
exports.document = require('./document')
exports.editHistory = require('./edit-history')
exports.entityCollection = require('./entity-collection')
exports.filter = require('./filter')

exports.interaction = {
  complete: require('./interaction/complete'),
  details: require('./interaction/details'),
}
exports.investment = {
  proposition: require('./investment/proposition'),
  form: require('./investment/form'),
  value: require('./investment/value'),
  team: require('./investment/team'),
}
exports.interactionForm = require('./interaction-form')
exports.keyValueTable = require('./key-value-table')
exports.localHeader = require('./local-header')
exports.message = require('./message')
exports.nav = require('./nav')
exports.tabbedLocalNav = require('./tabbed-local-nav')
exports.tabbedNav = require('./tabbed-nav')
exports.uneditableField = require('./uneditable-field')
exports.createInteractionContext = require('./create-interaction-context')
exports.companyLocalHeader = require('./company-local-header')
