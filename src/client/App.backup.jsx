import React from 'react'
import ReactDOM from 'react-dom'

import * as Sentry from '@sentry/browser'
import * as ReactSentry from '@sentry/react'
import { ErrorBoundary } from 'react-error-boundary'

import { SearchLocalHeader } from './components'
import { default as DataHubHeaderWrapper } from './components/DataHubHeader/Wrapper'
import { createProvider } from './createProvider.jsx'
import AddCompanyForm from '../apps/companies/apps/add-company/client/AddCompanyForm'
import InteractionDetailsForm from '../apps/interactions/apps/details-form/client/InteractionDetailsForm'
import EditCompanyForm from '../apps/companies/apps/edit-company/client/EditCompanyForm'
import FindCompany from '../apps/companies/apps/match-company/client/FindCompany'
import DeleteCompanyList from '../apps/company-lists/client/DeleteCompanyList'
import MatchConfirmation from '../apps/companies/apps/match-company/client/MatchConfirmation'
import CannotFindMatch from '../apps/companies/apps/match-company/client/CannotFindMatch'
import EditCompanyList from '../apps/company-lists/client/EditCompanyList'
import CreateListForm from '../apps/company-lists/client/CreateListForm'
import ManageAdviser from '../apps/companies/apps/advisers/client/ManageAdviser'
import ReferralDetails from '../apps/companies/apps/referrals/details/client/ReferralDetails'
import SendReferralForm from '../apps/companies/apps/referrals/send-referral/client/SendReferralForm'
import InteractionReferralDetails from './modules/Interactions/InteractionDetails/InteractionReferralDetails.jsx'
import FlashMessages from './components/LocalHeader/FlashMessages.jsx'
import PersonalisedDashboard from './components/PersonalisedDashboard'
import InvestmentProjectForm from '../apps/investments/client/projects/create/InvestmentProjectForm'
import ContactActivity from './modules/Contacts/ContactActivity/ContactActivity'
import ContactLocalHeader from './components/ContactLocalHeader'
import ContactDetails from './modules/Contacts/ContactDetails/ContactDetails'
import ContactAuditHistory from './modules/Contacts/ContactAuditHistory/ContactAuditHistory'
import InteractionDetails from './modules/Interactions/InteractionDetails'
import PropositionDetails from './modules/Investments/Projects/Propositions/PropositionDetails'
import CompanyHierarchy from './modules/Companies/CompanyHierarchy'

import Footer from '../client/components/Footer'

import ContactForm from '../client/components/ContactForm'

import AddRemoveFromListForm from '../client/components/CompanyLists/AddRemoveFromListForm'

import Routes from './routes'

import ErrorFallback from './components/ErrorFallback'

import { tasks } from './tasks'

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
      Sentry.browserTracingIntegration({
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

const Provider = createProvider(tasks)

export const App = () => {
  return <Provider>kokocina</Provider>

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => ReactSentry.captureException(error)}
    >
      <Provider>
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
        <Mount selector="#manage-adviser">
          {(props) => (
            <ManageAdviser {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#send-referral-form">
          {(props) => (
            <SendReferralForm {...props} csrfToken={globalProps.csrfToken} />
          )}
        </Mount>
        <Mount selector="#referral-details">
          {(props) => <ReferralDetails {...props} />}
        </Mount>
        <Mount selector="#interaction-referral-details">
          {(props) => <InteractionReferralDetails {...props} />}
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
        <Mount selector="#dashboard-local-header">
          {(props) => (
            <SearchLocalHeader
              csrfToken={globalProps.csrfToken}
              flashMessage={props.flashMessage}
            />
          )}
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
        <Mount selector="#proposition-details">
          {(props) => <PropositionDetails {...props} />}
        </Mount>

        <Mount selector="#react-app">
          <Routes />
        </Mount>
      </Provider>
    </ErrorBoundary>
  )
}
