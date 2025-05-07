import * as companyListsTasks from './components/CompanyLists/tasks'
import * as exportsHistoryTasks from './modules/Companies/CompanyExports/ExportHistory/tasks.js'
import referralListTask from './components/ReferralList/tasks'
import { TASK_SAVE_REFERRAL } from './modules/Companies/Referrals/SendReferralForm/state.js'
import * as referralsSendTasks from './modules/Companies/Referrals/SendReferralForm/tasks.js'
import { TASK_NAME as EXPORT_COUNTRIES_EDIT_NAME } from './modules/Companies/CompanyExports/ExportCountriesEdit/state'
import * as exportCountriesEditTasks from './modules/Companies/CompanyExports/ExportCountriesEdit/tasks'
import { createCompany } from '../apps/companies/apps/add-company/client/tasks'
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
  TASK_GET_GLOBAL_ULTIMATE,
} from './modules/Companies/CompanyBusinessDetails/state.js'
import * as businessDetails from './modules/Companies/CompanyBusinessDetails/tasks.js'

import {
  TASK_GET_COMPANIES_LIST,
  TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME,
  TASK_GET_COMPANIES_METADATA,
  TASK_GET_COMPANIES_ADVISER_NAME,
} from './modules/Companies/CollectionList/state'
import {
  getCompanies,
  getCompaniesMetadata,
} from './modules/Companies/CollectionList/tasks'

import {
  TASK_GET_EVENTS_LIST,
  TASK_GET_EVENTS_ORGANISER_NAME,
  TASK_GET_EVENTS_METADATA,
} from '../client/modules/Events/CollectionList/state'

import { TASK_GET_EVENT_DETAILS } from '../client/modules/Events/EventDetails/state'
import { getEventDetails } from '../client/modules/Events/EventDetails/tasks'
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
  getEventsMetadata,
} from './modules/Events/CollectionList/tasks'

import { TASK_GET_PROFILES_LIST } from './modules/Investments/Profiles/state'
import * as investmentProfilesTasks from './modules/Investments/Profiles/tasks'

import { TASK_GET_OPPORTUNITIES_LIST } from './modules/Investments/Opportunities/CollectionList/state'
import * as investmentOpportunitiesListTasks from './modules/Investments/Opportunities/CollectionList/tasks'

import {
  TASK_GET_EYB_LEAD,
  TASK_GET_EYB_LEADS_LIST,
  TASK_GET_EYB_LEADS_METADATA,
} from './modules/Investments/EYBLeads/state'
import * as investmentEYBLeadTasks from './modules/Investments/EYBLeads/tasks'

import {
  TASK_CREATE_INVESTMENT_OPPORTUNITY,
  TASK_SAVE_OPPORTUNITY_STATUS,
  TASK_SAVE_OPPORTUNITY_DETAILS,
  TASK_SAVE_OPPORTUNITY_REQUIREMENTS,
  TASK_GET_OPPORTUNITY_DETAILS,
  TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA,
} from './modules/Investments/Opportunities/state'
import * as investmentOpportunitiesDetailsTasks from './modules/Investments/Opportunities/tasks'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_INVESTMENTS_PROJECTS_ADVISER_NAME,
  TASK_GET_INVESTMENTS_PROJECTS_METADATA,
  TASK_EDIT_INVESTMENT_PROJECT_STATUS,
  TASK_UPDATE_INVESTMENT_PROJECT_STAGE,
  TASK_GET_INVESTMENT_PROJECT,
  TASK_UPDATE_STAGE,
  TASK_PROPOSITION_COMPLETE,
} from './modules/Investments/Projects/state'
import * as investmentProjectTasks from './modules/Investments/Projects/tasks'

import {
  TASK_GET_LATEST_EXPORT_WINS,
  TASK_GET_PROJECT_WON_COUNT,
} from './modules/Companies/CompanyOverview/TableCards/state'
import * as overviewCardTasks from './modules/Companies/CompanyOverview/TableCards/tasks'

import { TASK_GET_COMPANY_OVERVIEW_ACTIVITY } from './modules/Companies/CompanyOverview/TableCards/ActivityCards/state'
import { getCompanyOverviewActivities } from './modules/Companies/CompanyOverview/TableCards/ActivityCards/tasks'
import {
  TASK_SEARCH_COMPANY,
  TASK_CREATE_INVESTMENT_PROJECT,
  TASK_GET_COMPANY_INVESTMENT_COUNT,
  TASK_GET_INVESTMENT_PROJECT_INITIAL_VALUES,
} from '../apps/investments/client/projects/create/state'
import * as createInvestmentProjectTasks from '../apps/investments/client/projects/create/tasks'

