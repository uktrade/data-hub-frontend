import React from 'react'
import ReactDOM from 'react-dom'
import { Switch } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import * as ReactSentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { ErrorBoundary } from 'react-error-boundary'

import './components'
import { SearchLocalHeader } from './components'
import { default as DataHubHeaderWrapper } from './components/DataHubHeader/Wrapper'
import Provider from './provider'
import AddCompanyForm from '../apps/companies/apps/add-company/client/AddCompanyForm'
import InteractionDetailsForm from '../apps/interactions/apps/details-form/client/InteractionDetailsForm'
import CompanyActivityCollection from './components/ActivityFeed/CollectionList'
import EditCompanyForm from '../apps/companies/apps/edit-company/client/EditCompanyForm'
import CompanyEditHistory from '../apps/companies/apps/edit-history/client/CompanyEditHistory'
import FindCompany from '../apps/companies/apps/match-company/client/FindCompany'
import DeleteCompanyList from '../apps/company-lists/client/DeleteCompanyList'
import MatchConfirmation from '../apps/companies/apps/match-company/client/MatchConfirmation'
import CannotFindMatch from '../apps/companies/apps/match-company/client/CannotFindMatch'
import EditCompanyList from '../apps/company-lists/client/EditCompanyList'
import CreateListForm from '../apps/company-lists/client/CreateListForm'
import LeadAdvisers from '../apps/companies/apps/advisers/client/LeadAdvisers'
import LargeCapitalProfileCollection from '../apps/investments/client/profiles/LargeCapitalProfileCollection'
import UnfilteredLargeCapitalOpportunityCollection from '../apps/investments/client/opportunities/List/UnfilteredLargeCapitalOpportunityCollection'
import InvestmentEditHistory from '../apps/investments/client/InvestmentEditHistory'
import ManageAdviser from '../apps/companies/apps/advisers/client/ManageAdviser'
import CompanyBusinessDetails from '../apps/companies/apps/business-details/client/CompanyBusinessDetails'
import CompanyOverview from '../apps/companies/apps/company-overview/client/CompanyOverview'
import EditOneListForm from '../apps/companies/apps/edit-one-list/client/EditOneListForm'
import ExportsIndex from '../apps/companies/apps/exports/client/ExportsIndex'
import ExportsHistory from '../apps/companies/apps/exports/client/ExportsHistory/'
import ExportsEdit from './modules/Companies/CompanyExports/ExportsEdit'
import ExportCountriesEdit from './modules/Companies/CompanyExports/ExportCountriesEdit/'
import ReferralDetails from '../apps/companies/apps/referrals/details/client/ReferralDetails'
import ReferralHelp from '../apps/companies/apps/referrals/help/client/ReferralHelp'
import SendReferralForm from '../apps/companies/apps/referrals/send-referral/client/SendReferralForm'
import InteractionReferralDetails from './modules/Interactions/InteractionDetails/InteractionReferralDetails.jsx'
import InvestmentProjectAdmin from '../apps/investments/views/admin/client/InvestmentProjectAdmin.jsx'
import FlashMessages from './components/LocalHeader/FlashMessages.jsx'
import PersonalisedDashboard from './components/PersonalisedDashboard'
import CompanyOrdersCollection from '../client/modules/Omis/CollectionList/CompanyOrdersCollection'
import InvestmentProjectsCollection from '../apps/investments/client/projects/ProjectsCollection.jsx'
import InvestmentProjectForm from '../apps/investments/client/projects/create/InvestmentProjectForm'
import Opportunity from '../apps/investments/client/opportunities/Details/Opportunity'
import CompaniesContactsCollection from '../client/modules/Contacts/CollectionList/CompanyContactsCollection.jsx'
import OpportunityChangeStatusForm from '../apps/investments/client/opportunities/Details/OpportunityChangeStatusForm.jsx'
import CreateUKInvestmentOpportunity from '../apps/investments/client/opportunities/Details/CreateUKInvestmentOpportunity'
import EditAssignees from '../apps/omis/apps/edit/client/EditAssignees'
import EditSubscribers from '../apps/omis/apps/edit/client/EditSubscribers'
import EditProjectManagement from '../apps/investments/client/projects/team/EditProjectManagement'
import { EditTeamMembers } from '../apps/investments/client/projects/team/EditTeamMembers'
import EditClientRelationshipManagement from '../apps/investments/client/projects/team/EditClientRelationshipManagement'
import ContactActivity from './modules/Contacts/ContactActivity/ContactActivity'
import ContactLocalHeader from './components/ContactLocalHeader'
import ContactDetails from './modules/Contacts/ContactDetails/ContactDetails'
import ContactDocuments from './modules/Contacts/ContactDocuments/ContactDocuments'
import InvestmentDocuments from '../apps/investments/client/projects/ProjectDocuments'
import ContactAuditHistory from './modules/Contacts/ContactAuditHistory/ContactAuditHistory'
import InteractionDetails from './modules/Interactions/InteractionDetails'
import ESSInteractionDetails from './modules/Interactions/ESSInteractionDetails'
import OrdersReconciliationCollection from './modules/Omis/CollectionList/OrdersReconciliationCollection'
import AttendeeSearch from './modules/Events/AttendeeSearch/AttendeeSearch'
import CoreTeam from './modules/Companies/CoreTeam/CoreTeam'
import LargeCapitalProfile from './modules/Companies/CompanyInvestments/LargeCapitalProfile'
import CreateProposition from './modules/Investments/Projects/Propositions/CreateProposition'
import AbandonProposition from './modules/Investments/Projects/Propositions/AbandonProposition'
import PropositionDetails from './modules/Investments/Projects/Propositions/PropositionDetails'
import CompanyHierarchy from './modules/Companies/CompanyHierarchy'
import CompanyProjectsCollection from './modules/Companies/CompanyInvestments/CompanyProjectsCollection'
import LinkGlobalHQ from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/LinkGlobalHQ'
import LinkSubsidiary from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary'
import EditProjectSummary from './modules/Investments/Projects/EditProjectSummary'

