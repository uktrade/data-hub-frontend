import express from 'express'
import bodyParser from 'body-parser'

import _ from 'lodash'

const config = {
  PORT: process.env.SANDBOX_PORT || 8000,
}

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// TODO: Remove these legacy Sandbox vars after all the mocks are refactored
global.state = {}
global._ = _

import { advisers, adviser } from './routes/adviser.js'
import { dashboardHomepage } from './routes/dashboard.js'
import { ping } from './routes/ping.js'

// TODO: `/metadata/*` endpoints are deprecated and should be removed or on after 17th October 2019
import {
  getLikelihoodToLand,
  getExportExperienceCategory,
  getInvestmentInvestorType,
  getInvestmentInvolvement,
  getInvestmentSpecificProgramme,
  getInvestmentProjectStage,
  getInvestmentBusinessActivity,
  getInvestmentType,
  getInvestmentStrategicDriver,
  getOrderServiceType,
  getOrderCancellationReason,
  getOmisMarket,
  getSalaryRange,
  getFdiValue,
  getFdiType,
  getTurnover,
  getSector,
  getLocationType,
  getEventType,
  getProgramme,
  getBusinessType,
  getEvidenceTag,
  getEmployeeRange,
  getCountry,
  getUkRegion,
  getReferralSourceWebsite,
  getReferralSourceMarketing,
  getReferralSourceActivity,
  getHeadquarterType,
  getService,
  getCommunicationChannel,
  getTeam,
  getPolicyArea,
  getPolicyIssueType,
  getServiceDeliveryStatus,
  getCapitalInvestmentInvestorType,
  getCapitalInvestmentRequiredChecks,
  getCapitalInvestmentDealTicketSize,
  getCapitalInvestmentInvestmentTypes,
  getCapitalInvestmentMinimumReturnRate,
  getCapitalInvestmentTimeHorizons,
  getCapitalInvestmentRestrictions,
  getCapitalInvestmentConstructionRisks,
  getCapitalInvestmentEquityPercentage,
  getCapitalInvestmentDesiredDealRoles,
  getCapitalInvestmentAssetClassInterest,
  getOneListTier,
} from './routes/metadata.js'
import { getWhoami, setWhoami, resetWhoami } from './routes/whoami.js'
import { tickets } from './routes/zendesk.js'
import { lookup } from './routes/postcode.js'

// V3
import {
  getContact,
  contactCreate,
  getContactById,
  updateContactById,
  archiveContact,
  getAuditHistory,
} from './routes/v3/contact/contact.js'
import { getEventById } from './routes/v3/event/event.js'
import {
  getOrderById,
  getAssignees,
  getInvoice,
  subscriberList,
  getPayments,
  createPayments,
  getQuote,
  getQuotePreview,
  createQuote,
  cancelQuote,
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
  investmentProjectEvidenceUpload,
  investmentProjectEvidenceUploadCallback,
  deleteInvestmentProjectEvidence,
} from './routes/v3/investment/investment-projects.js'
import {
  getProposition,
  getPropositionEvidence,
  propositionEvidenceUploadCallback,
  deletePropositionEvidence,
  propositionEvidenceUpload,
} from './routes/v3/investment/proposition.js'
import { getCompanies } from './routes/v3/search/company.js'
import { contacts } from './routes/v3/search/contact.js'
import { searchEvents } from './routes/v3/search/event.js'
import {
  searchInvestmentProjects as _investmentProjects,
  exportCsv,
} from './routes/v3/search/investment-project.js'

import { order } from './routes/v3/search/order.js'
import { searchInteraction } from './routes/v3/search/interaction.js'

// V4
import { searchCompanyActivities } from './routes/v4/search/company-activity/activity.js'
import { company } from './routes/v4/ch-company/company.js'
import {
  getReferralDetails,
  getCompany as _company,
  companyPatched,
  companies as _companies,
  manageAdviser,
  getCompanyAudit,
  getExportWins,
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
  createDnbCompany,
  dnbCompanyInvestigation,
  dnbCompanySearch,
  dnbCompanyLink,
  dnbCompanyChangeRequest,
  companyFamilyTree,
  relatedCompaniesCount,
  relatedCompanies,
} from './routes/v4/dnb/index.js'
import {
  getEventById as _eventById,
  patchEvent,
  createEvent,
} from './routes/v4/event/event.js'