import { completeInvestmentPropositions } from '../client/modules/Investments/Projects/tasks'

import {
  TASK_CREATE_LARGE_CAPITAL_PROFILE,
  TASK_UPDATE_LARGE_CAPITAL_PROFILE,
} from './modules/Companies/CompanyInvestments/LargeCapitalProfile/state'
import * as largeCapitalProfileTasks from './modules/Companies/CompanyInvestments/LargeCapitalProfile/tasks'

import * as myInvestmentProjects from './components/MyInvestmentProjects/tasks'
import { TASK_GET_MY_INVESTMENTS_LIST } from './components/MyInvestmentProjects/state'

import * as personalisedDashboard from './components/PersonalisedDashboard/tasks'
import {
  TASK_CHECK_FOR_INVESTMENTS,
  TASK_DATA_HUB_FEED,
  TASK_CHECK_FOR_MY_TASKS,
} from './components/PersonalisedDashboard/state'

import { fetchOutstandingPropositions } from './components/InvestmentReminders/tasks'
import { TASK_GET_OUTSTANDING_PROPOSITIONS } from './components/InvestmentReminders/state'
import { fetchReminderSummary } from './components/NotificationAlert/tasks'
import { TASK_GET_REMINDER_SUMMARY } from './components/NotificationAlert/state'

import { TASK_GET_TYPEAHEAD_OPTIONS } from './components/Typeahead/state'

import * as exportsEdit from './modules/Companies/CompanyExports/tasks.js'

import {
  saveContact,
  redirectToContactForm,
} from './components/ContactForm/tasks'
import {
  getContacts,
  getContactsMetadata,
} from './modules/Contacts/CollectionList/tasks'
import { getFiles } from './modules/Files/CollectionList/tasks'
import { createFile } from './modules/Files/CreateFile/tasks.js'
import { deleteFile } from './modules/Files/DeleteFile/tasks.js'
import {
  getInteractions,
  getInteractionsMetadata,
} from './modules/Interactions/CollectionList/tasks'

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

import { TASK_GET_FILES_LIST } from './modules/Files/CollectionList/state'
import { TASK_CREATE_FILE } from './modules/Files/CreateFile/state'
import { TASK_DELETE_FILE } from './modules/Files/DeleteFile/state'

import {
  TASK_GET_INTERACTIONS_LIST,
  TASK_GET_INTERACTIONS_ADVISER_NAME,
  TASK_GET_INTERACTIONS_COMPANY_NAME,
  TASK_GET_INTERACTIONS_METADATA,
  TASK_GET_INTERACTIONS_TEAM_NAME,
} from './modules/Interactions/CollectionList/state'

import * as reminders from '../client/modules/Reminders/tasks'
import * as reminderSettings from '../client/modules/Reminders/Settings/tasks'
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
  TASK_SAVE_MY_TASKS_DUE_DATE_APPROACHING_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_TASK_AMENDED_BY_OTHERS_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_OVERDUE_REMINDER_SUBSCRIPTIONS,
  TASK_GET_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS,
  TASK_DELETE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
  TASK_GET_NEXT_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER,
  TASK_GET_TASK_AMENDED_BY_OTHERS_REMINDERS,
  TASK_DELETE_TASK_AMENDED_BY_OTHERS_REMINDER,
  TASK_GET_NEXT_TASK_AMENDED_BY_OTHERS_REMINDER,
  TASK_GET_TASK_OVERDUE_REMINDERS,
  TASK_DELETE_TASK_OVERDUE_REMINDER,
  TASK_GET_NEXT_TASK_OVERDUE_REMINDER,
  TASK_GET_TASK_COMPLETED_REMINDERS,
  TASK_DELETE_TASK_COMPLETED_REMINDER,
  TASK_GET_NEXT_TASK_COMPLETED_REMINDER,
  TASK_SAVE_COMPLETED_REMINDER_SUBSCRIPTIONS,
} from '../client/modules/Reminders/state'

import resourceTasks from '../client/components/Resource/tasks'
import { getTypeaheadOptions } from '../client/components/Typeahead/tasks'

import * as matchCompanyTasks from '../apps/companies/apps/match-company/client/tasks'
import { cannotFindMatchSubmit } from './modules/Companies/MatchCompany/tasks.js'

