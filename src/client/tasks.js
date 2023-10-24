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

import { TASK_GET_PROFILES_LIST } from './modules/Investments/Profiles/state'
import * as investmentProfilesTasks from './modules/Investments/Profiles/tasks'

import { TASK_GET_OPPORTUNITIES_LIST } from './modules/Investments/Opportunities/state'
import * as investmentOpportunitiesListTasks from './modules/Investments/Opportunities/tasks'
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
  TASK_EDIT_INVESTMENT_PROJECT_STATUS,
  TASK_UPDATE_INVESTMENT_PROJECT_STAGE,
  TASK_GET_INVESTMENT_PROJECT,
} from './modules/Investments/Projects/state'
import * as investmentProjectTasks from './modules/Investments/Projects/tasks'

import {
  TASK_GET_LATEST_EXPORT_WINS,
  TASK_GET_PROJECT_WON_COUNT,
} from '../apps/companies/apps/company-overview/overview-table-cards/state'
import * as overviewInvestmentProjectTasks from '../apps/companies/apps/company-overview/overview-table-cards/tasks'

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
import {
  TASK_CHECK_FOR_INVESTMENTS,
  TASK_DATA_HUB_FEED,
} from './components/PersonalisedDashboard/state'

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
  TASK_GET_DUE_DATE_APPROACHING_REMINDERS,
  TASK_DELETE_DUE_DATE_APPROACHING_REMINDER,
  TASK_GET_NEXT_DUE_DATE_APPROACHING_REMINDER,
} from '../client/modules/Reminders/state'

import resourceTasks from '../client/components/Resource/tasks'
import { getTypeaheadOptions } from '../client/components/Typeahead/tasks'

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

import {
  TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER,
  TASK_EDIT_PROJECT_TEAM_MEMBERS,
  TASK_SAVE_INVESTMENT_PROJECT_MANAGERS,
} from './modules/Investments/Projects/Team/state'
import { updateTeamMembers } from './modules/Investments/Projects/Team/tasks'

import { TASK_DELETE_PROJECT_DOCUMENT } from './modules/Investments/Projects/Evidence/state'
import { deleteProjectDocument } from './modules/Investments/Projects/Evidence/tasks'

import {
  TASK_EDIT_INVESTMENT_PROJECT_REQUIREMENTS,
  TASK_EDIT_INVESTMENT_PROJECT_SUMMARY,
  TASK_EDIT_INVESTMENT_PROJECT_VALUE,
} from './modules/Investments/Projects/Details/state'

import {
  TASK_GET_NON_FDI_PROJECTS_LIST,
  TASK_UPDATE_ASSOCIATED_PROJECT,
} from './modules/Investments/Projects/Details/EditAssociatedProject/state'
import {
  getNonFdiProjects,
  updateAssociatedProject,
} from './modules/Investments/Projects/Details/EditAssociatedProject/tasks'

import {
  TASK_GET_UK_COMPANIES,
  TASK_UPDATE_RECIPIENT_COMPANY,
} from './modules/Investments/Projects/Details/EditRecipientCompany/state'
import {
  getUkCompanies,
  updateRecipientCompany,
} from './modules/Investments/Projects/Details/EditRecipientCompany/tasks'

import {
  TASK_GET_OBJECTIVE,
  TASK_SAVE_OBJECTIVE,
  TASK_SAVE_STRATEGY,
  TASK_ARCHIVE_OBJECTIVE,
} from './modules/Companies/AccountManagement/state'
import {
  getObjective,
  saveObjective,
  saveStrategy,
  archiveObjective,
} from './modules/Companies/AccountManagement/tasks'

import {
  getOneListDetails,
  saveOneListDetails,
} from './modules/Companies/CoreTeam/tasks'
import {
  TASK_GET_ONE_LIST_DETAILS,
  TASK_SAVE_ONE_LIST_DETAILS,
} from './modules/Companies/CoreTeam/state'
import { TASK_SAVE_INVESTMENT_PROJECT_TASK } from './modules/Investments/Projects/Tasks/state'
import { saveInvestmentProjectTask } from './modules/Investments/Projects/Tasks/tasks'

import {
  TASK_EDIT_OMIS_QUOTE_INFORMATION,
  TASK_EDIT_OMIS_INTERNAL_INFORMATION,
  TASK_RECONCILE_OMIS_PAYMENT,
  TASK_EDIT_INVOICE_DETAILS,
} from './modules/Omis/state'
import { savePayment, updateOrder } from './modules/Omis/tasks'

import { archiveTask, getTaskDetail } from './modules/Tasks/TaskDetails/tasks'
import {
  TASK_ARCHIVE_TASK,
  TASK_GET_TASK_DETAILS,
} from './modules/Tasks/TaskDetails/state'
import { saveTaskDetail } from './modules/Tasks/TaskForm/tasks'
import { TASK_SAVE_TASK_DETAILS } from './modules/Tasks/TaskForm/state'

