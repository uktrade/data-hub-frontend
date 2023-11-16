import React from 'react'
import ReactDOM from 'react-dom'
import { Switch } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import * as ReactSentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { ErrorBoundary } from 'react-error-boundary'

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
import ManageAdviser from '../apps/companies/apps/advisers/client/ManageAdviser'
import CompanyBusinessDetails from '../apps/companies/apps/business-details/client/CompanyBusinessDetails'
import CompanyOverview from '../apps/companies/apps/company-overview/client/CompanyOverview'
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
import InvestmentProjectForm from '../apps/investments/client/projects/create/InvestmentProjectForm'
import Opportunity from '../apps/investments/client/opportunities/Details/Opportunity'
import CompaniesContactsCollection from '../client/modules/Contacts/CollectionList/CompanyContactsCollection.jsx'
import OpportunityChangeStatusForm from '../apps/investments/client/opportunities/Details/OpportunityChangeStatusForm.jsx'
import CreateUKInvestmentOpportunity from '../apps/investments/client/opportunities/Details/CreateUKInvestmentOpportunity'
import ContactActivity from './modules/Contacts/ContactActivity/ContactActivity'
import ContactLocalHeader from './components/ContactLocalHeader'
import ContactDetails from './modules/Contacts/ContactDetails/ContactDetails'
import ContactAuditHistory from './modules/Contacts/ContactAuditHistory/ContactAuditHistory'
import InteractionDetails from './modules/Interactions/InteractionDetails'
import ESSInteractionDetails from './modules/Interactions/ESSInteractionDetails'
import OrdersReconciliationCollection from './modules/Omis/CollectionList/OrdersReconciliationCollection'
import AttendeeSearch from './modules/Events/AttendeeSearch/AttendeeSearch'
import LargeCapitalProfile from './modules/Companies/CompanyInvestments/LargeCapitalProfile'
import CreateProposition from './modules/Investments/Projects/Propositions/CreateProposition'
import AbandonProposition from './modules/Investments/Projects/Propositions/AbandonProposition'
import PropositionDetails from './modules/Investments/Projects/Propositions/PropositionDetails'
import CompanyHierarchy from './modules/Companies/CompanyHierarchy'
import CompanyProjectsCollection from './modules/Companies/CompanyInvestments/CompanyProjectsCollection'
import AccountManagement from './modules/Companies/AccountManagement'

import Footer from '../client/components/Footer'

import ContactForm from '../client/components/ContactForm'
import { ProtectedRoute } from '../client/components'
import AddRemoveFromListForm from '../client/components/CompanyLists/AddRemoveFromListForm'

import routes from './routes'

import ErrorFallback from './components/ErrorFallback'

import { tasks } from './tasks'

import { store, history, sagaMiddleware } from './middleware'

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
        sagaMiddleware={sagaMiddleware}
        history={history}
        store={store}
        tasks={tasks}
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
        <Mount selector="#contact-activity">
          {(props) => <ContactActivity {...props} />}
        </Mount>
        <Mount selector="#contact-local-header">
          {(props) => <ContactLocalHeader {...props} />}
        </Mount>
        <Mount selector="#contact-details">
          {(props) => <ContactDetails {...props} />}
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
        <Mount selector="#account-management">
          {(props) => (
            <AccountManagement csrfToken={globalProps.csrfToken} {...props} />
          )}
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
