const urls = require('../../../../../src/lib/urls')

describe('View task details', () => {
  context('When visiting task details', () => {
    it('should display the h1 heading of New Page', () => {
      cy.visit(urls.tasks.details('123'))
      cy.get('h1').contains('Task details')
    })
  })
})
