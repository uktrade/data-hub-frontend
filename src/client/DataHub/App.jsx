import React from 'react'
import ReactDOM from 'react-dom'

import * as Sentry from '@sentry/browser'
import * as ReactSentry from '@sentry/react'
import { ErrorBoundary } from 'react-error-boundary'

import { default as DataHubHeaderWrapper } from '../components/DataHubHeader/Wrapper.jsx'
import { createProvider } from '../createProvider.jsx'
import AddCompanyForm from '../../apps/companies/apps/add-company/client/AddCompanyForm.jsx'
import InteractionDetailsForm from '../../apps/interactions/apps/details-form/client/InteractionDetailsForm.jsx'
import EditCompanyForm from '../../apps/companies/apps/edit-company/client/EditCompanyForm.jsx'
import FindCompany from '../../apps/companies/apps/match-company/client/FindCompany.jsx'
import DeleteCompanyList from '../../apps/company-lists/client/DeleteCompanyList.jsx'
import MatchConfirmation from '../../apps/companies/apps/match-company/client/MatchConfirmation.jsx'
import EditCompanyList from '../../apps/company-lists/client/EditCompanyList.jsx'
import CreateListForm from '../../apps/company-lists/client/CreateListForm.jsx'
import ManageAdviser from '../../apps/companies/apps/advisers/client/ManageAdviser.jsx'
import FlashMessages from '../components/LocalHeader/FlashMessages.jsx'
import PersonalisedDashboard from '../components/PersonalisedDashboard/index.jsx'
import InvestmentProjectForm from '../../apps/investments/client/projects/create/InvestmentProjectForm.jsx'
import InteractionDetails from '../modules/Interactions/InteractionDetails/index.jsx'
import PropositionDetails from '../modules/Investments/Projects/Propositions/PropositionDetails.jsx'

import Footer from '../components/Footer/index.jsx'

import ContactForm from '../components/ContactForm/index.jsx'

import AddRemoveFromListForm from '../components/CompanyLists/AddRemoveFromListForm.jsx'

import Routes from '../routes.js'

import ErrorFallback from '../components/ErrorFallback/index.jsx'

import { tasks } from '../tasks.js'

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
        <Mount selector="#manage-adviser">
          {(props) => (
            <ManageAdviser {...props} csrfToken={globalProps.csrfToken} />
          )}
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
        <Mount selector="#contact-form">
          {(props) => <ContactForm {...props} id="contact-form" />}
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