import * as companyListsTasks from './components/CompanyLists/tasks'
import * as referralTasks from '../apps/companies/apps/referrals/details/client/tasks'
import * as exportsHistoryTasks from '../apps/companies/apps/exports/client/ExportsHistory/tasks'
import referralListTask from './components/ReferralList/tasks'
import { TASK_SAVE_REFERRAL } from '../apps/companies/apps/referrals/send-referral/client/state'
import * as referralsSendTasks from '../apps/companies/apps/referrals/send-referral/client/tasks'
import * as exportWinsTasks from '../apps/companies/apps/exports/client/ExportWins/tasks'
import { TASK_NAME as EXPORT_COUNTRIES_EDIT_NAME } from './modules/Companies/CompanyExports/ExportCountriesEdit/state'
import * as exportCountriesEditTasks from './modules/Companies/CompanyExports/ExportCountriesEdit/tasks'
import addCompanyPostcodeToRegionTask, {
  createCompany,
} from '../apps/companies/apps/add-company/client/tasks'
import { TASK_SAVE_ONE_LIST_DETAILS } from '../apps/companies/apps/edit-one-list/client/state'
import * as editOneListTasks from '../apps/companies/apps/edit-one-list/client/tasks'
import { TASK_UPDATE_STAGE } from '../apps/investments/views/admin/client/state'
import * as investmentAdminTasks from '../apps/investments/views/admin/client/tasks'
import { TASK_POSTCODE_TO_REGION } from '../apps/companies/apps/add-company/client/state'
import {
  TASK_GET_ACTIVE_EVENTS,
  TASK_SAVE_INTERACTION,
  TASK_GET_INTERACTION_INITIAL_VALUES,
} from '../apps/interactions/apps/details-form/client/state'
import * as addInteractionFormTasks from '../apps/interactions/apps/details-form/client/tasks'

import * as manageAdviser from '../apps/companies/apps/advisers/client/tasks'

import {
  DNB__CHECK_PENDING_REQUEST,
  TASK_ARCHIVE_COMPANY,
} from '../apps/companies/apps/business-details/client/state'
import * as businessDetails from '../apps/companies/apps/business-details/client/tasks'

import {
  TASK_GET_COMPANIES_LIST,
  TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME,
  TASK_GET_COMPANIES_METADATA,
} from './modules/Companies/CollectionList/state'
import {
  getCompanies,
  getCompaniesMetadata,
} from './modules/Companies/CollectionList/tasks'

import {
  TASK_GET_EVENTS_LIST,
  TASK_GET_EVENTS_ORGANISER_NAME,
  TASK_GET_EVENTS_METADATA,
  TASK_GET_ALL_ACTIVITY_FEED_EVENTS,
} from '../client/modules/Events/CollectionList/state'

import { TASK_GET_EVENT_DETAILS } from '../client/modules/Events/EventDetails/state'
import { getEventDetails } from '../client/modules/Events/EventDetails/tasks'
import { TASK_GET_EVENT_AVENTRI_DETAILS } from './modules/Events/EventAventriDetails/state'
import { getEventAventriDetails } from './modules/Events/EventAventriDetails/tasks'
import { TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES } from './modules/Events/EventAventriRegistrationStatus/state'
import {
  TASK_GET_EVENTS_FORM_AND_METADATA,
  TASK_SAVE_EVENT,
} from '../client/modules/Events/EventForm/state'
import {
  getEventFormAndMetadata,
  saveEvent,
} from '../client/modules/Events/EventForm/tasks'
import {
  TASK_SEARCH_ATTENDEE,
  TASK_GET_ATTENDEE_METADATA,
} from '../client/modules/Events/AttendeeSearch/state'
import {
  searchAttendee,
  getAttendeeMetadata,
} from './modules/Events/AttendeeSearch/tasks'

import { getESSInteractionDetails } from './modules/Interactions/ESSInteractionDetails/tasks'

import {
  getEvents,
  getAllActivityFeedEvents,
  getEventsMetadata,
} from './modules/Events/CollectionList/tasks'

import { TASK_GET_PROFILES_LIST } from '../apps/investments/client/profiles/state'
import * as investmentProfilesTasks from '../apps/investments/client/profiles/tasks'

import { TASK_GET_OPPORTUNITIES_LIST } from '../apps/investments/client/opportunities/List/state'
import * as investmentOpportunitiesListTasks from '../apps/investments/client/opportunities/List/tasks'
import {
  TASK_SAVE_OPPORTUNITY_DETAILS,
  TASK_SAVE_OPPORTUNITY_REQUIREMENTS,
  TASK_SAVE_OPPORTUNITY_STATUS,
  TASK_GET_OPPORTUNITY_DETAILS,
  TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA,
  TASK_CREATE_INVESTMENT_OPPORTUNITY,
} from '../apps/investments/client/opportunities/Details/state'
import * as investmentOpportunitiesDetailsTasks from '../apps/investments/client/opportunities/Details/tasks'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME,
  TASK_GET_INVESTMENTS_PROJECTS_METADATA,
} from '../apps/investments/client/projects/state'
import * as investmentProjectTasks from '../apps/investments/client/projects/tasks'

