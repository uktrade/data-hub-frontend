import express from 'express'
import pkg from 'body-parser'
import _ from 'lodash'

const { urlencoded, json } = pkg

const config = {
  PORT: process.env.SANDBOX_PORT || 8000,
}

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())

// TODO: Remove these legacy Sandbox vars after all the mocks are refactored
global.state = {}
global._ = _

import { advisers, singleAdviser } from './routes/adviser.js'
import { homePage } from './routes/dashboard.js'
import { ping } from './routes/ping.js'
// TODO: `/metadata/*` endpoints are deprecated and should be removed or on after 17th October 2019
import {
  likelihoodToLand,
  exportExperienceCategory,
  investmentInvestorType,
  investmentInvolvement,
  investmentSpecificProgramme,
  investmentProjectStage,
  investmentBusinessActivity,
  investmentType,
  investmentStrategicDriver,
  orderServiceType,
  orderCancellationReason,
  omisMarket,
  salaryRange,
  fdiValue,
  fdiType,
  turnover,
  sector,
  locationType,
  eventType,
  programme,
  businessType,
  evidenceTag,
  employeeRange,
  country,
  ukRegion,
  referralSourceWebsite,
  referralSourceMarketing,
  referralSourceActivity,
  headquarterType,
  service,
  communicationChannel,
  team,
  policyArea,
  policyIssueType,
  serviceDeliveryStatus,
  capitalInvestmentInvestorType,
  capitalInvestmentRequiredChecks,
  capitalInvestmentDealTicketSize,
  capitalInvestmentInvestmentTypes,
  capitalInvestmentMinimumReturnRate,
  capitalInvestmentTimeHorizons,
  capitalInvestmentRestrictions,
  capitalInvestmentConstructionRisks,
  capitalInvestmentEquityPercentage,
  capitalInvestmentDesiredDealRoles,
  capitalInvestmentAssetClassInterest,
  oneListTier,
} from './routes/metadata.js'
import { whoami, setWhoami, resetWhoami } from './routes/whoami.js'
import { tickets } from './routes/zendesk.js'
import { toRegion, lookup } from './routes/postcode.js'

// V3
import {
  contact,
  contactCreate,
  contactById,
  updateContactById,
  archiveContact,
  auditHistory,
} from './routes/v3/contact/contact.js'
import { eventById } from './routes/v3/event/event.js'
import {
  getOrderById,
  assignees,
  invoice,
  subscriberList,
  payments,
  createPayments,
  quote,
} from './routes/v3/omis/omis.js'
import {
  featureFlag,
  setSandboxFlag,
  resetSandboxFlags,
} from './routes/v3/feature-flag/feature-flag.js'
import {
  createInteraction,
  getInteractions,
  getInteractionById,
  archiveInteraction,
} from './routes/v3/interaction/interaction.js'
import {
  investmentProjects,
  investmentProjectById,
  patchInvestmentProject,
  investmentProjectAudit,
  investmentProjectEvidence,
  documentDownload,
  postInvestmentProject,
  postInvestmentProjectEditTeams,
} from './routes/v3/investment/investment-projects.js'
import { companies } from './routes/v3/search/company.js'
import { contacts } from './routes/v3/search/contact.js'
import { events } from './routes/v3/search/event.js'
import {
  investmentProjects as _investmentProjects,
  exportCsv,
} from './routes/v3/search/investment-project.js'

import { order } from './routes/v3/search/order.js'
import { interaction } from './routes/v3/search/interaction.js'

