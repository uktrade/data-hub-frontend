import React from 'react'

import DataHubProvider from '../provider'
import SendReferralForm from '../../../../../src/apps/companies/apps/referrals/send-referral/client/SendReferralForm'
import { companyFaker } from '../../../../functional/cypress/fakers/companies'
import { contactFaker } from '../../../../functional/cypress/fakers/contacts'

const {
  assertBreadcrumbs,
  assertLocalHeader,
} = require('../../../../functional/cypress/support/assertions')
const urls = require('../../../../../src/lib/urls')

describe('SendReferralForm component', () => {
  const company = companyFaker()
  const companyContacts = [contactFaker()]

  const Component = (props) => (
    <DataHubProvider>
      <SendReferralForm
        {...props}
        companyName={company.name}
        companyId={company.id}
        companyContacts={companyContacts}
        cancelUrl=""
      />
    </DataHubProvider>
  )

  describe('All but successful completion', () => {
    beforeEach(() => {
      cy.mount(
        <div>
          <Component />
        </div>
      )
    })

    context('when viewing the "send referral" form', () => {
      it('should display breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard.index(),
          Companies: urls.companies.index(),
          [company.name]: urls.companies.detail(company.id),
          'Send a referral': null,
        })
      })

      it('should display the header', () => {
        assertLocalHeader('Send a referral')
      })
    })
  })
})
