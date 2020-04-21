import '../../../../cypress/support/commands'
import urls from '../../../../../src/lib/urls'

const assertDescription = ({ term, name, email, team }) =>
  cy
    .contains(term)
    .should('have.prop', 'tagName', 'DT')
    .next()
    .should('have.prop', 'tagName', 'DD')
    .and('have.text', [name, email, team].filter(Boolean).join(', '))
    .within(
      () =>
        email &&
        cy
          .get('a')
          .should('have.text', email)
          .and('have.prop', 'href', `mailto:${email}`)
    )

const assertReferralCard = ({
  company,
  subject,
  id,
  companyId,
  date,
  dateAccepted,
  sender,
  recipient,
}) => {
  cy.get('div')
    .eq(0)
    .children()
    .eq(0)
    .should('have.text', company)

  cy.get('h3')
    .should('have.text', subject)
    .find('a')
    .should('have.attr', 'href', `/companies/${companyId}/referrals/${id}`)

  cy.get('ul')
    .children()
    .eq(0)
    .should('have.text', date)
    .next()
    .should(
      'have.text',
      `${dateAccepted ? 'Accepted' : 'Outstanding'} referral`
    )

  assertDescription({
    term: 'Sending adviser',
    ...sender,
  })

  assertDescription({
    term: 'Receiving adviser',
    ...recipient,
  })

  dateAccepted &&
    cy
      .contains('Accepted on')
      .should('have.prop', 'tagName', 'DT')
      .next()
      .should('have.prop', 'tagName', 'DD')
      .and('have.text', dateAccepted)
}

describe('Referall list on dashboard', () => {
  it('should live under the My referrals tab on dashboard', () => {
    cy.visit('/')
    cy.selectDhTablistTab('Dashboard', 'My referrals')
      .as('tabpanel')
      // This is only to wait for the content to be loaded
      .within(() => cy.get('ol'))

    cy.url().should(
      'eq',
      Cypress.config().baseUrl + urls.companies.referrals.list()
    )

    cy.get('@tabpanel')
      .children()
      .eq(0)
      .should('have.text', '3 Referrals')
      .and('have.prop', 'tagName', 'H3')
      .next()
      .should('have.prop', 'tagName', 'HR')
      .next()
      .should('have.prop', 'tagName', 'OL')
      .children()
      .as('list-items')
      .eq(0)
      .within(() =>
        assertReferralCard({
          company: 'Andy & Lou',
          subject: 'Andy to Lou',
          id: 'foo',
          companyId: 'andy-and-lou',
          date: '25 Nov 2021',
          dateAccepted: '25 Nov 2021',
          sender: {
            name: 'Andy Pipkin',
            email: 'andy.pipkin@gov.uk',
            team: 'Little Britain',
          },
          recipient: {
            name: 'Lou Todd',
            email: 'lou.todd@gov.uk',
            team: 'Little Britain',
          },
        })
      )

    cy.get('@list-items')
      .eq(1)
      .within(() =>
        assertReferralCard({
          company: 'Andy & Lou',
          subject: 'Lou to Andy',
          id: 'bar',
          companyId: 'andy-and-lou',
          date: '25 Nov 2021',
          sender: {
            name: 'Lou Todd',
            email: 'lou.todd@gov.uk',
            team: 'Little Britain',
          },
          recipient: {
            name: 'Andy Pipkin',
            email: 'andy.pipkin@gov.uk',
            team: 'Little Britain',
          },
        })
      )

    cy.get('@list-items')
      .eq(2)
      .within(() =>
        assertReferralCard({
          company: 'Andy & Lou',
          subject: 'Have you got a bandage?',
          id: 'baz',
          companyId: 'andy-and-lou',
          date: '25 Nov 2021',
          dateAccepted: '25 Nov 2021',
          sender: {
            name: 'Andy Pipkin',
            team: 'Little Britain',
          },
          recipient: {
            name: 'Lou Todd',
          },
        })
      )
  })
})