// V4
import { activityFeed } from './routes/v4/activity-feed/activity-feed.js'
import { company } from './routes/v4/ch-company/company.js'
import {
  referralDetails,
  company as _company,
  companyPatched,
  companies as _companies,
  manageAdviser,
  companyAudit,
  exportWins,
  exportDetail,
  getOneListGroupCoreTeam,
  postOneListTierAndGlobalAccountManager,
  postRemoveFromOneList,
  patchOneListCoreTeam,
  getCompanyList,
  largeInvestorProfile,
  largeInvestorProfilePatched,
  largeInvestorProfilePostCreate,
} from './routes/v4/company/company.js'
import {
  getCompanyLists,
  getCompanyList as _getCompanyList,
  getCompanyListItems,
  createCompanyList,
  deleteCompanyList,
  editCompanyList,
  addCompanyToList,
  removeCompanyFromList,
} from './routes/v4/company-list/companyList.js'
import {
  companyCreate,
  companyInvestigation,
  companySearch,
  companyLink,
  companyChangeRequest,
  companyFamilyTree,
  relatedCompaniesCount,
  relatedCompanies,
} from './routes/v4/dnb/index.js'
import {
  eventById as _eventById,
  patchEvent,
  createEvent,
} from './routes/v4/event/event.js'

import {
  getLargeCapitalOpportunity,
  saveOpportunityDetails,
  getLargeCapitalOpportunityList,
} from './routes/v4/investment/investment.js'
import {
  getInteractions as _getInteractions,
  getInteractionById as _getInteractionById,
  createInteraction as _createInteraction,
  archiveInteraction as _archiveInteraction,
} from './routes/v4/interaction/interaction.js'
import {
  likelihoodToLand as _likelihoodToLand,
  exportExperienceCategory as _exportExperienceCategory,
  investmentInvestorType as _investmentInvestorType,
  investmentInvolvement as _investmentInvolvement,
  investmentSpecificProgramme as _investmentSpecificProgramme,
  investmentProjectStage as _investmentProjectStage,
  investmentBusinessActivity as _investmentBusinessActivity,
  investmentType as _investmentType,
  investmentStrategicDriver as _investmentStrategicDriver,
  investmentDeliveryPartner,
  orderServiceType as _orderServiceType,
  orderCancellationReason as _orderCancellationReason,
  omisMarket as _omisMarket,
  salaryRange as _salaryRange,
  fdiValue as _fdiValue,
  fdiType as _fdiType,
  turnover as _turnover,
  sector as _sector,
  locationType as _locationType,
  eventType as _eventType,
  programme as _programme,
  businessType as _businessType,
  evidenceTag as _evidenceTag,
  employeeRange as _employeeRange,
  country as _country,
  ukRegion as _ukRegion,
  administrativeArea,
  referralSourceWebsite as _referralSourceWebsite,
  referralSourceMarketing as _referralSourceMarketing,
  referralSourceActivity as _referralSourceActivity,
  headquarterType as _headquarterType,
  service as _service,
  communicationChannel as _communicationChannel,
  team as _team,
  policyArea as _policyArea,
  policyIssueType as _policyIssueType,
  exportBarrier,
  serviceDeliveryStatus as _serviceDeliveryStatus,
  capitalInvestmentInvestorType as _capitalInvestmentInvestorType,
  capitalInvestmentRequiredChecks as _capitalInvestmentRequiredChecks,
  capitalInvestmentDealTicketSize as _capitalInvestmentDealTicketSize,
  capitalInvestmentInvestmentTypes as _capitalInvestmentInvestmentTypes,
  capitalInvestmentValueTypes,
  capitalInvestmentStatusTypes,
  capitalInvestmentMinimumReturnRate as _capitalInvestmentMinimumReturnRate,
  capitalInvestmentTimeHorizons as _capitalInvestmentTimeHorizons,
  capitalInvestmentRestrictions as _capitalInvestmentRestrictions,
  capitalInvestmentConstructionRisks as _capitalInvestmentConstructionRisks,
  capitalInvestmentEquityPercentage as _capitalInvestmentEquityPercentage,
  capitalInvestmentDesiredDealRoles as _capitalInvestmentDesiredDealRoles,
  capitalInvestmentAssetClassInterest as _capitalInvestmentAssetClassInterest,
  oneListTier as _oneListTier,
  tradeAgreement,
  exportYears,
  exportExperience,
} from './routes/v4/metadata/index.js'
import { companies as __companies } from './routes/v4/search/company.js'
import { companiesAutocomplete } from './routes/v4/search/company/autocomplete.js'
import { largeInvestorProfile as _largeInvestorProfile } from './routes/v4/search/large-investor-profile/results.js'
import { fetchExportHistory } from './routes/v4/search/exportHistory.js'
import v4referralList from './routes/v4/referrals/list.js'
import { propositions } from './routes/v4/proposition/proposition.js'
import {
  getReminderSubscriptionsSummary,
  getEstimatedLandDateSubscriptions,
  saveEstimatedLandDateSubscriptions,
  getNoRecentInteractionsSubscriptions,
  saveNoRecentInteractionsSubscriptions,
  getNoRecentExportInteractionsSubscriptions,
  saveNoRecentExportInteractionsSubscriptions,
  getNewExportInteractionsSubscriptions,
  saveNewExportInteractionsSubscriptions,
  getEstimatedLandDateReminders,
  getNoRecentExportInteractionReminders,
  getNoRecentInvestmentInteractionReminders,
  getNewExportInteractionReminders,
} from './routes/v4/reminders/index.js'
import { summary } from './routes/v4/reminder/reminder.js'
import { advisers as _advisers } from './routes/v4/search/adviser.js'
import { objectives, objectivesCount } from './routes/v4/objective/index.js'
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  investmentProjectTasks,
} from './routes/v4/task/index.js'