import {
  TASK_GET_LATEST_EXPORT_WINS,
  TASK_GET_PROJECT_WON_COUNT,
} from '../apps/companies/apps/company-overview/overview-table-cards/state'
import * as overviewInvestmentProjectTasks from '../apps/companies/apps/company-overview/overview-table-cards/tasks'

import {
  TASK_EDIT_PROJECT_TEAM_MEMBERS,
  TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER,
  TASK_SAVE_INVESTMENT_PROJECT_MANAGERS,
} from '../apps/investments/client/projects/team/state'
import * as editInvestmentProjectTeamTasks from '../apps/investments/client/projects/team/tasks'

import {
  TASK_SEARCH_COMPANY,
  TASK_CREATE_INVESTMENT_PROJECT,
  TASK_GET_COMPANY_INVESTMENT_COUNT,
  TASK_GET_INVESTMENT_PROJECT_INITIAL_VALUES,
} from '../apps/investments/client/projects/create/state'
import * as createInvestmentProjectTasks from '../apps/investments/client/projects/create/tasks'

import {
  TASK_CREATE_LARGE_CAPITAL_PROFILE,
  TASK_UPDATE_LARGE_CAPITAL_PROFILE,
} from './modules/Companies/CompanyInvestments/LargeCapitalProfile/state'
import * as largeCapitalProfileTasks from './modules/Companies/CompanyInvestments/LargeCapitalProfile/tasks'

import {
  TASK_SAVE_ORDER_ASSIGNEES,
  TASK_SAVE_ORDER_SUBSCRIBERS,
} from '../apps/omis/apps/edit/client/state'
import * as editOMISTasks from '../apps/omis/apps/edit/client/tasks'

import * as myInvestmentProjects from './components/MyInvestmentProjects/tasks'
import { TASK_GET_MY_INVESTMENTS_LIST } from './components/MyInvestmentProjects/state'

import * as personalisedDashboard from './components/PersonalisedDashboard/tasks'
import { TASK_CHECK_FOR_INVESTMENTS } from './components/PersonalisedDashboard/state'

import { TASK_DATA_HUB_FEED } from './components/PersonalisedDashboard/state'

import { fetchOutstandingPropositions } from './components/InvestmentReminders/tasks'
import { TASK_GET_OUTSTANDING_PROPOSITIONS } from './components/InvestmentReminders/state'
import { fetchReminderSummary } from './components/NotificationAlert/tasks'
import { TASK_GET_REMINDER_SUMMARY } from './components/NotificationAlert/state'

import { TASK_GET_TYPEAHEAD_OPTIONS } from './components/Typeahead/state'

import * as exportsEdit from '../apps/companies/apps/exports/client/tasks'

import {
  saveContact,
  redirectToContactForm,
} from './components/ContactForm/tasks'
import {
  getContacts,
  getContactsMetadata,
} from './modules/Contacts/CollectionList/tasks'
import {
  getInteractions,
  getInteractionsMetadata,
} from './modules/Interactions/CollectionList/tasks'
import {
  getCompanyActivities,
  getCompanyActivitiesMetadata,
} from './components/ActivityFeed/CollectionList/tasks'

import {
  TASK_GET_ORDERS_LIST,
  TASK_GET_ORDERS_METADATA,
  TASK_GET_ORDERS_RECONCILIATION,
  TASK_GET_ORDERS_RECONCILIATION_METADATA,
} from './modules/Omis/CollectionList/state'

import {
  getOrders,
  getOrdersMetadata,
  getOrdersReconciliation,
  getOrdersReconciliationMetadata,
} from './modules/Omis/CollectionList/tasks'

import { getAdviserNames } from './advisers'

import { getCompanyNames } from './company'

import { getTeamNames } from './teams'

import {
  TASK_GET_CONTACTS_LIST,
  TASK_GET_CONTACTS_METADATA,
} from './modules/Contacts/CollectionList/state'
import {
  TASK_GET_COMPANY_ACTIVITIES_LIST,
  TASK_GET_COMPANY_ACTIVITIES_METADATA,
  TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME,
  TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME,
  TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME,
} from './components/ActivityFeed/CollectionList/state'

import {
  TASK_GET_INTERACTIONS_LIST,
  TASK_GET_INTERACTIONS_ADVISER_NAME,
  TASK_GET_INTERACTIONS_COMPANY_NAME,
  TASK_GET_INTERACTIONS_METADATA,
  TASK_GET_INTERACTIONS_TEAM_NAME,
} from './modules/Interactions/CollectionList/state'