import {
  getLargeCapitalOpportunity,
  saveOpportunityDetails,
  getLargeCapitalOpportunityList,
  getEYBLead,
} from './routes/v4/investment/investment.js'
import {
  getInteractions as _getInteractions,
  getInteractionById as _getInteractionById,
  createInteraction as _createInteraction,
  archiveInteraction as _archiveInteraction,
} from './routes/v4/interaction/interaction.js'
import {
  getLikelihoodToLand as _likelihoodToLand,
  getExportExperienceCategory as _exportExperienceCategory,
  getInvestmentInvestorType as _investmentInvestorType,
  getInvestmentInvolvement as _investmentInvolvement,
  getInvestmentSpecificProgramme as _investmentSpecificProgramme,
  getInvestmentProjectStage as _investmentProjectStage,
  getInvestmentBusinessActivity as _investmentBusinessActivity,
  getInvestmentType as _investmentType,
  getInvestmentStrategicDriver as _investmentStrategicDriver,
  getInvestmentDeliveryPartner,
  getOrderServiceType as _orderServiceType,
  getOrderCancellationReason as _orderCancellationReason,
  getOmisMarket as _omisMarket,
  getSalaryRange as _salaryRange,
  getFdiValue as _fdiValue,
  getFdiType as _fdiType,
  getTurnover as _turnover,
  getSector as _sector,
  getLocationType as _locationType,
  getEventType as _eventType,
  getProgramme as _programme,
  getBusinessType as _businessType,
  getBusinessPotential as _businessPotential,
  getEvidenceTag as _evidenceTag,
  getEmployeeRange as _employeeRange,
  getCountry as _country,
  getUkRegion as _ukRegion,
  getAdministrativeArea,
  getReferralSourceWebsite as _referralSourceWebsite,
  getReferralSourceMarketing as _referralSourceMarketing,
  getReferralSourceActivity as _referralSourceActivity,
  getHeadquarterType as _headquarterType,
  getService as _service,
  getCommunicationChannel as _communicationChannel,
  getTeam as _team,
  getTeamType as _teamType,
  getPolicyArea as _policyArea,
  getPolicyIssueType as _policyIssueType,
  getExportBarrier,
  getServiceDeliveryStatus as _serviceDeliveryStatus,
  getCapitalInvestmentInvestorType as _capitalInvestmentInvestorType,
  getCapitalInvestmentRequiredChecks as _capitalInvestmentRequiredChecks,
  getCapitalInvestmentDealTicketSize as _capitalInvestmentDealTicketSize,
  getCapitalInvestmentInvestmentTypes as _capitalInvestmentInvestmentTypes,
  getCapitalInvestmentValueTypes,
  getCapitalInvestmentStatusTypes,
  getCapitalInvestmentMinimumReturnRate as _capitalInvestmentMinimumReturnRate,
  getCapitalInvestmentTimeHorizons as _capitalInvestmentTimeHorizons,
  getCapitalInvestmentRestrictions as _capitalInvestmentRestrictions,
  getCapitalInvestmentConstructionRisks as _capitalInvestmentConstructionRisks,
  getCapitalInvestmentEquityPercentage as _capitalInvestmentEquityPercentage,
  getCapitalInvestmentDesiredDealRoles as _capitalInvestmentDesiredDealRoles,
  getCapitalInvestmentAssetClassInterest as _capitalInvestmentAssetClassInterest,
  getOneListTier as _oneListTier,
  getTradeAgreement,
  getExportYears,
  getExportExperience,
  getExperience,
  getRating,
  getMarketingSource,
  getWithoutOurSupport,
  getSupportType,
  getHVC,
  getAssociatedProgramme,
  getHqTeamRegionOrPost,
} from './routes/v4/metadata/index.js'
import { searchCompanies as __companies } from './routes/v4/search/company.js'
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
  getSubscriptions,
  saveSubscriptions,
  deleteReminder,
} from './routes/v4/reminders/index.js'
import { getSummary, myTasks } from './routes/v4/reminder/reminder.js'
import { searchAdvisers as _advisers } from './routes/v4/search/adviser.js'
import { objectives, objectivesCount } from './routes/v4/objective/index.js'
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  getTaskCompaniesAndProjects,
} from './routes/v4/task/index.js'