// Datahub API 3rd party dependencies
import { person, bulkPerson } from './routes/api/consentService.js'

import { companiesSearch } from './routes/api/dnbService.js'

// Data store service (github.com/uktrade/data-store-service)
app.get('/api/v1/get-postcode-data/', toRegion)
app.get('/api/v1/get-postcode-data/:postCode', toRegion)

// getaddress.io mock
app.get('/sandbox/postcodelookup/', lookup)

// Referral details
app.get('/v4/company-referral/:id', referralDetails)
// Send a referral
app.post('/v4/company-referral', referralDetails)

// Complete referral
app.post('/v4/company-referral/:id/complete', createInteraction)
app.get('/v4/company-referral', v4referralList)

// Adviser endpoint
app.get('/adviser/', advisers)
app.get('/adviser/:id/', singleAdviser)

// Dashboard endpoint
app.get('/dashboard/homepage/', homePage)

// Metadata endpoint
// TODO: Metadata `/metadata/*` endpoints are deprecated and should be removed on or after 17th October 2019
app.get('/metadata/likelihood-to-land/', likelihoodToLand)
app.get('/metadata/export-experience-category/', exportExperienceCategory)
app.get('/metadata/investment-investor-type/', investmentInvestorType)
app.get('/metadata/investment-involvement/', investmentInvolvement)
app.get('/metadata/investment-specific-programme/', investmentSpecificProgramme)
app.get('/metadata/investment-project-stage/', investmentProjectStage)
app.get('/metadata/investment-business-activity/', investmentBusinessActivity)
app.get('/metadata/investment-type/', investmentType)
app.get('/metadata/investment-strategic-driver/', investmentStrategicDriver)
app.get('/metadata/order-service-type/', orderServiceType)
app.get('/metadata/order-cancellation-reason/', orderCancellationReason)
app.get('/metadata/omis-market/', omisMarket)
app.get('/metadata/salary-range/', salaryRange)
app.get('/metadata/fdi-value/', fdiValue)
app.get('/metadata/fdi-type/', fdiType)
app.get('/metadata/turnover/', turnover)
app.get('/metadata/sector/', sector)
app.get('/metadata/location-type/', locationType)
app.get('/metadata/event-type/', eventType)
app.get('/metadata/programme/', programme)
app.get('/metadata/business-type/', businessType)
app.get('/metadata/evidence-tag/', evidenceTag)
app.get('/metadata/employee-range/', employeeRange)
app.get('/metadata/country/', country)
app.get('/metadata/uk-region/', ukRegion)
app.get('/metadata/referral-source-website/', referralSourceWebsite)
app.get('/metadata/referral-source-marketing/', referralSourceMarketing)
app.get('/metadata/referral-source-activity/', referralSourceActivity)
app.get('/metadata/headquarter-type/', headquarterType)
app.get('/metadata/service/', service)
app.get('/metadata/communication-channel/', communicationChannel)
app.get('/metadata/team/', team)
app.get('/metadata/policy-area/', policyArea)
app.get('/metadata/policy-issue-type/', policyIssueType)
app.get('/metadata/service-delivery-status/', serviceDeliveryStatus)
app.get(
  '/metadata/capital-investment/investor-type/',
  capitalInvestmentInvestorType
)
app.get(
  '/metadata/capital-investment/required-checks-conducted/',
  capitalInvestmentRequiredChecks
)
app.get(
  '/metadata/capital-investment/deal-ticket-size/',
  capitalInvestmentDealTicketSize
)
app.get(
  '/metadata/capital-investment/large-capital-investment-type/',
  capitalInvestmentInvestmentTypes
)
app.get(
  '/metadata/capital-investment/return-rate/',
  capitalInvestmentMinimumReturnRate
)
app.get(
  '/metadata/capital-investment/time-horizon/',
  capitalInvestmentTimeHorizons
)
app.get(
  '/metadata/capital-investment/restriction/',
  capitalInvestmentRestrictions
)
app.get(
  '/metadata/capital-investment/construction-risk/',
  capitalInvestmentConstructionRisks
)
app.get(
  '/metadata/capital-investment/equity-percentage/',
  capitalInvestmentEquityPercentage
)
app.get(
  '/metadata/capital-investment/desired-deal-role/',
  capitalInvestmentDesiredDealRoles
)
app.get(
  '/metadata/capital-investment/asset-class-interest/',
  capitalInvestmentAssetClassInterest
)
app.get('/metadata/one-list-tier/', oneListTier)

