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

  context(
    'When a contact has consent data with a single domain and a single topic without a name where they have given consent',
    () => {
      beforeEach(() => {
        cy.mount(
          <ConsentDetails
            contact={{
              consentData: [
                {
                  consentDomain: 'Domain 1',
                  emailContactConsent: true,
                  telephoneContactConsent: false,
                },
              ],
            }}
          />
        )
      })

      it('should render the expected message', () => {
        cy.get('p').should(
          'have.text',
          'This contact has given consent to Domain 1.'
        )
      })
    }
  )

  context(
    'When a contact has consent data with a single domain and a single topic with a name where they have given consent',
    () => {
      beforeEach(() => {
        cy.mount(
          <ConsentDetails
            contact={{
              consentData: [
                {
                  topic: 'Topic 2',
                  consentDomain: 'Domain 1',
                  emailContactConsent: true,
                  telephoneContactConsent: false,
                },
              ],
            }}
          />
        )
      })

      it('should render the expected message', () => {
        cy.get('p').should(
          'have.text',
          'This contact has given consent to Domain 1 and topic Topic 2.'
        )
      })
    }
  )

  context(
    'When a contact has consent data with a single domain and multiple topics with a name where they have given consent',
    () => {
      beforeEach(() => {
        cy.mount(
          <ConsentDetails
            contact={{
              consentData: [
                {
                  topic: 'Topic 1',
                  consentDomain: 'Domain 1',
                  emailContactConsent: true,
                  telephoneContactConsent: false,
                },
                {
                  topic: 'Topic 2',
                  consentDomain: 'Domain 1',
                  emailContactConsent: true,
                  telephoneContactConsent: false,
                },
              ],
            }}
          />
        )
      })

      it('should render the expected message', () => {
        cy.get('p').should(
          'have.text',
          'This contact has given consent to Domain 1 and topics: Topic 1, Topic 2.'
        )
      })
    }
  )

  context(
    'When a contact has consent data with a single domain and multiple topics with a name where they have given and not given consent',
    () => {
      beforeEach(() => {
        cy.mount(
          <ConsentDetails
            contact={{
              consentData: [
                {
                  topic: 'Topic 1',
                  consentDomain: 'Domain 1',
                  emailContactConsent: true,
                  telephoneContactConsent: false,
                },
                {
                  topic: 'Topic 2',
                  consentDomain: 'Domain 1',
                  emailContactConsent: false,
                  telephoneContactConsent: false,
                },
                {
                  topic: 'Topic 3',
                  consentDomain: 'Domain 1',
                  emailContactConsent: false,
                  telephoneContactConsent: false,
                },
              ],
            }}
          />
        )
      })

      it('should render the expected message', () => {
        cy.get('p').should(
          'have.text',
          'This contact has given consent to Domain 1 and topic Topic 1. This contact has not given consent to Domain 1 and topics: Topic 2, Topic 3.'
        )
      })
    }
  )

  context(
    'When a contact has consent data with a single domain and multiple topics with and without a name where they have given and not given consent',
    () => {
      beforeEach(() => {
        cy.mount(
          <ConsentDetails
            contact={{
              consentData: [
                {
                  topic: 'Topic 1',
                  consentDomain: 'Domain 1',
                  emailContactConsent: true,
                  telephoneContactConsent: false,
                },
                {
                  topic: 'Topic 2',
                  consentDomain: 'Domain 1',
                  emailContactConsent: false,
                  telephoneContactConsent: false,
                },
                {
                  consentDomain: 'Domain 1',
                  emailContactConsent: false,
                  telephoneContactConsent: false,
                },
              ],
            }}
          />
        )
      })

      it('should render the expected message', () => {
        cy.get('p').should(
          'have.text',
          'This contact has given consent to Domain 1 and topic Topic 1. This contact has not given consent to Domain 1 and topic Topic 2.'
        )
      })
    }
  )

  context(
    'When a contact has consent data with a single domain and no topics where they have not given consent',
    () => {
      beforeEach(() => {
        cy.mount(
          <ConsentDetails
            contact={{
              consentData: [
                {
                  consentDomain: 'Domain 1',
                  emailContactConsent: false,
                  telephoneContactConsent: false,
                },
              ],
            }}
          />
        )
      })

      it('should render the expected message', () => {
        cy.get('p').should(
          'have.text',
          'This contact has not given consent to Domain 1.'
        )
      })
    }
  )

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
                emailContactConsent: false,
                telephoneContactConsent: false,
              },
            ],
          }}
        />
      )
    })

    it('should render the expected message', () => {
      cy.get('p')
        .eq(0)
        .should(
          'have.text',
          'This contact has not given consent to Domain 1 and topic Topic 2.'
        )
      cy.get('p')
        .eq(1)
        .should('have.text', 'This contact has given consent to Domain 2.')
      cy.get('p')
        .eq(2)
        .should(
          'have.text',
          'This contact has given consent to Domain 3 and topic Topic 1.'
        )
      cy.get('p')
        .eq(3)
        .should(
          'have.text',
          'This contact has not given consent to Domain 4 and topic Topic 3.'
        )
    })
  })
})
