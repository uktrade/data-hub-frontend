import DropdownMenu from './components/DropdownMenu/ConnectedDropdownMenu'
import tasks from './components/Task/reducer'

import { ID as COMPANY_LISTS_STATE_ID } from './components/CompanyLists/state'
import companyListsReducer from './components/CompanyLists/reducer'

import { ID as REFERRALS_DETAILS_STATE_ID } from '../apps/companies/apps/referrals/details/client/state'
import referralsReducer from '../apps/companies/apps/referrals/details/client/reducer'

import { ID as REFERRALS_SEND_ID } from '../apps/companies/apps/referrals/send-referral/client/state'
import referralsSendReducer from '../apps/companies/apps/referrals/send-referral/client/reducer'

import { ID as EXPORTS_HISTORY_ID } from '../apps/companies/apps/exports/client/ExportsHistory/state'
import exportsHistoryReducer from '../apps/companies/apps/exports/client/ExportsHistory/reducer'

import TabNav from './components/TabNav'

import ReferralList from './components/ReferralList'

import ToggleSection from './components/ToggleSection/BaseToggleSection'

import Typeahead from './components/Typeahead/Typeahead'

import FieldAddAnother from './components/Form/elements/FieldAddAnother/FieldAddAnother'

import { ID as EXPORTS_WINS_ID } from '../apps/companies/apps/exports/client/ExportWins/state'
import exportWinsReducer from '../apps/companies/apps/exports/client/ExportWins/reducer'

import * as addCompanyState from '../apps/companies/apps/add-company/client/state'
import addCompanyPostcodeToRegionReducer from '../apps/companies/apps/add-company/client/reducer'

import { ID as INVESTMENT_OPPORTUNITIES_LIST_ID } from '../apps/investments/client/opportunities/List/state'
import investmentOpportunitiesListReducer from '../apps/investments/client/opportunities/List/reducer'

import { ID as INVESTMENT_OPPORTUNITIES_DETAILS_ID } from '../apps/investments/client/opportunities/Details/state'
import investmentOpportunitiesDetailsReducer from '../apps/investments/client/opportunities/Details/reducer'

import { ID as DNB_CHECK_ID } from '../apps/companies/apps/business-details/client/state'
import dnbCheckReducer from '../apps/companies/apps/business-details/client/reducer'

import { ID as INVESTMENT_PROFILES_ID } from '../apps/investments/client/profiles/state'
import investmentProfileReducer from '../apps/investments/client/profiles/reducer'

import {
  INVESTMENT_PROJECTS_ID,
  COMPANY_PROJECTS_LIST_ID,
} from '../apps/investments/client/projects/state'

import {
  OVERVIEW_COMPANY_EXPORT_WINS_LIST_ID,
  OVERVIEW_COMPANY_PROJECTS_LIST_ID,
} from '../apps/companies/apps/company-overview/overview-table-cards/state'

import investmentProjectsReducer from '../apps/investments/client/projects/reducer'
import overviewInvestmentProjectReducer from '../apps/companies/apps/company-overview/overview-table-cards/reducer'
import overviewExportWinsReducer from '../apps/companies/apps/company-overview/overview-table-cards/exportStatusReducer'

import { ID as COMPANIES_ID } from './modules/Companies/CollectionList/state'
import companiesReducer from './modules/Companies/CollectionList/reducer'

import {
  DATA_HUB_FEED_ID,
  ID as CHECK_FOR_INVESTMENTS_ID,
} from './components/PersonalisedDashboard/state'
import personalDashboardReducer from './components/PersonalisedDashboard/reducer'

import { ID as MY_INVESTMENT_PROJECTS_ID } from './components/MyInvestmentProjects/state'
import myInvestmentProjectsReducer from './components/MyInvestmentProjects/reducer'

import {
  CREATE_INVESTMENT_PROJECT_ID,
  COMPANY_INVESTMENT_COUNT_ID,
} from '../apps/investments/client/projects/create/state.js'
import createInvestmentProjectsReducer from '../apps/investments/client/projects/create/reducer.js'

import { ID as INVESTMENT_REMINDERS_ID } from './components/InvestmentReminders/state'
import investmentRemindersReducer from './components/InvestmentReminders/reducer'
import { ID as REMINDER_SUMMARY_ID } from './components/NotificationAlert/state'
import reminderSummaryReducer from './components/NotificationAlert/reducer'
import {
  CONTACTS_LIST_ID,
  COMPANY_CONTACTS_LIST_ID,
} from './modules/Contacts/CollectionList/state'
import contactsReducer from './modules/Contacts/CollectionList/reducer'

import { ID as INTERACTIONS_ID } from './modules/Interactions/CollectionList/state'
import interactionsReducer from './modules/Interactions/CollectionList/reducer'