// V4 Metadata endpoints
app.get('/v4/metadata/likelihood-to-land', _likelihoodToLand)
app.get('/v4/metadata/export-experience-category', _exportExperienceCategory)
app.get('/v4/metadata/investment-investor-type', _investmentInvestorType)
app.get('/v4/metadata/investment-involvement', _investmentInvolvement)
app.get(
  '/v4/metadata/investment-specific-programme',
  _investmentSpecificProgramme
)
app.get('/v4/metadata/investment-project-stage', _investmentProjectStage)
app.get(
  '/v4/metadata/investment-business-activity',
  _investmentBusinessActivity
)
app.get('/v4/metadata/investment-type', _investmentType)
app.get('/v4/metadata/investment-strategic-driver', _investmentStrategicDriver)
app.get('/v4/metadata/investment-delivery-partner', investmentDeliveryPartner)
app.get('/v4/metadata/order-service-type', _orderServiceType)
app.get('/v4/metadata/order-cancellation-reason', _orderCancellationReason)
app.get('/v4/metadata/omis-market', _omisMarket)
app.get('/v4/metadata/salary-range', _salaryRange)
app.get('/v4/metadata/fdi-value', _fdiValue)
app.get('/v4/metadata/fdi-type', _fdiType)
app.get('/v4/metadata/turnover', _turnover)
app.get('/v4/metadata/sector', _sector)
app.get('/v4/metadata/location-type', _locationType)
app.get('/v4/metadata/event-type', _eventType)
app.get('/v4/metadata/programme', _programme)
app.get('/v4/metadata/business-type', _businessType)
app.get('/v4/metadata/evidence-tag', _evidenceTag)
app.get('/v4/metadata/employee-range', _employeeRange)
app.get('/v4/metadata/country', _country)
app.get('/v4/metadata/uk-region', _ukRegion)
app.get('/v4/metadata/administrative-area', administrativeArea)
app.get('/v4/metadata/referral-source-website', _referralSourceWebsite)
app.get('/v4/metadata/referral-source-marketing', _referralSourceMarketing)
app.get('/v4/metadata/referral-source-activity', _referralSourceActivity)
app.get('/v4/metadata/headquarter-type', _headquarterType)
app.get('/v4/metadata/service', _service)
app.get('/v4/metadata/communication-channel', _communicationChannel)
app.get('/v4/metadata/team', _team)
app.get('/v4/metadata/policy-area', _policyArea)
app.get('/v4/metadata/policy-issue-type', _policyIssueType)
app.get('/v4/metadata/export-barrier', exportBarrier)
app.get('/v4/metadata/service-delivery-status', _serviceDeliveryStatus)
app.get(
  '/v4/metadata/capital-investment/investor-type',
  _capitalInvestmentInvestorType
)
app.get(
  '/v4/metadata/capital-investment/required-checks-conducted',
  _capitalInvestmentRequiredChecks
)
app.get(
  '/v4/metadata/capital-investment/deal-ticket-size',
  _capitalInvestmentDealTicketSize
)
app.get(
  '/v4/metadata/capital-investment/large-capital-investment-type',
  _capitalInvestmentInvestmentTypes
)
app.get(
  '/v4/metadata/large-capital-opportunity/opportunity-value-type',
  capitalInvestmentValueTypes
)
app.get(
  '/v4/metadata/large-capital-opportunity/opportunity-status',
  capitalInvestmentStatusTypes
)
app.get(
  '/v4/metadata/capital-investment/return-rate',
  _capitalInvestmentMinimumReturnRate
)
app.get(
  '/v4/metadata/capital-investment/time-horizon',
  _capitalInvestmentTimeHorizons
)
app.get(
  '/v4/metadata/capital-investment/restriction',
  _capitalInvestmentRestrictions
)
app.get(
  '/v4/metadata/capital-investment/construction-risk',
  _capitalInvestmentConstructionRisks
)
app.get(
  '/v4/metadata/capital-investment/equity-percentage',
  _capitalInvestmentEquityPercentage
)
app.get(
  '/v4/metadata/capital-investment/desired-deal-role',
  _capitalInvestmentDesiredDealRoles
)
app.get(
  '/v4/metadata/capital-investment/asset-class-interest',
  _capitalInvestmentAssetClassInterest
)
app.get('/v4/metadata/one-list-tier', _oneListTier)
app.get('/v4/metadata/trade-agreement', tradeAgreement)
app.get('/v4/metadata/export-years', exportYears)
app.get('/v4/metadata/export-experience', exportExperience)

