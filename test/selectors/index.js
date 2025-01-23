exports.collection = require('./collection')
exports.companyAdd = require('./company/add-company')
exports.companyMatch = require('./company/match-company')
exports.companyBusinessDetails = require('./company/business-details')
exports.companyEdit = require('./company/edit')
exports.companyEditOneList = require('./company/edit-one-list')
exports.companyExport = require('./company/export')
exports.companyInvestment = require('./company/investment')
exports.companyInvestmentProjects = require('./company/investment-projects')
exports.companySubsidiariesLink = require('./company/subsidiaries-link')
exports.companySubsidiaries = require('./company/subsidiaries')

exports.sendReferral = require('../selectors/referrals/send-referral')

exports.companyList = {
  delete: require('./company-lists/delete'),
  create: require('./company-lists/create'),
  edit: require('./company-lists/edit'),
}

exports.eventCreate = require('./event/createOrEdit')

exports.entityCollection = require('./entity-collection')

exports.interaction = {
  details: require('./interaction/details'),
}
exports.investment = {
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
exports.createInteractionContext = require('./create-interaction-context')
exports.supportForm = require('./support-form')