import { ID as COMPANY_ACTIVITIES_ID } from './components/ActivityFeed/CollectionList/state'
import companyActivitiesReducer from './components/ActivityFeed/CollectionList/reducer'
import { ID as EVENTS_DETAILS_ID } from './modules/Events/EventDetails/state'
import eventDetailsReducer from './modules/Events/EventDetails/reducer'

import { ID as EVENTS_AVENTRI_DETAILS_ID } from './modules/Events/EventAventriDetails/state'
import eventAventriDetailsReducer from './modules/Events/EventAventriDetails/reducer'

import { ID as EVENTS_AVENTRI_REGISTRATION_STATUS_ID } from './modules/Events/EventAventriRegistrationStatus/state'
import eventAventriRegistrationStatusReducer from './modules/Events/EventAventriRegistrationStatus/reducer'

import { ID as INTERACTION_ESS_DETAILS_ID } from './modules/Interactions/ESSInteractionDetails/state'
import interactionEssDetailsReducer from './modules/Interactions/ESSInteractionDetails/reducer'

import { ID as EVENTS_ID } from './modules/Events/CollectionList/state'
import eventsReducer from './modules/Events/CollectionList/reducer'

import { SEARCH_ATTENDEE_ID } from './modules/Events/AttendeeSearch/state'
import attendeeSearchReducer from './modules/Events/AttendeeSearch/reducer'

import {
  ORDERS_LIST_ID,
  COMPANY_ORDERS_LIST_ID,
  ORDERS_RECONCILIATION_LIST_ID,
} from './modules/Omis/CollectionList/state'
import ordersReducer from './modules/Omis/CollectionList/reducer'

import RoutedInput from './components/RoutedInput'

import Resource from './components/Resource/Resource'

import { ContactForm } from './components/ContactForm'
import Form from './components/Form'

import { ID as FLASH_MESSAGE_ID } from './components/LocalHeader/state'
import flashMessageReducer from './components/LocalHeader/reducer'

import { ID as CONTACT_ACTIVITIES_ID } from '../client/modules/Contacts/ContactActivity/state'
import contactActivitiesReducer from '../client/modules/Contacts/ContactActivity/reducer'

import { ID as REMINDERS_ID } from './modules/Reminders/state'
import remindersReducer from './modules/Reminders/reducer'

import { ID as COMPANY_DETAIL_ID } from './modules/Companies/CompanyDetails/state'
import companyDetailReducer from './modules/Companies/CompanyDetails/reducer'

import { ID as EXPORT_DETAIL_ID } from './modules/ExportPipeline/ExportDetails/state'
import exportDetailReducer from './modules/ExportPipeline/ExportDetails/reducer'

import { ID as EXPORT_PIPELINE_LIST_ID } from './modules/ExportPipeline/ExportList/state'
import exportPipelineListReducer from './modules/ExportPipeline/ExportList/reducer'

import { ID as COMPANY_LISTS_IN_ID } from './components/CompanyLocalHeader/state'
import companyListsInReducer from './components/CompanyLocalHeader/reducer'

import { ID as COMPANY_HIERARCHY_ID } from './modules/Companies/CompanyHierarchy/state'
import companyHierarchyReducer from './modules/Companies/CompanyHierarchy/reducer'

import { ID as LINK_GLOBAL_HQ_ID } from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/state'
import linkGlobalHQReducer from './modules/Companies/CompanyBusinessDetails/LinkGlobalHQ/reducer'

import { ID as LINK_SUBSIDIARY_ID } from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary/state'
import linkSubsidiaryReducer from './modules/Companies/CompanyBusinessDetails/LinkSubsidiary/reducer'

import { ID as OBJECTIVE_ID } from './modules/Companies/AccountManagement/state'
import objectiveReducer from './modules/Companies/AccountManagement/reducer'

import {
  NON_FDI_LIST_ID,
  RECIPIENT_COMPANY_LIST_ID,
} from './modules/Investments/Projects/state'
import nonFdiReducer from './modules/Investments/Projects/reducer'
import recipientCompanyReducer from './modules/Investments/Projects/recipientCompanyReducer'

const parseProps = (domNode) => {
  if (!domNode) {
    return {
      modulePermissions: [],
      currentAdviserId: '',
      currentAdviserName: '',
      activeFeatures: null,
      activeFeatureGroups: null,
      userPermissions: [],
    }
  }
  return 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
}

const appWrapper = document.getElementById('react-app')

const {
  modulePermissions,
  currentAdviserId,
  currentAdviserName,
  activeFeatures,
  activeFeatureGroups,
  userPermissions,
} = parseProps(appWrapper)

