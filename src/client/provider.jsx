import _ from 'lodash'
import queryString from 'qs'
import React from 'react'
import { createBrowserHistory } from 'history'
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter,
} from 'connected-react-router'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import createSagaMiddleware from 'redux-saga'

import { MultiInstanceForm } from './components'
import DropdownMenu from './components/DropdownMenu/ConnectedDropdownMenu'
import tasks from './components/Task/reducer'
import rootSaga from './root-saga'

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

import { ID as EXPORTS_WINS_ID } from '../apps/companies/apps/exports/client/ExportWins/state'
import exportWinsReducer from '../apps/companies/apps/exports/client/ExportWins/reducer'

import * as addCompanyState from '../apps/companies/apps/add-company/client/state'
import addCompanyPostcodeToRegionReducer from '../apps/companies/apps/add-company/client/reducer'

import { ID as ONE_LIST_DETAILS_ID } from '../apps/companies/apps/edit-one-list/client/state'
import editOneListReducer from '../apps/companies/apps/edit-one-list/client/reducer'

import { ID as ADD_TO_PIPELINE_ID } from '../apps/my-pipeline/client/state'
import addToPipelineReducer from '../apps/my-pipeline/client/reducer'

import { ID as PIPELINE_LIST_ID } from './components/Pipeline/state'
import pipelineListReducer from './components/Pipeline/reducer'

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

import investmentProjectsReducer from '../apps/investments/client/projects/reducer'

import { ID as COMPANIES_ID } from './modules/Companies/CollectionList/state'
import companiesReducer from './modules/Companies/CollectionList/reducer'

import { ID as CHECK_FOR_INVESTMENTS_ID } from './components/PersonalisedDashboard/state'
import personalDashboardReducer from './components/PersonalisedDashboard/reducer'

import { ID as MY_INVESTMENT_PROJECTS_ID } from './components/MyInvestmentProjects/state'
import myInvestmentProjectsReducer from './components/MyInvestmentProjects/reducer'

import { ID as INVESTMENT_REMINDERS_ID } from './components/InvestmentReminders/state'
import investmentRemindersReducer from './components/InvestmentReminders/reducer'

import {
  CONTACTS_LIST_ID,
  COMPANY_CONTACTS_LIST_ID,
} from './modules/Contacts/CollectionList/state'
import contactsReducer from './modules/Contacts/CollectionList/reducer'

import { ID as INTERACTIONS_ID } from './modules/Interactions/CollectionList/state'
import interactionsReducer from './modules/Interactions/CollectionList/reducer'

import { ID as EVENTS_DETAILS_ID } from './modules/Events/EventDetails/state'
import eventDetailsReducer from './modules/Events/EventDetails/reducer'

import { ID as EVENTS_ID } from './modules/Events/CollectionList/state'
import eventsReducer from './modules/Events/CollectionList/reducer'

import {
  ORDERS_LIST_ID,
  COMPANY_ORDERS_LIST_ID,
} from './modules/Omis/CollectionList/state'
import ordersReducer from './modules/Omis/CollectionList/reducer'

import CreateUKInvestmentOpportunity from './components/CreateUKInvestmentOpportunity'

import RoutedInput from './components/RoutedInput'

import Resource from './components/Resource'

import { ContactForm } from './components/ContactForm'
import TaskForm from './components/Task/Form'
import TaskReactSelect from './components/Task/ReactSelect'

const sagaMiddleware = createSagaMiddleware()
const history = createBrowserHistory({
  // The baseURI is set to the <base/> tag by the spaFallbackSpread
  // middleware, which should be applied to each Express route where
  // react-router is expected to be used.
  basename: queryString.stringify(new URL(document.baseURI).pathname),
})

const parseProps = (domNode) => {
  if (!domNode) {
    return {
      modulePermissions: [],
      currentAdviserId: '',
    }
  }
  return 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
}

const appWrapper = document.getElementById('react-app')

const { modulePermissions, currentAdviserId } = parseProps(appWrapper)