import * as companyListTasks from '../apps/company-lists/client/tasks'
import { editCompany } from '../apps/companies/apps/edit-company/client/tasks'
import { createList } from '../apps/company-lists/client/tasks.js'

import { TASK_GET_CONTACT_ACTIVITIES } from '../client/modules/Contacts/ContactActivity/state'
import { getContactActivities } from '../client/modules/Contacts/ContactActivity/tasks'
import { TASK_ARCHIVE_CONTACT } from '../client/modules/Contacts/ContactDetails/state'
import { archiveContact } from '../client/modules/Contacts/ContactDetails/tasks'
import { TASK_GET_USER_FEATURE_FLAGS } from './components/CheckUserFeatureFlags/state'
import { getUserFeatureFlags } from './components/CheckUserFeatureFlags/tasks'

import {
  TASK_ARCHIVE_INTERACTION,
  TASK_GET_INTERACTION,
} from './modules/Interactions/InteractionDetails/state'
import {
  archiveInteraction,
  getInteraction,
} from './modules/Interactions/InteractionDetails/tasks'
import { TASK_GET_ESS_INTERACTION_DETAILS } from './modules/Interactions/ESSInteractionDetails/state'

import { TASK_GET_COMPANY_DETAIL } from '../client/modules/Companies/CompanyDetails/state'
import { getCompanyDetails } from '../client/modules/Companies/CompanyDetails/tasks'

import { TASK_GET_EXPORT_DETAIL } from '../client/modules/ExportPipeline/ExportDetails/state'
import { getExportDetails } from '../client/modules/ExportPipeline/ExportDetails/tasks'

import { TASK_SAVE_EXPORT } from '../client/modules/ExportPipeline/ExportForm/state'
import { saveExport } from '../client/modules/ExportPipeline/ExportForm/tasks'
import { TASK_DELETE_EXPORT } from '../client/modules/ExportPipeline/ExportDelete/state'
import { deleteExport } from '../client/modules/ExportPipeline/ExportDelete/tasks'

import { TASK_GET_EXPORT_PIPELINE_LIST } from '../client/modules/ExportPipeline/ExportList/state'
import { getExportPipelineList } from '../client/modules/ExportPipeline/ExportList/task'
import { TASK_REDIRECT_TO_CONTACT_FORM } from './components/ContactForm/state'

import { getListsCompanyIsIn } from './components/CompanyLocalHeader/task'
import { TASK_GET_LISTS_COMPANY_IS_IN } from './components/CompanyLocalHeader/state'

import {
  TASK_CREATE_INVESTMENT_PROPOSITION,
  TASK_ABANDON_INVESTMENT_PROPOSITION,
  TASK_DELETE_PROPOSITION_DOCUMENT,
  TASK_ADD_PROPOSITION_DOCUMENT,
} from './modules/Investments/Projects/Propositions/state'
import {
  createInvestmentProposition,
  abandonInvestmentProposition,
  deletePropositionDocument,
  addPropositionDocument,
} from './modules/Investments/Projects/Propositions/tasks'

import { TASK_GET_DNB_FAMILY_TREE } from './modules/Companies/CompanyHierarchy/state'
import { getDnbFamilyTree } from './modules/Companies/CompanyHierarchy/tasks'

import {
  TASK_GET_GLOBAL_HQ_LIST,
  TASK_SET_GLOBAL_HQ,
  TASK_REMOVE_GLOBAL_HQ,
} from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/state'
import {
  getGlobalHeadquartersCollection,
  setGlobalHq,
  removeGlobalHq,
} from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/tasks'

import { TASK_GET_SUBSIDIARY_LIST } from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary/state'
import { getSubsidiaryCollection } from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary/tasks'

import {
  TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER,
  TASK_EDIT_PROJECT_TEAM_MEMBERS,
  TASK_SAVE_INVESTMENT_PROJECT_MANAGERS,
} from './modules/Investments/Projects/Team/state'
import { updateTeamMembers } from './modules/Investments/Projects/Team/tasks'

import {
  TASK_ADD_PROJECT_DOCUMENT,
  TASK_DELETE_PROJECT_DOCUMENT,
} from './modules/Investments/Projects/Evidence/state'
import {
  addProjectDocument,
  deleteProjectDocument,
} from './modules/Investments/Projects/Evidence/tasks'

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