export const reducers = {
  currentAdviserId: () => currentAdviserId,
  currentAdviserName: () => currentAdviserName,
  activeFeatures: () => activeFeatures,
  activeFeatureGroups: () => activeFeatureGroups,
  modulePermissions: () => modulePermissions,
  userPermissions: () => userPermissions,
  tasks,
  [FLASH_MESSAGE_ID]: flashMessageReducer,
  [COMPANY_LISTS_STATE_ID]: companyListsReducer,
  [COMPANIES_ID]: companiesReducer,
  [EXPORTS_HISTORY_ID]: exportsHistoryReducer,
  [REFERRALS_DETAILS_STATE_ID]: referralsReducer,
  [REFERRALS_SEND_ID]: referralsSendReducer,
  [EXPORTS_WINS_ID]: exportWinsReducer,
  [addCompanyState.ID]: addCompanyPostcodeToRegionReducer,
  ...TabNav.reducerSpread,
  ...ReferralList.reducerSpread,
  ...DropdownMenu.reducerSpread,
  ...ToggleSection.reducerSpread,
  ...Typeahead.reducerSpread,
  ...RoutedInput.reducerSpread,
  ...Resource.reducerSpread,
  ...ContactForm.reducerSpread,
  ...Form.reducerSpread,
  ...FieldAddAnother.reducerSpread,
  // A reducer is required to be able to set a preloadedState parameter
  referrerUrl: (state = {}) => state,
  [DNB_CHECK_ID]: dnbCheckReducer,
  [INVESTMENT_OPPORTUNITIES_LIST_ID]: investmentOpportunitiesListReducer,
  [INVESTMENT_OPPORTUNITIES_DETAILS_ID]: investmentOpportunitiesDetailsReducer,
  [INVESTMENT_PROFILES_ID]: investmentProfileReducer,
  [INVESTMENT_PROJECTS_ID]: investmentProjectsReducer,
  [COMPANY_PROJECTS_LIST_ID]: investmentProjectsReducer,
  [OVERVIEW_COMPANY_EXPORT_WINS_LIST_ID]: overviewExportWinsReducer,
  [OVERVIEW_COMPANY_PROJECTS_LIST_ID]: overviewInvestmentProjectReducer,
  [MY_INVESTMENT_PROJECTS_ID]: myInvestmentProjectsReducer,
  [CREATE_INVESTMENT_PROJECT_ID]: createInvestmentProjectsReducer,
  [COMPANY_INVESTMENT_COUNT_ID]: createInvestmentProjectsReducer,
  [CHECK_FOR_INVESTMENTS_ID]: personalDashboardReducer,
  [DATA_HUB_FEED_ID]: personalDashboardReducer,
  [INVESTMENT_REMINDERS_ID]: investmentRemindersReducer,
  [REMINDER_SUMMARY_ID]: reminderSummaryReducer,
  [CONTACTS_LIST_ID]: contactsReducer,
  [CONTACT_ACTIVITIES_ID]: contactActivitiesReducer,
  [COMPANY_CONTACTS_LIST_ID]: contactsReducer,
  [INTERACTIONS_ID]: interactionsReducer,
  [COMPANY_ACTIVITIES_ID]: companyActivitiesReducer,
  [EVENTS_ID]: eventsReducer,
  [EVENTS_DETAILS_ID]: eventDetailsReducer,
  [EVENTS_AVENTRI_DETAILS_ID]: eventAventriDetailsReducer,
  [EVENTS_AVENTRI_REGISTRATION_STATUS_ID]:
    eventAventriRegistrationStatusReducer,
  [INTERACTION_ESS_DETAILS_ID]: interactionEssDetailsReducer,
  [SEARCH_ATTENDEE_ID]: attendeeSearchReducer,
  [ORDERS_LIST_ID]: ordersReducer,
  [COMPANY_ORDERS_LIST_ID]: ordersReducer,
  [ORDERS_RECONCILIATION_LIST_ID]: ordersReducer,
  [REMINDERS_ID]: remindersReducer,
  [COMPANY_DETAIL_ID]: companyDetailReducer,
  [EXPORT_DETAIL_ID]: exportDetailReducer,
  [EXPORT_PIPELINE_LIST_ID]: exportPipelineListReducer,
  [COMPANY_LISTS_IN_ID]: companyListsInReducer,
  [COMPANY_HIERARCHY_ID]: companyHierarchyReducer,
  [LINK_GLOBAL_HQ_ID]: linkGlobalHQReducer,
  [LINK_SUBSIDIARY_ID]: linkSubsidiaryReducer,
  [OBJECTIVE_ID]: objectiveReducer,
  [NON_FDI_LIST_ID]: nonFdiReducer,
  [RECIPIENT_COMPANY_LIST_ID]: recipientCompanyReducer,
}