const store = createStore(
  combineReducers({
    currentAdviserId: () => currentAdviserId,
    modulePermissions: () => modulePermissions,
    router: connectRouter(history),
    tasks,
    [COMPANY_LISTS_STATE_ID]: companyListsReducer,
    [COMPANIES_ID]: companiesReducer,
    [EXPORTS_HISTORY_ID]: exportsHistoryReducer,
    [REFERRALS_DETAILS_STATE_ID]: referralsReducer,
    [REFERRALS_SEND_ID]: referralsSendReducer,
    [EXPORTS_WINS_ID]: exportWinsReducer,
    [ONE_LIST_DETAILS_ID]: editOneListReducer,
    [addCompanyState.ID]: addCompanyPostcodeToRegionReducer,
    [ADD_TO_PIPELINE_ID]: addToPipelineReducer,
    [PIPELINE_LIST_ID]: pipelineListReducer,
    ...TabNav.reducerSpread,
    ...ReferralList.reducerSpread,
    ...MultiInstanceForm.reducerSpread,
    ...DropdownMenu.reducerSpread,
    ...ToggleSection.reducerSpread,
    ...RoutedInput.reducerSpread,
    ...CreateUKInvestmentOpportunity.reducerSpread,
    ...Resource.reducerSpread,
    ...ContactForm.reducerSpread,
    ...TaskForm.reducerSpread,
    ...TaskReactSelect.reducerSpread,
    // A reducer is required to be able to set a preloadedState parameter
    referrerUrl: (state = {}) => state,
    [DNB_CHECK_ID]: dnbCheckReducer,
    [INVESTMENT_OPPORTUNITIES_LIST_ID]: investmentOpportunitiesListReducer,
    [INVESTMENT_OPPORTUNITIES_DETAILS_ID]:
      investmentOpportunitiesDetailsReducer,
    [INVESTMENT_PROFILES_ID]: investmentProfileReducer,
    [INVESTMENT_PROJECTS_ID]: investmentProjectsReducer,
    [COMPANY_PROJECTS_LIST_ID]: investmentProjectsReducer,
    [MY_INVESTMENT_PROJECTS_ID]: myInvestmentProjectsReducer,
    [CHECK_FOR_INVESTMENTS_ID]: personalDashboardReducer,
    [INVESTMENT_REMINDERS_ID]: investmentRemindersReducer,
    [CONTACTS_LIST_ID]: contactsReducer,
    [COMPANY_CONTACTS_LIST_ID]: contactsReducer,
    [INTERACTIONS_ID]: interactionsReducer,
    [EVENTS_ID]: eventsReducer,
    [EVENTS_DETAILS_ID]: eventDetailsReducer,
    [ORDERS_LIST_ID]: ordersReducer,
    [COMPANY_ORDERS_LIST_ID]: ordersReducer,
  }),
  {
    referrerUrl: window.document.referrer,
  },
  composeWithDevTools(
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  )
)

const runMiddlewareOnce = _.once((tasks) => sagaMiddleware.run(rootSaga(tasks)))

/**
 * Provides state management and routing infrastructure required by the
 * stateful/routed components.
 * @param {Object} props
 * @param {Object} props.tasks - A map of _task_ names to _tasks_, if required
 * by the wrapped components.
 * @example
 * import ReferralList from 'components/ReferralList'
 * import dummyReferralListTask from 'components/ReferralList/task/dummy'
 *
 * // ReferralList is a stateful component,
 * // which also requires the Referrals task.
 * <DataHubProvider task={{ Referrals: dummyReferralListTask() }}>
 *    <ReferralList id="foo"/>
 * </DataHubProvider>
 */
export default class DataHubProvider extends React.Component {
  constructor(...args) {
    super(...args)
    // We only ever want to start the sagas once
    runMiddlewareOnce(this.props.tasks || {})
  }
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {this.props.children}
        </ConnectedRouter>
      </Provider>
    )
  }
}