import {
  TASK_EDIT_OMIS_QUOTE_INFORMATION,
  TASK_EDIT_OMIS_INTERNAL_INFORMATION,
  TASK_RECONCILE_OMIS_PAYMENT,
  TASK_EDIT_INVOICE_DETAILS,
  TASK_EDIT_ORDER_BILLING_ADDRESS,
  TASK_EDIT_ORDER_VAT_STATUS,
  TASK_CANCEL_ORDER,
  TASK_EDIT_ORDER_ASSIGNEE_TIME,
  TASK_COMPLETE_ORDER,
  TASK_EDIT_ORDER_CONTACT,
  TASK_SAVE_ORDER_ASSIGNEES,
  TASK_SAVE_ORDER_SUBSCRIBERS,
  TASK_SET_LEAD_ADVISER,
  TASK_PREVIEW_QUOTE,
  TASK_CREATE_QUOTE,
  TASK_CANCEL_QUOTE,
} from './modules/Omis/state'
import {
  cancelOrder,
  completeOrder,
  savePayment,
  updateAssignees,
  updateOrder,
  saveOrderAssignees,
  saveOrderSubscribers,
  setLeadAdviser,
  previewQuote,
  createQuote,
  cancelQuote,
} from './modules/Omis/tasks'

import { TASK_GET_COMPANIES } from './modules/Omis/CreateOrder/CompanySelect/state'
import { getOmisCompanies } from './modules/Omis/CreateOrder/CompanySelect/tasks.js'
import { TASK_CREATE_ORDER } from './modules/Omis/CreateOrder/state'
import { createOrder } from './modules/Omis/CreateOrder/tasks'

import {
  saveTaskStatusActive,
  saveTaskStatusComplete,
  getTaskDetail,
  deleteTask,
} from './modules/Tasks/TaskDetails/tasks'
import {
  TASK_SAVE_STATUS_ACTIVE,
  TASK_SAVE_STATUS_COMPLETE,
  TASK_GET_TASK_DETAILS,
  TASK_DELETE,
} from './modules/Tasks/TaskDetails/state'
import { saveTaskDetail } from './modules/Tasks/TaskForm/tasks'
import { TASK_SAVE_TASK_DETAILS } from './modules/Tasks/TaskForm/state'

import {
  TASK_RESEND_EXPORT_WIN,
  TASK_GET_EXPORT_WINS_SAVE_FORM,
  TASK_GET_EXPORT_PROJECT,
  TASK_GET_EXPORT_WIN,
} from './modules/ExportWins/Form/state'
import {
  saveExportWin,
  resendExportWin,
  getExportProject,
  getExportWin,
} from './modules/ExportWins/Form/tasks'

import { getMyTasks } from './components/Dashboard/my-tasks/tasks'
import { TASK_GET_MY_TASKS } from './components/Dashboard/my-tasks/state'

import {
  TASK_GET_COMPANY_ACTIVITIES_NO_AS,
  TASK_GET_COMPANY_ACTIVITIES_METADATA,
  TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME,
  TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME,
  TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME,
} from './modules/Companies/CompanyActivity/state'
import {
  getCompanyActivities,
  getCompanyActivitiesMetadata,
} from './modules/Companies/CompanyActivity/tasks'

