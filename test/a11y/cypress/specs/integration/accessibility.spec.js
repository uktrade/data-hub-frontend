import urls from '../../../../../src/lib/urls'

const { advisers } = urls.companies
const collectionName = 'companies'
const companyId = 'cc7e2f19-7251-4a41-a27a-f98437720531'
const arrayOfItems = []

for (const item in advisers) {
  if (advisers[item].route) {
    arrayOfItems.push({ item: advisers[item].route })
  } else {
    const lowerItems = Object.keys(advisers[item])
    lowerItems.forEach((key) => {
      arrayOfItems.push({
        item: advisers[item][key].route,
      })
    })
  }
}

arrayOfItems.map((path) => {
  let adviserRoute = path.item.split('/')
  const currentAdvisorRoute = adviserRoute.map((route) => {
    if (route.startsWith(':')) {
      return (route = companyId)
    }
    return route
  })
  adviserRoute = currentAdvisorRoute.join('/')
  describe('Data Hub accessibility tests', () => {
    before(() => {
      cy.visit('/' + collectionName + adviserRoute)
      // Wait until page has loaded first
      cy.initA11y()
    })

    it('should not have any a11y violations', () => {
      cy.runA11y()
    })
  })
})