import * as reminders from '../client/modules/Reminders/tasks'
import {
  TASK_GET_SUBSCRIPTION_SUMMARY,
  TASK_GET_ELD_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS,
  TASK_GET_NRI_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS,
  TASK_GET_EXPORT_NRI_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_EXPORT_NRI_REMINDER_SUBSCRIPTIONS,
  TASK_GET_EXPORT_NI_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_EXPORT_NI_REMINDER_SUBSCRIPTIONS,
  TASK_GET_ESTIMATED_LAND_DATE_REMINDERS,
  TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS,
  TASK_GET_NO_RECENT_INTERACTION_REMINDERS,
  TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER,
  TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS,
  TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER,
  TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER,
  TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER,
  TASK_DELETE_NO_RECENT_INTERACTION_REMINDER,
  TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS,
  TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS,
  TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER,
  TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS,
} from '../client/modules/Reminders/state'

import Footer from '../client/components/Footer'

import ContactForm from '../client/components/ContactForm'
import resourceTasks from '../client/components/Resource/tasks'
import { getTypeaheadOptions } from '../client/components/Typeahead/tasks'
import { ProtectedRoute } from '../client/components'
import AddRemoveFromListForm from '../client/components/CompanyLists/AddRemoveFromListForm'

import routes from './routes'

import * as matchCompanyTasks from '../apps/companies/apps/match-company/client/tasks'
import * as companyListTasks from '../apps/company-lists/client/tasks'
import { editCompany } from '../apps/companies/apps/edit-company/client/tasks'
import { createList } from '../apps/company-lists/client/tasks.js'

import { TASK_GET_CONTACT_ACTIVITIES } from '../client/modules/Contacts/ContactActivity/state'
import { getContactActivities } from '../client/modules/Contacts/ContactActivity/tasks'
import { TASK_ARCHIVE_CONTACT } from '../client/modules/Contacts/ContactDetails/state'
import { archiveContact } from '../client/modules/Contacts/ContactDetails/tasks'
import { TASK_GET_USER_FEATURE_FLAGS } from './components/CheckUserFeatureFlags/state'
import { getUserFeatureFlags } from './components/CheckUserFeatureFlags/tasks'
import { getEventAventriRegistrationStatusAttendees } from './modules/Events/EventAventriRegistrationStatus/tasks'
import ErrorFallback from './components/ErrorFallback'

import { TASK_ARCHIVE_INTERACTION } from './modules/Interactions/InteractionDetails/state'
import { archiveInteraction } from './modules/Interactions/InteractionDetails/tasks'
import { TASK_GET_ESS_INTERACTION_DETAILS } from './modules/Interactions/ESSInteractionDetails/state'

import { TASK_GET_COMPANY_DETAIL } from '../client/modules/Companies/CompanyDetails/state'
import { getCompanyDetails } from '../client/modules/Companies/CompanyDetails/tasks'

import { TASK_GET_EXPORT_DETAIL } from '../client/modules/ExportPipeline/ExportDetails/state'
import { getExportDetails } from '../client/modules/ExportPipeline/ExportDetails/tasks'

import { TASK_SAVE_EXPORT } from '../client/modules/ExportPipeline/ExportForm/state'
import { saveExport } from '../client/modules/ExportPipeline/ExportForm/tasks'
import { TASK_DELETE_EXPORT } from '../client/modules/ExportPipeline/ExportDelete/state'
import { deleteExport } from '../client/modules/ExportPipeline/ExportDelete/tasks'

import {
  TASK_GET_EXPORT_PIPELINE_LIST,
  TASK_GET_EXPORT_PIPELINE_METADATA,
} from '../client/modules/ExportPipeline/ExportList/state'
import {
  getExportPipelineList,
  getExportPipelineMetadata,
} from '../client/modules/ExportPipeline/ExportList/task'
import { TASK_REDIRECT_TO_CONTACT_FORM } from './components/ContactForm/state'

import { getListsCompanyIsIn } from './components/CompanyLocalHeader/task'
import { TASK_GET_LISTS_COMPANY_IS_IN } from './components/CompanyLocalHeader/state'

import {
  TASK_CREATE_INVESTMENT_PROPOSITION,
  TASK_ABANDON_INVESTMENT_PROPOSITION,
} from './modules/Investments/Projects/Propositions/state'
import {
  createInvestmentProposition,
  abandonInvestmentProposition,
} from './modules/Investments/Projects/Propositions/tasks'

import { TASK_GET_DNB_FAMILY_TREE } from './modules/Companies/CompanyHierarchy/state'
import { getDnbFamilyTree } from './modules/Companies/CompanyHierarchy/tasks'

import { TASK_GET_GLOBAL_HQ_LIST } from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/state'
import { getGlobalHeadquartersCollection } from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/tasks'

import { TASK_GET_SUBSIDIARY_LIST } from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary/state'
import { getSubsidiaryCollection } from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary/tasks'

import { TASK_EDIT_INVESTMENT_PROJECT_SUMMARY } from './modules/Investments/Projects/state'
import { updateInvestmentProject } from './modules/Investments/Projects/tasks'

function parseProps(domNode) {
  return 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
}

function Mount({ selector, children }) {
  return [...document.querySelectorAll(selector)].map((domNode) => {
    const props = parseProps(domNode)
    return ReactDOM.createPortal(
      typeof children === 'function' ? children(props) : children,
      domNode
    )
  })
}

const appWrapper = document.getElementById('react-app')
const globalProps = parseProps(appWrapper)