export const tasks = {
  'Create list': createList,
  'Edit company': editCompany,
  'Create company': createCompany,
  'Edit company list': companyListTasks.editCompanyList,
  'Match confirmation': matchCompanyTasks.onMatchSubmit,
  'Cannot find match': cannotFindMatchSubmit,
  'Submit merge request': matchCompanyTasks.submitMergeRequest,
  'Company lists': companyListsTasks.fetchCompanyLists,
  'Company list': companyListsTasks.fetchCompanyList,
  'Add or remove from list': companyListsTasks.addOrRemoveFromList,
  'Exports history': exportsHistoryTasks.fetchExportsHistory,
  Referrals: referralListTask,
  'Update Lead ITA': manageAdviser.updateAdviser,
  'Get send referral initial values': referralsSendTasks.getInitialFormValues,
  'Save contact': saveContact,
  [TASK_SAVE_REFERRAL]: referralsSendTasks.saveReferral,
  [TASK_SAVE_ONE_LIST_DETAILS]: saveOneListDetails,
  [EXPORT_COUNTRIES_EDIT_NAME]: exportCountriesEditTasks.saveExportCountries,
  [TASK_GET_ACTIVE_EVENTS]: addInteractionFormTasks.fetchActiveEvents,
  [TASK_SAVE_INTERACTION]: addInteractionFormTasks.saveInteraction,
  [TASK_GET_INTERACTION_INITIAL_VALUES]:
    addInteractionFormTasks.getInitialFormValues,
  [TASK_UPDATE_STAGE]: investmentProjectTasks.updateProjectStage,
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
  [TASK_GET_EYB_LEAD]: investmentEYBLeadTasks.getEYBLead,
  [TASK_GET_EYB_LEADS_LIST]: investmentEYBLeadTasks.getEYBLeads,
  [TASK_GET_EYB_LEADS_METADATA]:
    investmentEYBLeadTasks.loadEYBLeadFilterOptions,
  [TASK_GET_PROFILES_LIST]: investmentProfilesTasks.getLargeCapitalProfiles,
  [TASK_GET_PROJECTS_LIST]: investmentProjectTasks.getProjects,
  [TASK_GET_PROJECT_WON_COUNT]: overviewCardTasks.getProjectsWon,
  [TASK_GET_LATEST_EXPORT_WINS]: overviewCardTasks.getLatestExportWins,
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
  [TASK_GET_COMPANIES_ADVISER_NAME]: getAdviserNames,
  [TASK_GET_INVESTMENTS_PROJECTS_METADATA]:
    investmentProjectTasks.getProjectMetadata,
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
  [TASK_GET_FILES_LIST]: getFiles,
  [TASK_CREATE_FILE]: createFile,
  [TASK_DELETE_FILE]: deleteFile,
  [TASK_GET_CONTACTS_METADATA]: getContactsMetadata,
  [TASK_GET_INTERACTIONS_LIST]: getInteractions,
  [TASK_GET_INTERACTIONS_ADVISER_NAME]: getAdviserNames,
  [TASK_GET_INTERACTIONS_COMPANY_NAME]: getCompanyNames,
  [TASK_GET_INTERACTIONS_METADATA]: getInteractionsMetadata,
  [TASK_GET_COMPANY_ACTIVITIES_NO_AS]: getCompanyActivities,
  [TASK_GET_COMPANY_ACTIVITIES_METADATA]: getCompanyActivitiesMetadata,
  [TASK_GET_COMPANY_ACTIVITIES_ADVISER_NAME]: getAdviserNames,
  [TASK_GET_COMPANY_ACTIVITIES_COMPANY_NAME]: getCompanyNames,
  [TASK_GET_COMPANY_ACTIVITIES_TEAM_NAME]: getTeamNames,
  [TASK_GET_EVENTS_LIST]: getEvents,
  [TASK_GET_EVENTS_METADATA]: getEventsMetadata,
  [TASK_GET_EVENTS_ORGANISER_NAME]: getAdviserNames,
  [TASK_GET_EVENT_DETAILS]: getEventDetails,
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
  [TASK_SAVE_ORDER_ASSIGNEES]: saveOrderAssignees,
  [TASK_SAVE_ORDER_SUBSCRIBERS]: saveOrderSubscribers,
  [TASK_GET_SUBSCRIPTION_SUMMARY]: reminderSettings.getSubscriptionSummary,
  [TASK_GET_ELD_REMINDER_SUBSCRIPTIONS]: reminderSettings.getEldSubscriptions,
  [TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS]: reminderSettings.saveEldSubscriptions,
  [TASK_GET_NRI_REMINDER_SUBSCRIPTIONS]: reminderSettings.getNriSubscriptions,
  [TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS]: reminderSettings.saveNriSubscriptions,
  [TASK_GET_EXPORT_NRI_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.getNriExportSubscriptions,
  [TASK_SAVE_EXPORT_NRI_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.saveNriExportSubscriptions,
  [TASK_GET_EXPORT_NI_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.getNIExportSubscriptions,
  [TASK_SAVE_EXPORT_NI_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.saveNIExportSubscriptions,
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
  [TASK_GET_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS]:
    reminders.getTaskAssignedToMeFromOthersReminders,
  [TASK_DELETE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER]:
    reminders.deleteTaskAssignedToMeFromOthersReminder,
  [TASK_GET_NEXT_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER]:
    reminders.getNextTaskAssignedToMeFromOthersReminder,
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
  [TASK_DELETE_PROPOSITION_DOCUMENT]: deletePropositionDocument,
  [TASK_EDIT_OMIS_QUOTE_INFORMATION]: updateOrder,
  [TASK_EDIT_OMIS_INTERNAL_INFORMATION]: updateOrder,
  [TASK_GET_TASK_DETAILS]: getTaskDetail,
  [TASK_GET_INVESTMENT_PROJECT]: investmentProjectTasks.getInvestmentProject,
  [TASK_GET_EYB_LEAD]: investmentEYBLeadTasks.getEYBLead,
  [TASK_SAVE_STATUS_COMPLETE]: saveTaskStatusComplete,
  [TASK_SAVE_STATUS_ACTIVE]: saveTaskStatusActive,
  [TASK_DELETE]: deleteTask,
  [TASK_RECONCILE_OMIS_PAYMENT]: savePayment,
  [TASK_SAVE_TASK_DETAILS]: saveTaskDetail,
  [TASK_EDIT_INVOICE_DETAILS]: updateOrder,
  [TASK_EDIT_ORDER_BILLING_ADDRESS]: updateOrder,
  [TASK_EDIT_ORDER_VAT_STATUS]: updateOrder,
  [TASK_CANCEL_ORDER]: cancelOrder,
  [TASK_GET_EXPORT_WINS_SAVE_FORM]: saveExportWin,
  [TASK_EDIT_ORDER_ASSIGNEE_TIME]: updateAssignees,
  [TASK_SAVE_MY_TASKS_DUE_DATE_APPROACHING_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.saveUpcomingDueDateExportSubscriptions,
  [TASK_COMPLETE_ORDER]: completeOrder,
  [TASK_SAVE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.saveTaskAssignedToMeFromOthersExportSubscriptions,
  [TASK_EDIT_ORDER_CONTACT]: updateOrder,
  [TASK_SAVE_OVERDUE_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.saveTaskOverdueSubscriptions,
  [TASK_GET_TASK_OVERDUE_REMINDERS]: reminders.getTaskOverdueReminders,
  [TASK_DELETE_TASK_OVERDUE_REMINDER]: reminders.deleteTaskOverdueReminder,
  [TASK_GET_NEXT_TASK_OVERDUE_REMINDER]: reminders.getNextTaskOverdueReminder,
  [TASK_GET_TASK_COMPLETED_REMINDERS]: reminders.getTaskCompletedReminders,
  [TASK_DELETE_TASK_COMPLETED_REMINDER]: reminders.deleteTaskCompletedReminder,
  [TASK_GET_NEXT_TASK_COMPLETED_REMINDER]:
    reminders.getNextTaskCompletedReminder,
  [TASK_SET_LEAD_ADVISER]: setLeadAdviser,
  [TASK_SAVE_COMPLETED_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.saveTaskCompletedSubscriptions,
  [TASK_GET_COMPANIES]: getOmisCompanies,
  [TASK_CREATE_ORDER]: createOrder,
  [TASK_CHECK_FOR_MY_TASKS]: personalisedDashboard.checkForMyTasks,
  [TASK_GET_MY_TASKS]: getMyTasks,
  [TASK_GET_TASK_AMENDED_BY_OTHERS_REMINDERS]:
    reminders.getTaskAmendedByOthersReminders,
  [TASK_DELETE_TASK_AMENDED_BY_OTHERS_REMINDER]:
    reminders.deleteTaskAmendedByOthersReminder,
  [TASK_GET_NEXT_TASK_AMENDED_BY_OTHERS_REMINDER]:
    reminders.getNextTaskAmendedByOthersReminder,
  [TASK_SAVE_TASK_AMENDED_BY_OTHERS_REMINDER_SUBSCRIPTIONS]:
    reminderSettings.saveTaskAmendedByOthersSubscriptions,
  [TASK_GET_INTERACTION]: getInteraction,
  [TASK_PROPOSITION_COMPLETE]: completeInvestmentPropositions,
  [TASK_GET_EXPORT_PROJECT]: getExportProject,
  [TASK_GET_EXPORT_WIN]: getExportWin,
  [TASK_GET_GLOBAL_ULTIMATE]: businessDetails.getGlobalUltimate,
  [TASK_SET_GLOBAL_HQ]: setGlobalHq,
  [TASK_REMOVE_GLOBAL_HQ]: removeGlobalHq,
  [TASK_PREVIEW_QUOTE]: previewQuote,
  [TASK_CREATE_QUOTE]: createQuote,
  [TASK_CANCEL_QUOTE]: cancelQuote,
  [TASK_ADD_PROJECT_DOCUMENT]: addProjectDocument,
  [TASK_RESEND_EXPORT_WIN]: resendExportWin,
  [TASK_ADD_PROPOSITION_DOCUMENT]: addPropositionDocument,
  [TASK_GET_COMPANY_OVERVIEW_ACTIVITY]: getCompanyOverviewActivities,
}
