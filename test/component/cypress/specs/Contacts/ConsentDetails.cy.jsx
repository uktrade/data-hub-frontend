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
        'There is no consent data available for this contact'
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
        'This contact has given consent to be contacted.'
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
        'This contact has not given consent to be contacted.'
      )
    })
  })
})