export const tasks = {
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
  'Get send referral initial values': referralsSendTasks.getInitialFormValues,
  'Save contact': saveContact,
  [TASK_SAVE_REFERRAL]: referralsSendTasks.saveReferral,
  [TASK_SAVE_ONE_LIST_DETAILS]: saveOneListDetails,
  [EXPORT_COUNTRIES_EDIT_NAME]: exportCountriesEditTasks.saveExportCountries,
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
  [TASK_GET_PROFILES_LIST]: investmentProfilesTasks.getLargeCapitalProfiles,
  [TASK_GET_PROJECTS_LIST]: investmentProjectTasks.getProjects,
  [TASK_GET_PROJECT_WON_COUNT]: overviewInvestmentProjectTasks.getProjectsWon,
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
  [TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME]: getAdviserNames,
  [TASK_GET_INVESTMENTS_PROJECTS_METADATA]: investmentProjectTasks.getMetadata,
  [TASK_EDIT_PROJECT_TEAM_MEMBERS]: updateTeamMembers,
  [TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER]:
    investmentProjectTasks.updateInvestmentProject,
  [TASK_SAVE_INVESTMENT_PROJECT_MANAGERS]:
    investmentProjectTasks.updateInvestmentProject,
  [TASK_CHECK_FOR_INVESTMENTS]: personalisedDashboard.checkForInvestments,
  [TASK_DATA_HUB_FEED]: personalisedDashboard.checkDataHubFeed,
  [TASK_GET_MY_INVESTMENTS_LIST]: myInvestmentProjects.fetchMyInvestmentsList,
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
  [TASK_GET_ORDERS_RECONCILIATION_METADATA]: getOrdersReconciliationMetadata,
  [TASK_GET_INTERACTIONS_TEAM_NAME]: getTeamNames,
  [TASK_ARCHIVE_COMPANY]: businessDetails.archiveSubmitCallback,
  'Exports Edit': exportsEdit.saveWinCategory,
  [TASK_GET_TYPEAHEAD_OPTIONS]: getTypeaheadOptions,
  [TASK_SAVE_ORDER_ASSIGNEES]: editOMISTasks.saveOrderAssignees,
  [TASK_SAVE_ORDER_SUBSCRIBERS]: editOMISTasks.saveOrderSubscribers,
  [TASK_GET_SUBSCRIPTION_SUMMARY]: reminders.getSubscriptionSummary,
  [TASK_GET_ELD_REMINDER_SUBSCRIPTIONS]: reminders.getEldSubscriptions,
  [TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS]: reminders.saveEldSubscriptions,
  [TASK_GET_NRI_REMINDER_SUBSCRIPTIONS]: reminders.getNriSubscriptions,
  [TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS]: reminders.saveNriSubscriptions,
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
  [TASK_GET_DUE_DATE_APPROACHING_REMINDERS]:
    reminders.getMyTasksDueDateApproachingReminders,
  [TASK_DELETE_DUE_DATE_APPROACHING_REMINDER]:
    reminders.deleteMyTasksDueDateApproachingReminder,
  [TASK_GET_NEXT_DUE_DATE_APPROACHING_REMINDER]:
    reminders.getMyTasksNextDueDateApproachingReminder,
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
  [TASK_EDIT_INVESTMENT_PROJECT_SUMMARY]:
    investmentProjectTasks.updateInvestmentProject,
  [TASK_EDIT_INVESTMENT_PROJECT_REQUIREMENTS]:
    investmentProjectTasks.updateInvestmentProject,
  [TASK_EDIT_INVESTMENT_PROJECT_VALUE]:
    investmentProjectTasks.updateInvestmentProject,
  [TASK_SAVE_STRATEGY]: saveStrategy,
  [TASK_EDIT_INVESTMENT_PROJECT_STATUS]:
    investmentProjectTasks.updateInvestmentProject,
  [TASK_SAVE_OBJECTIVE]: saveObjective,
  [TASK_GET_OBJECTIVE]: getObjective,
  [TASK_UPDATE_INVESTMENT_PROJECT_STAGE]:
    investmentProjectTasks.updateInvestmentProject,
  [TASK_GET_NON_FDI_PROJECTS_LIST]: getNonFdiProjects,
  [TASK_UPDATE_ASSOCIATED_PROJECT]: updateAssociatedProject,
  [TASK_GET_UK_COMPANIES]: getUkCompanies,
  [TASK_UPDATE_RECIPIENT_COMPANY]: updateRecipientCompany,
  [TASK_GET_ONE_LIST_DETAILS]: getOneListDetails,
  [TASK_ARCHIVE_OBJECTIVE]: archiveObjective,
  [TASK_DELETE_PROJECT_DOCUMENT]: deleteProjectDocument,
  [TASK_EDIT_OMIS_QUOTE_INFORMATION]: updateOrder,
  [TASK_EDIT_OMIS_INTERNAL_INFORMATION]: updateOrder,
  [TASK_GET_TASK_DETAILS]: getTaskDetail,
  [TASK_SAVE_INVESTMENT_PROJECT_TASK]: saveInvestmentProjectTask,
  [TASK_GET_INVESTMENT_PROJECT]: investmentProjectTasks.getInvestmentProject,
  [TASK_ARCHIVE_TASK]: archiveTask,
  [TASK_RECONCILE_OMIS_PAYMENT]: savePayment,
  [TASK_SAVE_TASK_DETAILS]: saveTaskDetail,
  [TASK_EDIT_INVOICE_DETAILS]: updateOrder,
}
