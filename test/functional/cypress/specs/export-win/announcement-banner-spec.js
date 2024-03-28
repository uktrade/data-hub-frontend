describe('Announcement banner', () => {
  context(
    'should render the Export Wins is moving banner right underneath the navigation on',
    () => {
      ;[
        '/',
        '/contacts',
        '/events',
        '/interactions',
        '/investments',
        '/omis',
        '/support',
      ].forEach((page) => {
        it(`"${page}" page`, () => {
          cy.visit(page)

          cy.contains(
            'CompaniesContactsEventsInteractionsInvestmentsOrdersSupport' +
              'Important: Export Wins is moving to Data Hub on 3 April 2024'
          )
        })
      })
    }
  )
})
