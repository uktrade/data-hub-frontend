import urls from '../../../../../src/lib/urls'
import { assertBreadcrumbs } from '../../support/assertions'

describe('Community', () => {
  context('When visiting the Community page', () => {
    beforeEach(() => {
      cy.visit(urls.community.index())
    })
    it('should display the correct page title', () => {
      cy.get('[data-test="localHeader"]')
        .children()
        .should('contain.text', 'CRM community')
    })

    it('should display the correct subheading', () => {
      cy.get('[data-test="localHeader"]')
        .children()
        .should(
          'contain.text',
          'Find out about upcoming improvements to CRM and to help shape its future development.'
        )
    })

    it('should display the correct breadcrumbs', () => {
      cy.get('[data-test="localHeader"]')
      assertBreadcrumbs('Home', 'CRM Community')
    })

    it('should display the roadmap block', () => {
      cy.get('[data-test="community-roadmap"]')
        .children()
        .should('exist')
        .should('contain.text', "Take a look at what we're working on")
        .children()
        .should(
          'have.attr',
          'href',
          urls.external.helpCentre.community.roadmap()
        )
    })

    it('should display the feedback block', () => {
      cy.get('[data-test="community-feedback"]')
        .children()
        .should('exist')
        .should('contain.text', 'Discuss and give feedback')
        .children()
        .should(
          'have.attr',
          'href',
          urls.external.helpCentre.community.feedback()
        )
    })

    it('should display the principles block', () => {
      cy.get('[data-test="community-principles"]')
        .children()
        .should('exist')
        .should('contain.text', 'Our CRM principles')
        .children()
        .should(
          'have.attr',
          'href',
          urls.external.helpCentre.community.principles()
        )
    })

    it('should display the training block', () => {
      cy.get('[data-test="community-training"]')
        .children()
        .should('exist')
        .should('contain.text', 'Sign up for training')
        .children()
        .should(
          'have.attr',
          'href',
          urls.external.helpCentre.community.training()
        )
    })

    it('should display the user research block', () => {
      cy.get('[data-test="community-research"]')
        .should('exist')
        .should('contain.text', 'Volunteer for user research')
    })

    it('should display the correct email subject', () => {
      cy.get('[data-test="community-research"]')
        .children()
        .should('exist')
        .children()
        .should(
          'have.attr',
          'href',
          'mailto:crmresearch@trade.gov.uk?subject=Volunteering%20for%20user%20research&body=Hello%2C%20I%20would%20like%20to%20volunteer%20to%20take%20part%20in%20future%20user%20research%20around%20CRM.'
        )
    })
  })
})
