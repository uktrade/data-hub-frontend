import React from 'react'

import ConsentDetails from '../../../../../src/client/modules/Contacts/ContactDetails/ConsentDetails'

describe('ConsentDetails', () => {
  context('When contact has no consent data', () => {
    beforeEach(() => {
      cy.mount(<ConsentDetails contact={{}} />)
    })

    it('should render a message that this data is missing for this contact', () => {
      cy.get('p').should(
        'have.text',
        'There is no marketing communications preference available for this contact'
      )
    })
  })

  context('When a contact has consented', () => {
    beforeEach(() => {
      cy.mount(
        <ConsentDetails
          contact={{
            consentData: [
              {
                consentDomain: 'Domain 1',
                emailContactConsent: true,
              },
            ],
          }}
        />
      )
    })

    it('should render the expected message', () => {
      cy.get('p').should(
        'have.text',
        'This contact has opted into receiving marketing communications.'
      )
    })
  })

  context('When a contact has not consented', () => {
    beforeEach(() => {
      cy.mount(
        <ConsentDetails
          contact={{
            consentData: [
              {
                consentDomain: 'Domain 1',
                emailContactConsent: false,
              },
            ],
          }}
        />
      )
    })

    it('should render the expected message', () => {
      cy.get('p').should(
        'have.text',
        'This contact has opted out of receiving marketing communications.'
      )
    })
  })

  context('When a contact has no consent management url', () => {
    beforeEach(() => {
      cy.mount(
        <ConsentDetails
          contact={{
            consentDataManagementUrl: undefined,
          }}
        />
      )
    })

    it('should hide the consent-management section', () => {
      cy.get('[data-test="consent-management"]').should('not.exist')
    })
  })

  context('When a contact has a consent management url', () => {
    beforeEach(() => {
      cy.mount(
        <ConsentDetails
          contact={{
            email: 'test@dbt.com',
            consentDataManagementUrl: 'http://domain.com?email=test@dbt.com',
          }}
        />
      )
    })

    it('should display a button that uses a mailto tag to open an email client', () => {
      cy.get('[data-test="send-consent-email-button"]').should(
        'have.attr',
        'href',
        'mailto:test@dbt.com?subject=Marketing communications preference&body=http://domain.com?email=test@dbt.com'
      )
    })

    it('should display a link that copies the contact consent management url into clipboard', () => {
      cy.get('[data-test="copy-consent-link-button"]').focus().click()
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.eq('http://domain.com?email=test@dbt.com')
        })
      })
    })
  })
})
