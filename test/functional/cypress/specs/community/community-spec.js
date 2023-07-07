import urls from '../../../../../src/lib/urls'

describe('Community', () => {
  context('When visiting the Community page', () => {
    // a test for the page title.
    // it('should display the correct page title', () => {
    //   cy.visit(urls.community.index())
    //   cy.get('[data-test="community-page"]')
    //     .children()
    //     .should('contain.text', 'CRM community')
    // })
    // // a test for the subheading.
    // it('should display the correct subheading', () => {
    //   cy.visit(urls.community.index())
    //   cy.get('[data-test="community-page"]')
    //     .children()
    //     .should(
    //       'contain.text',
    //       'Find out about upcoming improvements to CRM and to help shape its future development.'
    //     )
    // })
    // // a test for the breadcrumbs.
    // it('should display the correct breadcrumbs', () => {
    //   cy.visit(urls.community.index())
    //   cy.get('[data-test="community-page"]')
    //     .children()
    //     .should('contain.text', 'Home')
    //     .should('contain.text', 'CRM Community')
    // })
    // a test for the roadmap block.
    it('should display the roadmap block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-roadmap"]')
        .children()
        .should('contain.text', 'Take a look at what we’re working on')
        .children()
        .should('have.attr', 'href', urls.external.community.roadmap())
    })
    // a test for the feedback block.
    it('should display the feedback block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-feedback"]')
        .children()
        .should('exist')
        .should('contain.text', 'Discuss and give feedback')
        .children()
        .should('have.attr', 'href', urls.external.community.feedback())
    })
    // a test for the principles block.
    it('should display the principles block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-principles"]')
        .children()
        .should('exist')
        .should('contain.text', 'Our CRM principles')
        .children()
        .should('have.attr', 'href', urls.external.community.principles())
    })
    // a test for the training block
    it('should display the training block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-training"]')
        .children()
        .should('exist')
        .should('contain.text', 'Sign up for training')
        .children()
        .should('have.attr', 'href', urls.external.community.training())
    })
    // a test for the user research block.
    it('should display the user research block', () => {
      cy.visit(urls.community.index())
      cy.get('[data-test="community-research"]')
        .should('exist')
        .should('contain.text', 'Volunteer for user research')
    })
  })
})