// Ping
app.get('/ping.xml', ping)

// V3 Contact
app.get('/v3/contact', contact)
app.post('/v3/contact', contactCreate)
app.get('/v3/contact/:contactId', contactById)
app.patch('/v3/contact/:contactId', updateContactById)
app.post('/v3/contact/:contactId/archive', archiveContact)
app.get('/v3/contact/:contactId/audit', auditHistory)

// V3 Event
app.get('/v3/event/:eventId', eventById)

// V4 Event
app.get('/v4/event/:eventId', _eventById)
app.patch('/v4/event/:eventId', patchEvent)
app.post('/v4/event', createEvent)

// V3 Feature Flag
app.get('/v3/feature-flag', featureFlag)
app.put('/sandbox/feature-flag', setSandboxFlag)
app.post('/sandbox/reset-feature-flag', resetSandboxFlags)

// V3 Interaction
app.get('/v3/interaction', getInteractions)
app.get('/v3/interaction/:interactionId', getInteractionById)
app.post('/v3/interaction', createInteraction)
app.post('/v3/interaction/:interactionId/archive', archiveInteraction)
app.patch('/v3/interaction/:interactionId', archiveInteraction)

// V3 Investment
app.get('/v3/investment', investmentProjects)
app.get('/v3/investment/:id', investmentProjectById)
app.patch('/v3/investment/:id', patchInvestmentProject)
app.get('/v3/investment/:investmentId/audit', investmentProjectAudit)
app.get(
  '/v3/investment/:investmentId/evidence-document',
  investmentProjectEvidence
)
app.get(
  '/v3/investment/:investmentId/evidence-document/:documentId/download',
  documentDownload
)
app.post('/v3/investment', postInvestmentProject)
app.post('/v3/investment/:id/update-stage', investmentProjectById)
app.put('/v3/investment/:id/team-member', postInvestmentProjectEditTeams)

