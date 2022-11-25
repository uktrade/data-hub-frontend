import urls from '../../../../../src/lib/urls'
import { testIdentityNumbers } from './testIdentityNumbers'

const { companies } = urls
const collectionName = 'companies'
const arrayOfItems = []

for (const item in companies) {
  if (companies[item].route) {
    arrayOfItems.push({ item: companies[item].route })
  } else {
    const lowerItems = Object.keys(companies[item])
    lowerItems.forEach((key) => {
      if (companies[item][key].route) {
        arrayOfItems.push({
          item: companies[item][key].route,
        })
      } else {
        const evenLowerItems = Object.keys(companies[item][key])
        evenLowerItems.forEach((element) => {
          if (companies[item][key][element].route) {
            arrayOfItems.push({
              item: companies[item][key][element].route,
            })
          }
        })
      }
    })
  }
}

arrayOfItems.map((path) => {
  let adviserRoute = path.item.split('/')
  const currentAdvisorRoute = adviserRoute.map((route) => {
    if (route.startsWith(':')) {
      return (route = testIdentityNumbers[route])
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