// Datahub API 3rd party dependencies
import { person, bulkPerson } from './routes/api/consentService.js'

import { createCompaniesSearch } from './routes/api/dnbService.js'
import { tasks } from './routes/v4/search/tasks.js'
import {
  getExportWin,
  getExportWinCollection,
  getExportWinReview,
  patchExportWinReview,
} from './routes/v4/export-win/export-win.js'

// getaddress.io mock
app.get('/sandbox/postcodelookup/', lookup)

// Referral details
app.get('/v4/company-referral/:id', getReferralDetails)
// Send a referral
app.post('/v4/company-referral', getReferralDetails)

// Complete referral
app.post('/v4/company-referral/:id/complete', createInteraction)
app.get('/v4/company-referral', v4referralList)

// Adviser endpoint
app.get('/adviser/', advisers)
app.get('/adviser/:id/', adviser)

// Dashboard endpoint
app.get('/dashboard/homepage/', dashboardHomepage)

// Metadata endpoint
// TODO: Metadata `/metadata/*` endpoints are deprecated and should be removed on or after 17th October 2019
app.get('/metadata/likelihood-to-land/', getLikelihoodToLand)
app.get('/metadata/export-experience-category/', getExportExperienceCategory)
app.get('/metadata/investment-investor-type/', getInvestmentInvestorType)
app.get('/metadata/investment-involvement/', getInvestmentInvolvement)
app.get(
  '/metadata/investment-specific-programme/',
  getInvestmentSpecificProgramme
)
app.get('/metadata/investment-project-stage/', getInvestmentProjectStage)
app.get(
  '/metadata/investment-business-activity/',
  getInvestmentBusinessActivity
)
app.get('/metadata/investment-type/', getInvestmentType)
app.get('/metadata/investment-strategic-driver/', getInvestmentStrategicDriver)
app.get('/metadata/order-service-type/', getOrderServiceType)
app.get('/metadata/order-cancellation-reason/', getOrderCancellationReason)
app.get('/metadata/omis-market/', getOmisMarket)
app.get('/metadata/salary-range/', getSalaryRange)
app.get('/metadata/fdi-value/', getFdiValue)
app.get('/metadata/fdi-type/', getFdiType)
app.get('/metadata/turnover/', getTurnover)
app.get('/metadata/sector/', getSector)
app.get('/metadata/location-type/', getLocationType)
app.get('/metadata/event-type/', getEventType)
app.get('/metadata/programme/', getProgramme)
app.get('/metadata/business-type/', getBusinessType)
app.get('/metadata/evidence-tag/', getEvidenceTag)
app.get('/metadata/employee-range/', getEmployeeRange)
app.get('/metadata/country/', getCountry)
app.get('/metadata/uk-region/', getUkRegion)
app.get('/metadata/referral-source-website/', getReferralSourceWebsite)
app.get('/metadata/referral-source-marketing/', getReferralSourceMarketing)
app.get('/metadata/referral-source-activity/', getReferralSourceActivity)
app.get('/metadata/headquarter-type/', getHeadquarterType)
app.get('/metadata/service/', getService)
app.get('/metadata/communication-channel/', getCommunicationChannel)
app.get('/metadata/team/', getTeam)
app.get('/metadata/policy-area/', getPolicyArea)
app.get('/metadata/policy-issue-type/', getPolicyIssueType)
app.get('/metadata/service-delivery-status/', getServiceDeliveryStatus)
app.get(
  '/metadata/capital-investment/investor-type/',
  getCapitalInvestmentInvestorType
)
app.get(
  '/metadata/capital-investment/required-checks-conducted/',
  getCapitalInvestmentRequiredChecks
)
app.get(
  '/metadata/capital-investment/deal-ticket-size/',
  getCapitalInvestmentDealTicketSize
)
app.get(
  '/metadata/capital-investment/large-capital-investment-type/',
  getCapitalInvestmentInvestmentTypes
)
app.get(
  '/metadata/capital-investment/return-rate/',
  getCapitalInvestmentMinimumReturnRate
)
app.get(
  '/metadata/capital-investment/time-horizon/',
  getCapitalInvestmentTimeHorizons
)
app.get(
  '/metadata/capital-investment/restriction/',
  getCapitalInvestmentRestrictions
)
app.get(
  '/metadata/capital-investment/construction-risk/',
  getCapitalInvestmentConstructionRisks
)
app.get(
  '/metadata/capital-investment/equity-percentage/',
  getCapitalInvestmentEquityPercentage
)
app.get(
  '/metadata/capital-investment/desired-deal-role/',
  getCapitalInvestmentDesiredDealRoles
)
app.get(
  '/metadata/capital-investment/asset-class-interest/',
  getCapitalInvestmentAssetClassInterest
)
app.get('/metadata/one-list-tier/', getOneListTier)

