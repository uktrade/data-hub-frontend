import urls from '../../../../../src/lib/urls'

const { advisers } = urls.companies
const companyId = 'cc7e2f19-7251-4a41-a27a-f98437720531'

for (const adviserPath in advisers) {
  let adviserRoute = advisers[adviserPath].route.split('/')
  const currentAdvisorRoute = adviserRoute.map((route) => {
    if (route.startsWith(':')) {
      return (route = companyId)
    }
    return route
  })
  adviserRoute = currentAdvisorRoute.join('/')
  describe('Data Hub accessibility tests', () => {
    before(() => {
      cy.visit('/companies' + adviserRoute)
      // Wait until page has loaded first
      cy.initA11y()
    })

    it('should not have any a11y violations', () => {
      cy.runA11y()
    })
  })
}
