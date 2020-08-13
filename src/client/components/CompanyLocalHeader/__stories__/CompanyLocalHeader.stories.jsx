import React from 'react'
import { createStore, combineReducers } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'

import dnBGlobalUltimate from '../../../../../test/sandbox/fixtures/v4/company/company-dnb-global-ultimate.json'
import { companies, dashboard } from '../../../../lib/urls'
import CompanyLocalHeader from 'CompanyLocalHeader'
import ConnectedDropdownMenu from '../../../../client/components/DropdownMenu/ConnectedDropdownMenu'
import exampleReadme from './example.md'
import usageReadme from './usage.md'

const store = createStore(combineReducers(ConnectedDropdownMenu.reducerSpread))

storiesOf('Company Local Header', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <Provider store={store}>
      <Router>
        <CompanyLocalHeader
          breadcrumbs={[
            { link: dashboard(), text: 'Home' },
            { link: companies.index(), text: 'Companies' },
            {
              link: companies.detail(dnBGlobalUltimate.id),
              text: dnBGlobalUltimate.name,
            },
            { text: 'Activity Feed' },
          ]}
          flashMessages={{
            'success:with-body': [
              {
                heading: 'Business details verified.',
                body:
                  'Thanks for helping to improve the quality of records on Data Hub!',
                id: 'message-company-matched',
              },
            ],
          }}
          company={{
            ...dnBGlobalUltimate,
            ...{
              hasManagedAccountDetails: true,
              archived: true,
              pending_dnb_investigation: true,
              isUltimate: true,
              archived_on: '2019-06-12T14:19:05.473413Z',
              archived_reason: 'Client cancelled',
            },
          }}
          dnbRelatedCompaniesCount={3}
        />
      </Router>
    </Provider>
  ))