// V4 Metadata endpoints
app.get('/v4/metadata/team-type/', _teamType)
app.get('/v4/metadata/business-potential/', _businessPotential)
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
app.get(
  '/v4/metadata/investment-delivery-partner',
  getInvestmentDeliveryPartner
)
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
app.get('/v4/metadata/winukregion', _ukRegion)
app.get('/v4/metadata/administrative-area', getAdministrativeArea)
app.get('/v4/metadata/referral-source-website', _referralSourceWebsite)
app.get('/v4/metadata/referral-source-marketing', _referralSourceMarketing)
app.get('/v4/metadata/referral-source-activity', _referralSourceActivity)
app.get('/v4/metadata/headquarter-type', _headquarterType)
app.get('/v4/metadata/service', _service)
app.get('/v4/metadata/communication-channel', _communicationChannel)
app.get('/v4/metadata/team', _team)
app.get('/v4/metadata/policy-area', _policyArea)
app.get('/v4/metadata/policy-issue-type', _policyIssueType)
app.get('/v4/metadata/export-barrier', getExportBarrier)
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
  getCapitalInvestmentValueTypes
)
app.get(
  '/v4/metadata/large-capital-opportunity/opportunity-status',
  getCapitalInvestmentStatusTypes
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
app.get('/v4/metadata/trade-agreement', getTradeAgreement)
app.get('/v4/metadata/export-years', getExportYears)
app.get('/v4/metadata/export-experience', getExportExperience)

app.get('/v4/metadata/experience', getExperience)
app.get('/v4/metadata/rating', getRating)
app.get('/v4/metadata/marketing-source', getMarketingSource)
app.get('/v4/metadata/without-our-support', getWithoutOurSupport)

app.get('/v4/metadata/support-type', getSupportType)
app.get('/v4/metadata/hvc', getHVC)
app.get('/v4/metadata/associated-programme', getAssociatedProgramme)
app.get('/v4/metadata/hq-team-region-or-post', getHqTeamRegionOrPost)

// Ping
app.get('/ping.xml', ping)

// V3 Contact
app.get('/v3/contact', getContact)
app.post('/v3/contact', contactCreate)
app.get('/v3/contact/:contactId', getContactById)
app.patch('/v3/contact/:contactId', updateContactById)
app.post('/v3/contact/:contactId/archive', archiveContact)
app.get('/v3/contact/:contactId/audit', getAuditHistory)

// V3 Event
app.get('/v3/event/:eventId', getEventById)

// V4 Event
app.get('/v4/event/:eventId', _eventById)
app.patch('/v4/event/:eventId', patchEvent)
app.post('/v4/event', createEvent)

// V4 Export Win
app.get('/v4/export-win', getExportWinCollection)
app.get('/v4/export-win/:exportWinId', getExportWin)
app.get('/v4/export-win/review/:token', getExportWinReview)
app.patch('/v4/export-win/review/:token', patchExportWinReview)

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
app.post(
  '/v3/investment/:id/evidence-document',
  investmentProjectEvidenceUpload
)
app.post(
  '/v3/investment/:id/evidence-document/:documentId/upload-callback',
  investmentProjectEvidenceUploadCallback
)
app.delete(
  '/v3/investment/:id/evidence-document/:documentId',
  deleteInvestmentProjectEvidence
)
app.get(
  '/v3/investment/:investmentId/evidence-document/:documentId/download',
  documentDownload
)
app.post('/v3/investment', postInvestmentProject)
app.post('/v3/investment/:id/update-stage', investmentProjectById)
app.put('/v3/investment/:id/team-member', postInvestmentProjectEditTeams)
app.get('/v3/investment/:id/proposition/:propositionId', getProposition)
app.get(
  '/v3/investment/:id/proposition/:propositionId/document',
  getPropositionEvidence
)
app.post(
  '/v3/investment/:id/proposition/:propositionId/document',
  propositionEvidenceUpload
)
app.post(
  '/v3/investment/:id/proposition/:propositionId/document/:documentId/upload-callback',
  propositionEvidenceUploadCallback
)
app.delete(
  '/v3/investment/:id/proposition/:propositionId/document/:documentId',
  deletePropositionEvidence
)

// V3 Omis
app.get('/v3/omis/order/:id', getOrderById)
app.patch('/v3/omis/order/:id', getOrderById)
app.get('/v3/omis/order/:id/assignee', getAssignees)
app.get('/v3/omis/order/:id/invoice', getInvoice)
app.get('/v3/omis/order/:id/subscriber-list', subscriberList)
app.put('/v3/omis/order/:id/subscriber-list', subscriberList)
app.get('/v3/omis/order/:id/payment', getPayments)
app.post('/v3/omis/order/:id/payment', createPayments)
app.get('/v3/omis/order/:id/quote', getQuote)
app.post('/v3/omis/order/:id/quote', createQuote)
app.post('/v3/omis/order/:id/quote/preview', getQuotePreview)
app.post('/v3/omis/order/:id/quote/cancel', cancelQuote)
app.patch('/v3/omis/order/:id/assignee', getAssignees)
app.post('/v3/omis/order/:id/cancel', getOrderById)
app.post('/v3/omis/order/:id/complete', getOrderById)
app.post('/v3/omis/order', getOrderById)

// V3 Search
app.get('/v3/search', getCompanies)
app.post('/v3/search/company', getCompanies)
app.post('/v3/search/contact', contacts)
app.post('/v3/search/event', searchEvents)
app.post('/v3/search/order', order)
app.post('/v3/search/investment_project', _investmentProjects)
app.post('/v3/search/investment_project/export', exportCsv)
app.post('/v4/search/large-investor-profile/export', exportCsv)
app.post('/v4/search/large-capital-opportunity/export', exportCsv)
app.post('/v3/search/interaction', searchInteraction)

// V4 contact - same functionality as v3 in the mock
//just different endpoints since on the real API the only difference is validation
app.get('/v4/contact', getContact)
app.post('/v4/contact', contactCreate)
app.get('/v4/contact/:contactId', getContactById)
app.patch('/v4/contact/:contactId', updateContactById)

// V4 CH Company
app.get('/v4/ch-company/:companyId', company)

// V4 Company
app.get('/v4/company/:companyId', _company)
app.patch('/v4/company/:companyId', companyPatched)
app.post('/v4/company', _company)
app.get('/v4/company', _companies)
app.post('/v4/company/:companyId/:action-account-manager', manageAdviser)
app.get('/v4/company/:companyId/audit', getCompanyAudit)
app.get('/v4/company/:companyId/export-win', getExportWins)
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
app.post('/v4/dnb/company-create', createDnbCompany)
app.post('/v4/dnb/company-investigation', dnbCompanyInvestigation)
app.post('/v4/dnb/company-search', dnbCompanySearch)
app.post('/v4/dnb/company-link', dnbCompanyLink)
app.post('/v4/dnb/company-change-request', dnbCompanyChangeRequest)
app.get('/v4/dnb/company-change-request', dnbCompanyChangeRequest)
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

// Subscriptions for My Tasks
app.get(
  '/v4/reminder/subscription/my-tasks-due-date-approaching',
  getSubscriptions
)

app.patch(
  '/v4/reminder/subscription/my-tasks-due-date-approaching',
  saveSubscriptions
)

app.get(
  '/v4/reminder/subscription/my-tasks-task-assigned-to-me-from-others',
  getSubscriptions
)

app.patch(
  '/v4/reminder/subscription/my-tasks-task-assigned-to-me-from-others',
  saveSubscriptions
)

app.get(
  '/v4/reminder/subscription/my-tasks-task-amended-by-others',
  getSubscriptions
)

app.patch(
  '/v4/reminder/subscription/my-tasks-task-amended-by-others',
  saveSubscriptions
)

app.get('/v4/reminder/subscription/my-tasks-task-overdue', getSubscriptions)

app.patch('/v4/reminder/subscription/my-tasks-task-overdue', saveSubscriptions)

app.get('/v4/reminder/subscription/my-tasks-task-completed', getSubscriptions)

app.patch(
  '/v4/reminder/subscription/my-tasks-task-completed',
  saveSubscriptions
)

// Reminders lists

app.get('/v4/reminder/estimated-land-date', getEstimatedLandDateReminders)
app.delete('/v4/reminder/estimated-land-date/:id', deleteReminder)

app.get(
  '/v4/reminder/no-recent-export-interaction',
  getNoRecentExportInteractionReminders
)
app.delete('/v4/reminder/no-recent-export-interaction/:id', deleteReminder)

app.get(
  '/v4/reminder/no-recent-investment-interaction',
  getNoRecentInvestmentInteractionReminders
)
app.delete('/v4/reminder/no-recent-investment-interaction/:id', deleteReminder)

app.get('/v4/reminder/new-export-interaction', getNewExportInteractionReminders)
app.delete('/v4/reminder/new-export-interaction/:id', deleteReminder)

app.get('/v4/reminder/my-tasks-due-date-approaching', myTasks)

app.delete('/v4/reminder/my-tasks-due-date-approaching/:id', deleteReminder)

app.get('/v4/reminder/my-tasks-task-assigned-to-me-from-others', myTasks)

app.delete(
  '/v4/reminder/my-tasks-task-assigned-to-me-from-others/:id',
  deleteReminder
)

app.get('/v4/reminder/my-tasks-task-amended-by-others', myTasks)

app.delete('/v4/reminder/my-tasks-task-amended-by-others/:id', deleteReminder)

app.get('/v4/reminder/my-tasks-task-overdue', myTasks)

app.delete('/v4/reminder/my-tasks-task-overdue/:id', deleteReminder)

app.get('/v4/reminder/my-tasks-task-completed', myTasks)

app.delete('/v4/reminder/my-tasks-task-completed/:id', deleteReminder)

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
app.get('/v4/investment-lead/eyb/:eybLeadId', getEYBLead)

// V4 Proposition
app.get('/v4/proposition', propositions)
app.get('/v4/project')

// V4 Reminder
app.get('/v4/reminder/summary', getSummary)

// V4 Search
app.post('/v4/search/company', __companies)
app.post('/v4/search/company-activity', searchCompanyActivities)
app.post('/v4/search/large-investor-profile', _largeInvestorProfile)
app.get('/v4/search/company/autocomplete', companiesAutocomplete)
app.post('/v4/search/export-country-history', fetchExportHistory)
app.post('/v4/search/adviser', _advisers)
app.post('/v4/search/task', tasks)

// V4 Tasks
app.get('/v4/task', getTasks)
app.get('/v4/task/companies-and-projects', getTaskCompaniesAndProjects)
app.get('/v4/task/:taskId', getTask)
app.post('/v4/task', createTask)
app.patch('/v4/task/:taskId', updateTask)

app.get('/v4/export', (req, res) => res.json({ count: 0, results: [] }))
app.get('/v4/export/owner', (req, res) =>
  res.json([
    {
      id: 'foobarbaz',
      name: 'John Doe',
    },
    {
      id: 'foobarbaz',
      name: 'Jane Doe',
    },
  ])
)

// Whoami endpoint
app.get('/whoami', getWhoami)
app.put('/whoami', setWhoami)
app.post('/whoami', resetWhoami)

// Zendesk tickets endpoint
app.post('/zendesk/tickets', tickets)

app.post('/api/v1/person', person)
app.get('/api/v1/person/bulk_lookup', bulkPerson)

app.post('/companies/search', createCompaniesSearch)

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
