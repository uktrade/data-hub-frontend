import { companies, dashboard } from '../../../../../../src/lib/urls'
import { id as companyId } from '../../../../../sandbox/fixtures/v4/company/company-lambda-plc.json'

import { localHeader } from '../../../../../selectors'
import {
  assertBreadcrumbs,
  assertDetails,
  assertSummaryTable,
} from '../../../support/assertions'
import {
  REFERRAL_ID,
  REFERRAL_ID_NO_CONTACT,
} from '../../../../../sandbox/constants/referrals'

describe('Referral details', () => {
  context('when viewing referral details', () => {
    beforeEach(() =>
      cy.visit(companies.referrals.details(companyId, REFERRAL_ID))
    )

    it('should render the details page', () => {
      assertBreadcrumbs({
        Home: dashboard.index(),
        Companies: companies.index(),
        'Lambda plc': companies.detail(companyId),
        Referral: null,
      })

      cy.get(localHeader().heading).should('have.text', 'Referral')

      assertSummaryTable({
        dataTest: 'referral-details-table',
        heading: 'I am a subject',
        content: {
          Company: 'Lambda plc',
          Contact: 'Helena Referral',
          'Sending adviser':
            'Ian Leggett, caravans@campervans.com, Advanced Manufacturing Sector',
          'Receiving adviser':
            'Barry Oling, barry@barry.com, Aberdeen City Council',
          'Date of referral': '14 Feb 2020',
          Notes: 'Just a note about a referral',
        },
      })

      cy.get('[data-test="cannot-edit-details"]').then((element) => {
        assertDetails({
          element,
          summary: 'Why can I not edit the referral?',
          content:
            "For now, you can't edit the referral once it's been sent.Contact the recipient if something's changed.",
        })
      })

      assertAcceptAndHelpButtons(REFERRAL_ID)
      assertBackButton()

      cy.contains('[data-test="complete-referral-table"]').should('not.exist')
    })
  })

  context('when viewing referral details with no contact', () => {
    beforeEach(() =>
      cy.visit(companies.referrals.details(companyId, REFERRAL_ID_NO_CONTACT))
    )

    it('should render the details page', () => {
      assertBreadcrumbs({
        Home: dashboard.index.route,
        Companies: companies.index(),
        'Lambda plc': companies.detail(companyId),
        Referral: null,
      })

      cy.get(localHeader().heading).should('have.text', 'Referral')

      assertSummaryTable({
        dataTest: 'referral-details-table',
        heading: 'I am a subject',
        content: {
          Company: 'Lambda plc',
          'Sending adviser':
            'Ian Leggett, caravans@campervans.com, Advanced Manufacturing Sector',
          'Receiving adviser':
            'Barry Oling, barry@barry.com, Aberdeen City Council',
          'Date of referral': '14 Feb 2020',
          Notes: 'Just a note about a referral',
        },
      })

      cy.get('[data-test="cannot-edit-details"]').then((element) => {
        assertDetails({
          element,
          summary: 'Why can I not edit the referral?',
          content:
            "For now, you can't edit the referral once it's been sent.Contact the recipient if something's changed.",
        })
      })

      assertAcceptAndHelpButtons(REFERRAL_ID_NO_CONTACT)
      assertBackButton()

      cy.contains('[data-test="complete-referral-table"]').should('not.exist')
    })
  })

  context('when viewing details of a complete referral', () =>
    it('should display the Referral accepted summary instead of the buttons', () => {
      cy.visit(companies.referrals.details('any-id-will-do', 'completed'))

      cy.contains('[data-test="accept-button"]').should('not.exist')
      cy.contains('[data-test="help-button"]').should('not.exist')

      assertSummaryTable({
        dataTest: 'complete-referral-table',
        heading: 'Referral accepted',
        content: {
          Date: '19 Mar 2020',
          By: 'Andy Pipkin',
          'With interaction': 'Covert action',
        },
      })
    })
  )

  context('When you come to the details page from /my-referrals', () => {
    it('should take you back there when you click "back"', () => {
      cy.visit(dashboard.index())
      cy.contains('Referrals').click()
      cy.contains('Andy to Lou').click()
      assertBackButton(companies.referrals.list())
    })
  })

  context('When you come to the details page from anywhere else', () => {
    it('should take you to the company page when you click "back"', () => {
      cy.visit(companies.referrals.details(companyId, REFERRAL_ID_NO_CONTACT))
      assertBackButton()
    })
  })
})

const assertAcceptAndHelpButtons = (referralId) => {
  cy.get('[data-test=accept-button')
    .should('be.visible')
    .should('have.text', 'Accept referral')
    .should(
      'have.attr',
      'href',
      companies.referrals.interactions.create(companyId, referralId)
    )

  cy.get('[data-test=help-button')
    .should('be.visible')
    .should('have.text', 'I cannot accept the referral')
    .should(
      'have.attr',
      'href',
      companies.referrals.help(companyId, referralId)
    )
}

const assertBackButton = (url = companies.detail(companyId)) => {
  cy.get('[data-test=back-button')
    .should('be.visible')
    .should('have.text', 'Back')
    .should('have.attr', 'href', url)
}
