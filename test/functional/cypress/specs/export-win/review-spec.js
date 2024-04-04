describe('Export wins review', () => {
  context('Should not set any cookies on page:', () => {
    ;[
      '/exportwins/review/dummy-token',
      '/exportwins/review-win/thankyou',
      '/exportwins/review/accesibility-statement',
    ].forEach((url) => {
      it(url, () => {
        cy.visit(url)
        cy.getAllCookies().should('have.length', 0)
      })
    })
  })
})
