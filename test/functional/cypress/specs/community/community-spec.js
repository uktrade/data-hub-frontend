import urls from '../../../../../src/lib/urls'

describe('Community', () => {
  context('When visiting the Community page', () => {
    it('should display the correct page title', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="localHeader"]')
        .children()
        .should('contain.text', 'CRM community')
    })

    it('should display the correct subheading', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="localHeader"]')
        .children()
        .should(
          'contain.text',
          'Find out about upcoming improvements to CRM and to help shape its future development.'
        )
    })

    it('should display the correct breadcrumbs', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="localHeader"]')
        .children()
        .should('contain.text', 'Home')
        .should('contain.text', 'CRM Community')
    })

    it('should display the roadmap block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-roadmap"]')
        .children()
        .should('exist')
        .should('contain.text', "Take a look at what we're working on")
        .children()
        .should('have.attr', 'href', urls.external.community.roadmap())
    })

    it('should display the feedback block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-feedback"]')
        .children()
        .should('exist')
        .should('contain.text', 'Discuss and give feedback')
        .children()
        .should('have.attr', 'href', urls.external.community.feedback())
    })

    it('should display the principles block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-principles"]')
        .children()
        .should('exist')
        .should('contain.text', 'Our CRM principles')
        .children()
        .should('have.attr', 'href', urls.external.community.principles())
    })

    it('should display the training block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-training"]')
        .children()
        .should('exist')
        .should('contain.text', 'Sign up for training')
        .children()
        .should('have.attr', 'href', urls.external.community.training())
    })

    it('should display the user research block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-research"]')
        .should('exist')
        .should('contain.text', 'Volunteer for user research')
    })

    it('should display the correct email subject', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-research"]')
        .children()
        .should('exist')
        .children()
        .should(
          'have.attr',
          'href',
          'mailto:crmresearch@trade.gov.uk?subject=Volunteering for user research&body=Hello, I would like to volunteer to take part in future user research around CRM.'
        )
    })
  })
})
