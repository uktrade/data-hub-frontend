import React from 'react'
import { Routes, Route } from 'react-router-dom'

import {
  assertSummaryTableStrict,
  assertBreadcrumbs,
} from '../../../../functional/cypress/support/assertions'
import CustomerFeedback from '../../../../../src/client/modules/ExportWins/CustomerFeedback'
import urls from '../../../../../src/lib/urls'
import { resolve } from '../../support/utils'

const toYesNo = (x) => (x ? 'Yes' : 'No')

const dummyExportWin = (prefix, booleans) => ({
  id: `${prefix}-id`,
  name_of_export: `${prefix}-name_of_export`,
  country: {
    name: `${prefix}-country`,
  },
  customer_response: {
    our_support: { name: `${prefix}-our_support` },
    access_to_contacts: { name: `${prefix}-access_to_contacts` },
    access_to_information: { name: `${prefix}-access_to_information` },
    improved_profile: { name: `${prefix}-improved_profile` },
    gained_confidence: { name: `${prefix}-gained_confidence` },
    developed_relationships: { name: `${prefix}-developed_relationships` },
    overcame_problem: { name: `${prefix}-overcame_problem` },

    involved_state_enterprise: booleans,
    interventions_were_prerequisite: booleans,
    support_improved_speed: booleans,
    has_enabled_expansion_into_new_market: booleans,
    has_enabled_expansion_into_existing_market: booleans,
    has_increased_exports_as_percent_of_turnover: booleans,
    company_was_at_risk_of_not_exporting: booleans,
    has_explicit_export_plans: booleans,

    last_export: { name: `${prefix}-last_export` },
    case_study_willing: booleans,
    marketing_source: { name: `${prefix}-marketing_source` },
  },
})

describe.skip('ExportWins/CustomerFeedback', () => {
  ;[
    {
      testTitle: 'All true',
      win: dummyExportWin('all-true', true),
      company: { id: '123' },
    },
    {
      testTitle: 'All false',
      win: dummyExportWin('all-false', false),
      company: { id: '123' },
    },
  ].forEach(({ testTitle, win, company }) => {
    it(testTitle, () => {
      // TODO: The CustomerFeedback component uses the useParams hook, therefore, we need
      // to wrap the component with a Route so the hook works.
      cy.mountWithProvider(
        <Routes>
          <Route
            path="/companies/:companyId/exportwins/:winId/customer-feedback"
            element={<CustomerFeedback />}
          />
        </Routes>,
        {
          tasks: {
            'Export Win': () => resolve({ after: 1, with: win }),
            Company: () => resolve({ after: 1, with: company }),
          },
          initialPath: `/companies/${company.id}/exportwins/${win.id}/customer-feedback`,
        }
      )

      assertBreadcrumbs({
        Home: '/',
        'Export wins': '/exportwins',
        [`${win.name_of_export} to ${win.country.name}`]:
          urls.companies.exportWins.editSummary(company.id, win.id),
        'Customer feedback': null,
      })

      cy.contains('h1', /^\s*Customer feedback\s*$/)

      assertSummaryTableStrict({
        caption: '1. To what extent did our support help in?',
        rows: [
          ['Securing the win overall?', win.customer_response.our_support.name],
          [
            'Gaining access to contacts?',
            win.customer_response.access_to_contacts.name,
          ],
          [
            'Getting information or improved understanding of this country?',
            win.customer_response.access_to_information.name,
          ],
          [
            'Improving your profile or credibility in the country?',
            win.customer_response.improved_profile.name,
          ],
          [
            'Having confidence to explore or expand in the country?',
            win.customer_response.gained_confidence.name,
          ],
          [
            'Developing or nurturing critical relationships?',
            win.customer_response.developed_relationships.name,
          ],
          [
            'Overcoming a problem in the country (eg legal, regulatory, commercial)',
            win.customer_response.overcame_problem.name,
          ],
        ],
      })

      assertSummaryTableStrict({
        caption: '2. About this win',
        rows: [
          [
            'The win involved a foreign government or state-owned enterprise (eg as an intermediary or facilitator)',
            toYesNo(win.customer_response.involved_state_enterprise),
          ],
          [
            'Our support was a prerequisite to generate this value',
            toYesNo(win.customer_response.interventions_were_prerequisite),
          ],
          [
            'Our support helped you achieve this win more quickly',
            toYesNo(win.customer_response.support_improved_speed),
          ],
          [
            'It enabled you to expand into a new market',
            toYesNo(
              win.customer_response.has_enabled_expansion_into_new_market
            ),
          ],
          [
            'It enabled you to maintain or expand in an existing market',
            toYesNo(
              win.customer_response.has_enabled_expansion_into_existing_market
            ),
          ],
          [
            'It enabled you to increase exports as a proportion of your turnover',
            toYesNo(
              win.customer_response.has_increased_exports_as_percent_of_turnover
            ),
          ],
          [
            "If you hadn't achieved this win, your company might have stopped exporting",
            toYesNo(win.customer_response.company_was_at_risk_of_not_exporting),
          ],
          [
            'Apart from this win, you already have plans to export in the next 12 months',
            toYesNo(win.customer_response.has_explicit_export_plans),
          ],
        ],
      })

      assertSummaryTableStrict({
        caption: '3. Your export experience',
        rows: [
          [
            'Apart from this win, when did your company last export goods or services?',
            win.customer_response.last_export.name,
          ],
        ],
      })

      assertSummaryTableStrict({
        caption: '4. Marketing',
        rows: [
          [
            'Would you be willing for DBT/Exporting is GREAT to feature your success in marketing materials?',
            toYesNo(win.customer_response.case_study_willing),
          ],
          [
            'How did you first hear about DBT(or it predecessor, DIT)?',
            win.customer_response.marketing_source.name,
          ],
        ],
      })

      // Assert captions appear in a particular order
      ;[
        '1. To what extent did our support help in?',
        '2. About this win',
        '3. Your export experience',
        '4. Marketing',
      ].forEach((heading, i) => {
        cy.get('caption').eq(i).should('have.text', heading)
      })

      // This little trick ensures that we are not accidentally
      // making assertions about the "Export wins" link in breadcrumbs
      cy.contains('Export winsBack').within(() => {
        cy.contains('a', 'Export wins').should(
          'have.attr',
          'href',
          '/exportwins'
        )
        cy.contains('a', 'Back').should(
          'have.attr',
          'href',
          urls.companies.exportWins.editSummary(company.id, win.id)
        )
      })
    })
  })
})
