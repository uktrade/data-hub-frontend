import React from 'react'

import ConsentDetails from '../../../../../src/client/modules/Contacts/ContactDetails/ConsentDetails'
import { assertGovReactTable } from '../../../../functional/cypress/support/assertions'

describe('ConsentDetails', () => {
  context('When contact has no consent data', () => {
    beforeEach(() => {
      cy.mount(<ConsentDetails contact={{}} />)
    })

    it('should render a message that this data is missing for this contact', () => {
      cy.get('[data-test=no-contact-consents]').should('exist')
    })
  })

  context('When contact has consent data with multiple domains', () => {
    beforeEach(() => {
      cy.mount(
        <ConsentDetails
          contact={{
            consentData: [
              {
                topic: 'Topic 2',
                consentDomain: 'Domain 1',
                emailContactConsent: false,
                telephoneContactConsent: false,
              },
              {
                topic: 'Topic 2',
                consentDomain: 'Domain 2',
                emailContactConsent: true,
                telephoneContactConsent: true,
              },
              {
                topic: 'Topic 1',
                consentDomain: 'Domain 3',
                emailContactConsent: false,
                telephoneContactConsent: true,
              },
              {
                topic: 'Topic 3',
                consentDomain: 'Domain 4',
                emailContactConsent: true,
                telephoneContactConsent: false,
              },
            ],
          }}
        />
      )
    })

    it('should render a row for each domain', () => {
      assertGovReactTable({
        element: '[data-test="contact-consent-table"]',
        rows: [
          ['Domain', 'Topic', 'Consent Given'],
          ['Domain 1', 'Topic 2', 'No'],
          ['Domain 2', 'Topic 2', 'Yes'],
          ['Domain 3', 'Topic 1', 'Yes'],
          ['Domain 4', 'Topic 3', 'Yes'],
        ],
      })
    })
  })
})