// V3 Omis
app.get('/v3/omis/order/:id', getOrderById)
app.patch('/v3/omis/order/:id', getOrderById)
app.get('/v3/omis/order/:id/assignee', assignees)
app.get('/v3/omis/order/:id/invoice', invoice)
app.get('/v3/omis/order/:id/subscriber-list', subscriberList)
app.put('/v3/omis/order/:id/subscriber-list', subscriberList)
app.get('/v3/omis/order/:id/payment', payments)
app.post('/v3/omis/order/:id/payment', createPayments)
app.get('/v3/omis/order/:id/quote', quote)
app.patch('/v3/omis/order/:id/assignee', assignees)

// V3 Search
app.get('/v3/search', companies)
app.post('/v3/search/company', companies)
app.post('/v3/search/contact', contacts)
app.post('/v3/search/event', events)
app.post('/v3/search/order', order)
app.post('/v3/search/investment_project', _investmentProjects)
app.post('/v3/search/investment_project/export', exportCsv)
app.post('/v4/search/large-investor-profile/export', exportCsv)
app.post('/v4/search/large-capital-opportunity/export', exportCsv)
app.post('/v3/search/interaction', interaction)

// V4 contact - same functionality as v3 in the mock
//just different endpoints since on the real API the only difference is validation
app.get('/v4/contact', contact)
app.post('/v4/contact', contactCreate)
app.get('/v4/contact/:contactId', contactById)
app.patch('/v4/contact/:contactId', updateContactById)

// V4 activity feed
app.get('/v4/activity-feed', activityFeed)

// V4 CH Company
app.get('/v4/ch-company/:companyId', company)

// V4 Company
app.get('/v4/company/:companyId', _company)
app.patch('/v4/company/:companyId', companyPatched)
app.post('/v4/company', _company)
app.get('/v4/company', _companies)
app.post('/v4/company/:companyId/:action-account-manager', manageAdviser)
app.get('/v4/company/:companyId/audit', companyAudit)
app.get('/v4/company/:companyId/export-win', exportWins)
app.patch('/v4/company/:companyId/export-detail', exportDetail)
app.get(
  '/v4/company/:companyId/one-list-group-core-team',
  getOneListGroupCoreTeam
)
app.post(
  '/v4/company/:companyId/assign-one-list-tier-and-global-account-manager',
  postOneListTierAndGlobalAccountManager
)
app.post('/v4/company/:companyId/remove-from-one-list', postRemoveFromOneList)
app.patch(
  '/v4/company/:companyId/update-one-list-core-team',
  patchOneListCoreTeam
)
app.get('/v4/company/:companyId/objective', objectives)
app.get('/v4/company/:companyId/objective/count', objectivesCount)

// V4 interactions
app.get('/v4/interaction', _getInteractions)
app.get('/v4/interaction/:interactionId', _getInteractionById)
app.post('/v4/interaction', _createInteraction)
app.post('/v4/interaction/:interactionId/archive', _archiveInteraction)
app.patch('/v4/interaction/:interactionId', _archiveInteraction)

// V4 DnB
app.post('/v4/dnb/company-create', companyCreate)
app.post('/v4/dnb/company-investigation', companyInvestigation)
app.post('/v4/dnb/company-search', companySearch)
app.post('/v4/dnb/company-link', companyLink)
app.post('/v4/dnb/company-change-request', companyChangeRequest)
app.get('/v4/dnb/company-change-request', companyChangeRequest)
app.get('/v4/dnb/:companyId/family-tree', companyFamilyTree)
app.get('/v4/dnb/:companyId/related-companies/count', relatedCompaniesCount)
app.get('/v4/dnb/:companyId/related-companies', relatedCompanies)

// V4 legacy company list
app.get('/v4/user/company-list/:companyId', getCompanyList)
app.get('/v4/user/company-list', getCompanyList)

// V4 new company list endpoints (with multiple list support)
app.get('/v4/company-list', getCompanyLists)
app.get('/v4/company-list/:listId', _getCompanyList)
app.get('/v4/company-list/:listId/item', getCompanyListItems)
app.post('/v4/company-list', createCompanyList)
app.delete('/v4/company-list/:listId', deleteCompanyList)
app.patch('/v4/company-list/:listId', editCompanyList)
app.put('/v4/company-list/:listId/item/:companyId', addCompanyToList)
app.delete('/v4/company-list/:listId/item/:companyId', removeCompanyFromList)