if (globalProps.sentryDsn) {
  Sentry.init({
    dsn: globalProps.sentryDsn,
    environment: globalProps.sentryEnvironment,
  })
  ReactSentry.init({
    dsn: globalProps.sentryDsn,
    environment: globalProps.sentryEnvironment,
    autoSessionTracking: false,
    integrations: [
      new BrowserTracing({
        tracingOrigins: [
          'www.datahub.uktrade.io',
          'www.datahub.dev.uktrade.io',
          'www.datahub.staging.uktrade.io',
          'www.datahub.uat.uktrade.io',
          '*',
        ],
      }),
    ],
    tracesSampleRate: 1.0,
  })
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => ReactSentry.captureException(error)}
    >
      <Provider
        tasks={{
          'Create list': createList,
          'Edit company': editCompany,
          'Create company': createCompany,
          'Edit company list': companyListTasks.editCompanyList,
          'Match confirmation': matchCompanyTasks.onMatchSubmit,
          'Cannot find match': matchCompanyTasks.cannotFindMatchSubmit,
          'Submit merge request': matchCompanyTasks.submitMergeRequest,
          'Company lists': companyListsTasks.fetchCompanyLists,
          'Company list': companyListsTasks.fetchCompanyList,
          'Add or remove from list': companyListsTasks.addOrRemoveFromList,
          'Exports history': exportsHistoryTasks.fetchExportsHistory,
          'Referral details': referralTasks.fetchReferralDetails,
          Referrals: referralListTask,
          'Export wins': exportWinsTasks.fetchExportWins,
          'Update Lead ITA': manageAdviser.updateAdviser,
          'Get send referral initial values':
            referralsSendTasks.getInitialFormValues,
          'Save contact': saveContact,
          [TASK_SAVE_REFERRAL]: referralsSendTasks.saveReferral,
          [TASK_SAVE_ONE_LIST_DETAILS]: editOneListTasks.saveOneListDetails,
          [EXPORT_COUNTRIES_EDIT_NAME]:
            exportCountriesEditTasks.saveExportCountries,
          [TASK_POSTCODE_TO_REGION]: addCompanyPostcodeToRegionTask,
          [TASK_GET_ACTIVE_EVENTS]: addInteractionFormTasks.fetchActiveEvents,
          [TASK_SAVE_INTERACTION]: addInteractionFormTasks.saveInteraction,
          [TASK_GET_INTERACTION_INITIAL_VALUES]:
            addInteractionFormTasks.getInitialFormValues,
          [TASK_UPDATE_STAGE]: investmentAdminTasks.updateProjectStage,
          [TASK_SAVE_OPPORTUNITY_DETAILS]:
            investmentOpportunitiesDetailsTasks.saveOpportunityDetails,
          [TASK_SAVE_OPPORTUNITY_STATUS]:
            investmentOpportunitiesDetailsTasks.saveOpportunityStatus,
          [TASK_SAVE_OPPORTUNITY_REQUIREMENTS]:
            investmentOpportunitiesDetailsTasks.saveOpportunityRequirements,
          [TASK_GET_OPPORTUNITY_DETAILS]:
            investmentOpportunitiesDetailsTasks.getOpportunityDetails,
          [TASK_GET_OPPORTUNITIES_LIST]:
            investmentOpportunitiesListTasks.getOpportunities,
          [TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA]:
            investmentOpportunitiesDetailsTasks.getRequirementsMetadata,
          [TASK_CREATE_INVESTMENT_OPPORTUNITY]:
            investmentOpportunitiesDetailsTasks.createOpportunity,
          [DNB__CHECK_PENDING_REQUEST]: businessDetails.checkIfPendingRequest,
          [TASK_GET_PROFILES_LIST]:
            investmentProfilesTasks.getLargeCapitalProfiles,
          [TASK_GET_PROJECTS_LIST]: investmentProjectTasks.getProjects,
          [TASK_GET_PROJECT_WON_COUNT]:
            overviewInvestmentProjectTasks.getProjectsWon,
          [TASK_GET_LATEST_EXPORT_WINS]:
            overviewInvestmentProjectTasks.getLatestExportWins,
          [TASK_CREATE_INVESTMENT_PROJECT]:
            createInvestmentProjectTasks.createInvestmentProject,
          [TASK_CREATE_LARGE_CAPITAL_PROFILE]:
            largeCapitalProfileTasks.createInvestorProfile,
          [TASK_UPDATE_LARGE_CAPITAL_PROFILE]:
            largeCapitalProfileTasks.updateInvestorProfile,
          [TASK_GET_INVESTMENT_PROJECT_INITIAL_VALUES]:
            createInvestmentProjectTasks.getInitialFormValues,
          [TASK_SEARCH_COMPANY]: createInvestmentProjectTasks.searchCompany,
          [TASK_GET_COMPANY_INVESTMENT_COUNT]:
            createInvestmentProjectTasks.getCompanyInvestmentsCount,
          [TASK_GET_COMPANIES_LIST]: getCompanies,
          [TASK_GET_COMPANIES_METADATA]: getCompaniesMetadata,
          [TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME]: getAdviserNames,
          [TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME]:
            getAdviserNames,
          [TASK_GET_INVESTMENTS_PROJECTS_METADATA]:
            investmentProjectTasks.getMetadata,
          [TASK_EDIT_PROJECT_TEAM_MEMBERS]:
            editInvestmentProjectTeamTasks.updateTeamMembers,
          [TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER]:
            editInvestmentProjectTeamTasks.saveClientRelationshipManager,
          [TASK_SAVE_INVESTMENT_PROJECT_MANAGERS]:
            editInvestmentProjectTeamTasks.saveProjectManagementStaff,
          [TASK_CHECK_FOR_INVESTMENTS]:
            personalisedDashboard.checkForInvestments,
          [TASK_DATA_HUB_FEED]: personalisedDashboard.checkDataHubFeed,
          [TASK_GET_MY_INVESTMENTS_LIST]:
            myInvestmentProjects.fetchMyInvestmentsList,
          [TASK_GET_OUTSTANDING_PROPOSITIONS]: fetchOutstandingPropositions,
          [TASK_GET_REMINDER_SUMMARY]: fetchReminderSummary,
          'Large investment profiles filters':
            investmentProfilesTasks.loadFilterOptions,
          [TASK_GET_CONTACTS_LIST]: getContacts,
          [TASK_GET_CONTACTS_METADATA]: getContactsMetadata,
          [TASK_GET_INTERACTIONS_LIST]: getInteractions,
          [TASK_GET_INTERACTIONS_ADVISER_NAME]: getAdviserNames,
          [TASK_GET_INTERACTIONS_COMPANY_NAME]: getCompanyNames,
          [TASK_GET_INTERACTIONS_METADATA]: getInteractionsMetadata,
          [TASK_GET_COMPANY_ACTIVITIES_LIST]: getCompanyActivities,
          [TASK_GET_COMPANY_ACTIVITIES_METADATA]: getCompanyActivitiesMetadata,
          [TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME]: getAdviserNames,
          [TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME]: getCompanyNames,
          [TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME]: getTeamNames,
          [TASK_GET_EVENTS_LIST]: getEvents,
          [TASK_GET_EVENTS_METADATA]: getEventsMetadata,
          [TASK_GET_ALL_ACTIVITY_FEED_EVENTS]: getAllActivityFeedEvents,
          [TASK_GET_EVENTS_ORGANISER_NAME]: getAdviserNames,
          [TASK_GET_EVENT_DETAILS]: getEventDetails,
          [TASK_GET_EVENT_AVENTRI_DETAILS]: getEventAventriDetails,
          [TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES]:
            getEventAventriRegistrationStatusAttendees,
          [TASK_GET_EVENTS_FORM_AND_METADATA]: getEventFormAndMetadata,
          [TASK_SAVE_EVENT]: saveEvent,
          [TASK_SEARCH_ATTENDEE]: searchAttendee,
          [TASK_GET_ATTENDEE_METADATA]: getAttendeeMetadata,
          [TASK_GET_ORDERS_METADATA]: getOrdersMetadata,
          [TASK_GET_ORDERS_LIST]: getOrders,
          [TASK_GET_ORDERS_RECONCILIATION]: getOrdersReconciliation,
          [TASK_GET_ORDERS_RECONCILIATION_METADATA]:
            getOrdersReconciliationMetadata,
          [TASK_GET_INTERACTIONS_TEAM_NAME]: getTeamNames,
          [TASK_ARCHIVE_COMPANY]: businessDetails.archiveSubmitCallback,
          'Exports Edit': exportsEdit.saveWinCategory,
          [TASK_GET_TYPEAHEAD_OPTIONS]: getTypeaheadOptions,
          [TASK_SAVE_ORDER_ASSIGNEES]: editOMISTasks.saveOrderAssignees,
          [TASK_SAVE_ORDER_SUBSCRIBERS]: editOMISTasks.saveOrderSubscribers,
          [TASK_GET_SUBSCRIPTION_SUMMARY]: reminders.getSubscriptionSummary,
          [TASK_GET_ELD_REMINDER_SUBSCRIPTIONS]: reminders.getEldSubscriptions,
          [TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS]:
            reminders.saveEldSubscriptions,
          [TASK_GET_NRI_REMINDER_SUBSCRIPTIONS]: reminders.getNriSubscriptions,
          [TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS]:
            reminders.saveNriSubscriptions,
          [TASK_GET_EXPORT_NRI_REMINDER_SUBSCRIPTIONS]:
            reminders.getNriExportSubscriptions,
          [TASK_SAVE_EXPORT_NRI_REMINDER_SUBSCRIPTIONS]:
            reminders.saveNriExportSubscriptions,
          [TASK_GET_EXPORT_NI_REMINDER_SUBSCRIPTIONS]:
            reminders.getNIExportSubscriptions,
          [TASK_SAVE_EXPORT_NI_REMINDER_SUBSCRIPTIONS]:
            reminders.saveNIExportSubscriptions,
          [TASK_GET_ESTIMATED_LAND_DATE_REMINDERS]:
            reminders.getEstimatedLandDateReminders,
          [TASK_GET_NO_RECENT_INTERACTION_REMINDERS]:
            reminders.getNoRecentInteractionReminders,
          [TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS]:
            reminders.getExportsNoRecentInteractionReminders,
          [TASK_GET_EXPORTS_NEW_INTERACTION_REMINDERS]:
            reminders.getExportsNewInteractionReminders,
          [TASK_GET_EXPORTS_NEXT_NEW_INTERACTION_REMINDERS]:
            reminders.getNextExportsNewInteractionReminder,
          [TASK_DELETE_ESTIMATED_LAND_DATE_REMINDER]:
            reminders.deleteEstimatedLandDateReminder,
          [TASK_DELETE_NO_RECENT_INTERACTION_REMINDER]:
            reminders.deleteNoRecentInteractionReminder,
          [TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER]:
            reminders.deleteExportNoRecentInteractionReminder,
          [TASK_DELETE_EXPORT_NEW_INTERACTION_REMINDER]:
            reminders.deleteExportNewInteractionReminder,
          [TASK_GET_NEXT_ESTIMATED_LAND_DATE_REMINDER]:
            reminders.getNextEstimatedLandDateReminder,
          [TASK_GET_NEXT_NO_RECENT_INTERACTION_REMINDER]:
            reminders.getNextNoRecentInteractionReminder,
          [TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS]:
            reminders.getNextExportNoRecentInteractionReminder,
          [TASK_GET_OUTSTANDING_PROPOSITIONS_REMINDERS]:
            reminders.getOutstandingPropositions,
          [TASK_GET_CONTACT_ACTIVITIES]: getContactActivities,
          [TASK_ARCHIVE_CONTACT]: archiveContact,
          [TASK_GET_USER_FEATURE_FLAGS]: getUserFeatureFlags,
          [TASK_ARCHIVE_INTERACTION]: archiveInteraction,
          ...resourceTasks,
          [TASK_GET_ESS_INTERACTION_DETAILS]: getESSInteractionDetails,
          [TASK_GET_COMPANY_DETAIL]: getCompanyDetails,
          [TASK_GET_EXPORT_DETAIL]: getExportDetails,
          [TASK_DELETE_EXPORT]: deleteExport,
          [TASK_SAVE_EXPORT]: saveExport,
          [TASK_GET_EXPORT_PIPELINE_LIST]: getExportPipelineList,
          [TASK_GET_EXPORT_PIPELINE_METADATA]: getExportPipelineMetadata,
          [TASK_REDIRECT_TO_CONTACT_FORM]: redirectToContactForm,
          [TASK_CREATE_INVESTMENT_PROPOSITION]: createInvestmentProposition,
          [TASK_ABANDON_INVESTMENT_PROPOSITION]: abandonInvestmentProposition,
          [TASK_GET_LISTS_COMPANY_IS_IN]: getListsCompanyIsIn,
          [TASK_GET_DNB_FAMILY_TREE]: getDnbFamilyTree,
          [TASK_GET_GLOBAL_HQ_LIST]: getGlobalHeadquartersCollection,
          [TASK_GET_SUBSIDIARY_LIST]: getSubsidiaryCollection,
          [TASK_EDIT_INVESTMENT_PROJECT_SUMMARY]: updateInvestmentProject,
        }}
      >
        <Mount selector="#data-hub-header">
          {(props) => <DataHubHeaderWrapper {...props} />}
        </Mount>
        <Mount selector="#add-company-form">
          {(props) => (
            <AddCompanyForm csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#interaction-details-form">
          {(props) => (
            <InteractionDetailsForm
              csrfToken={globalProps.csrfToken}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#edit-company-form">
          {(props) => (
            <EditCompanyForm csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#company-edit-history">
          {(props) => (
            <CompanyEditHistory csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#investment-edit-history">
          {(props) => (
            <InvestmentEditHistory
              csrfToken={globalProps.csrfToken}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#match-confirmation">
          {(props) => (
            <MatchConfirmation csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#cannot-find-match">
          {(props) => (
            <CannotFindMatch csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#find-company">
          {(props) => (
            <FindCompany csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#activity-feed-app">
          {(props) => (
            <CompanyActivityCollection
              companyInteractionsTab={true}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#dashboard">
          {(props) => (
            <PersonalisedDashboard
              csrfToken={globalProps.csrfToken}
              id="dashboard"
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#delete-company-list">
          {(props) => (
            <DeleteCompanyList csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#edit-company-list">
          {(props) => (
            <EditCompanyList csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#create-company-list-form">
          {(props) => (
            <CreateListForm csrfToken={globalProps.csrfToken} {...props} />
          )}
        </Mount>
        <Mount selector="#add-remove-list-form">
          {(props) => <AddRemoveFromListForm {...props} />}
        </Mount>
        <Mount selector="#lead-advisers">
          {(props) => <LeadAdvisers {...props} />}
        </Mount>
        <Mount selector="#dnb-hierarchy">
          {(props) => <CompanyHierarchy {...props} />}
        </Mount>
        <Mount selector="#company-business-details">
          {(props) => (
            <CompanyBusinessDetails
              csrfToken={globalProps.csrfToken}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#company-edit-one-list">
          {(props) => (
            <EditOneListForm {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#large-capital-profile-collection">
          {(props) => <LargeCapitalProfileCollection {...props} />}
        </Mount>
        <Mount selector="#unfiltered-large-capital-opportunity-collection">
          {(props) => (
            <UnfilteredLargeCapitalOpportunityCollection {...props} />
          )}
        </Mount>
        <Mount selector="#opportunity">
          {(props) => <Opportunity {...props} />}
        </Mount>
        <Mount selector="#opportunity-status">
          {(props) => <OpportunityChangeStatusForm {...props} />}
        </Mount>
        <Mount selector="#create-uk-investment-opportunity">
          {() => (
            <CreateUKInvestmentOpportunity id="create-uk-investment-opportunity" />
          )}
        </Mount>
        <Mount selector="#manage-adviser">
          {(props) => (
            <ManageAdviser {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#company-export-index-page">
          {(props) => <ExportsIndex {...props} />}
        </Mount>
        <Mount selector="#send-referral-form">
          {(props) => (
            <SendReferralForm {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#company-export-full-history">
          {(props) => <ExportsHistory {...props} />}
        </Mount>
        <Mount selector="#referral-details">
          {(props) => <ReferralDetails {...props} />}
        </Mount>
        <Mount selector="#referral-help">
          {(props) => <ReferralHelp {...props} />}
        </Mount>
        <Mount selector="#company-export-exports-edit">
          {(props) => <ExportsEdit {...props} />}
        </Mount>
        <Mount selector="#interaction-referral-details">
          {(props) => <InteractionReferralDetails {...props} />}
        </Mount>
        <Mount selector="#company-export-countries-edit">
          {(props) => <ExportCountriesEdit {...props} />}
        </Mount>
        <Mount selector="#investment-project-admin">
          {(props) => <InvestmentProjectAdmin {...props} />}
        </Mount>
        <Mount selector="#flash-messages">
          {(props) => <FlashMessages {...props} />}
        </Mount>
        <Mount selector="#footer">{() => <Footer />}</Mount>
        <Mount selector="#investment-projects-collection">
          {(props) => <InvestmentProjectsCollection {...props} />}
        </Mount>
        <Mount selector="#investment-project-form">
          {(props) => (
            <InvestmentProjectForm
              csrfToken={globalProps.csrfToken}
              {...props}
            />
          )}
        </Mount>
        <Mount selector="#ie-banner">{() => <IEBanner />}</Mount>
        <Mount selector="#contact-form">
          {(props) => <ContactForm {...props} id="contact-form" />}
        </Mount>
        <Mount selector="#company-overview">
          {(props) => <CompanyOverview {...props} />}
        </Mount>
        <Mount selector="#company-projects-collection">
          {(props) => <CompanyProjectsCollection {...props} />}
        </Mount>
        <Mount selector="#company-contacts-collection">
          {(props) => <CompaniesContactsCollection {...props} />}
        </Mount>
        <Mount selector="#dashboard-local-header">
          {(props) => (
            <SearchLocalHeader
              csrfToken={globalProps.csrfToken}
              flashMessage={props.flashMessage}
            />
          )}
        </Mount>
        <Mount selector="#company-orders-collection">
          {(props) => <CompanyOrdersCollection {...props} />}
        </Mount>
        <Mount selector="#edit-assignees">
          {(props) => <EditAssignees {...props} />}
        </Mount>
        <Mount selector="#edit-subscribers">
          {(props) => <EditSubscribers {...props} />}
        </Mount>
        <Mount selector="#edit-team-members">
          {(props) => <EditTeamMembers {...props} />}
        </Mount>
        <Mount selector="#edit-client-relationship-management">
          {(props) => <EditClientRelationshipManagement {...props} />}
        </Mount>
        <Mount selector="#edit-project-management">
          {(props) => <EditProjectManagement {...props} />}
        </Mount>
        <Mount selector="#contact-activity">
          {(props) => <ContactActivity {...props} />}
        </Mount>
        <Mount selector="#contact-local-header">
          {(props) => <ContactLocalHeader {...props} />}
        </Mount>
        <Mount selector="#contact-details">
          {(props) => <ContactDetails {...props} />}
        </Mount>
        <Mount selector="#contact-documents">
          {(props) => <ContactDocuments {...props} />}
        </Mount>
        <Mount selector="#investment-documents">
          {(props) => <InvestmentDocuments {...props} />}
        </Mount>
        <Mount selector="#contact-audit-history">
          {(props) => <ContactAuditHistory {...props} />}
        </Mount>
        <Mount selector="#interaction-details">
          {(props) => <InteractionDetails {...props} />}
        </Mount>
        <Mount selector="#ess-interaction-details">
          {(props) => <ESSInteractionDetails {...props} />}
        </Mount>
        <Mount selector="#orders-reconciliation-collection">
          {(props) => <OrdersReconciliationCollection {...props} />}
        </Mount>
        <Mount selector="#attendee-search">
          {(props) => <AttendeeSearch {...props} />}
        </Mount>
        <Mount selector="#core-team">
          {(props) => <CoreTeam {...props} />}
        </Mount>
        <Mount selector="#company-large-capital-profile">
          {(props) => <LargeCapitalProfile {...props} />}
        </Mount>
        <Mount selector="#create-proposition">
          {(props) => <CreateProposition {...props} />}
        </Mount>
        <Mount selector="#abandon-proposition">
          {(props) => <AbandonProposition {...props} />}
        </Mount>
        <Mount selector="#proposition-details">
          {(props) => <PropositionDetails {...props} />}
        </Mount>
        <Mount selector="#link-global-hq">
          {(props) => <LinkGlobalHQ {...props} />}
        </Mount>
        <Mount selector="#link-subsidiary">
          {(props) => <LinkSubsidiary {...props} />}
        </Mount>
        <Mount selector="#edit-project-summary">
          {(props) => <EditProjectSummary {...props} />}
        </Mount>

        <Mount selector="#react-app">
          {() => (
            <Switch>
              {Object.keys(routes).map((module) =>
                routes[module].map((route) => (
                  <ProtectedRoute exact={route.exact || true} {...route} />
                ))
              )}
            </Switch>
          )}
        </Mount>
      </Provider>
    </ErrorBoundary>
  )
}

window.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(<App />, appWrapper)
)