// V4 Reminders

// Summary
app.get('/v4/reminder/subscription/summary', getReminderSubscriptionsSummary)

// Subscriptions for Investments
app.get(
  '/v4/reminder/subscription/estimated-land-date',
  getEstimatedLandDateSubscriptions
)

app.patch(
  '/v4/reminder/subscription/estimated-land-date',
  saveEstimatedLandDateSubscriptions
)

app.get(
  '/v4/reminder/subscription/no-recent-investment-interaction',
  getNoRecentInteractionsSubscriptions
)

app.patch(
  '/v4/reminder/subscription/no-recent-investment-interaction',
  saveNoRecentInteractionsSubscriptions
)

// Subscriptions for Exports
app.get(
  '/v4/reminder/subscription/no-recent-export-interaction',
  getNoRecentExportInteractionsSubscriptions
)

app.patch(
  '/v4/reminder/subscription/no-recent-export-interaction',
  saveNoRecentExportInteractionsSubscriptions
)

app.get(
  '/v4/reminder/subscription/new-export-interaction',
  getNewExportInteractionsSubscriptions
)

app.patch(
  '/v4/reminder/subscription/new-export-interaction',
  saveNewExportInteractionsSubscriptions
)

// Reminders lists

app.get('/v4/reminder/estimated-land-date', getEstimatedLandDateReminders)
app.get(
  '/v4/reminder/no-recent-export-interaction',
  getNoRecentExportInteractionReminders
)
app.get(
  '/v4/reminder/no-recent-investment-interaction',
  getNoRecentInvestmentInteractionReminders
)

app.get('/v4/reminder/new-export-interaction', getNewExportInteractionReminders)

// V4 Investment
app.get('/v4/large-investor-profile', largeInvestorProfile)
app.patch('/v4/large-investor-profile/:profileId', largeInvestorProfilePatched)
app.post('/v4/large-investor-profile', largeInvestorProfilePostCreate)
app.get(
  '/v4/large-capital-opportunity/:opportunityId',
  getLargeCapitalOpportunity
)
app.patch(
  '/v4/large-capital-opportunity/:opportunityId',
  saveOpportunityDetails
)
app.get('/v4/large-capital-opportunity', getLargeCapitalOpportunityList)
app.post('/v4/search/large-capital-opportunity', getLargeCapitalOpportunityList)

// V4 Proposition
app.get('/v4/proposition', propositions)

// V4 Reminder
app.get('/v4/reminder/summary', summary)

// V4 Search
app.post('/v4/search/company', __companies)
app.post('/v4/search/large-investor-profile', _largeInvestorProfile)
app.get('/v4/search/company/autocomplete', companiesAutocomplete)
app.post('/v4/search/export-country-history', fetchExportHistory)
app.post('/v4/search/adviser', _advisers)

// V4 Tasks
app.get('/v4/task', getTasks)
app.get('/v4/task/:taskId', getTask)
app.post('/v4/task', createTask)
app.patch('/v4/task/:taskId', updateTask)
app.get('/v4/investmentprojecttask', investmentProjectTasks)

// Whoami endpoint
app.get('/whoami', whoami)
app.put('/whoami', setWhoami)
app.post('/whoami', resetWhoami)

// Zendesk tickets endpoint
app.post('/zendesk/tickets', tickets)

app.post('/api/v1/person', person)
app.get('/api/v1/person/bulk_lookup', bulkPerson)

app.post('/companies/search', companiesSearch)

app.post('/v4/large-capital-opportunity', (req, res) =>
  res.json({ id: 'new-large-capital-uk-opportunity-id' })
)

app.use((req, res) =>
  res.status(404).json({ message: 'Route' + req.url + ' Not found.' })
)

app.use((error, req, res) =>
  res.status(500).json({ message: error.toString() })
)

const server = app.listen(config.PORT, () => {
  const port = server.address().port
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`)
})
