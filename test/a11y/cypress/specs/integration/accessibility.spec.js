import urls from '../../../../../src/lib/urls'
import { testIdentityNumbers } from './testIdentityNumbers'

const mountPoint = urls.companies
const mountPointName = 'companies'
const arrayOfItems = []

for (const levelOnePath in mountPoint) {
  if (mountPoint[levelOnePath].route) {
    arrayOfItems.push({ url: mountPoint[levelOnePath].route })
  } else {
    const levelTwoPaths = Object.keys(mountPoint[levelOnePath])
    levelTwoPaths.forEach((levelTwoPath) => {
      if (mountPoint[levelOnePath][levelTwoPath].route) {
        arrayOfItems.push({
          url: mountPoint[levelOnePath][levelTwoPath].route,
        })
      } else {
        const levelThreePaths = Object.keys(
          mountPoint[levelOnePath][levelTwoPath]
        )
        levelThreePaths.forEach((levelThreePath) => {
          if (mountPoint[levelOnePath][levelTwoPath][levelThreePath].route) {
            arrayOfItems.push({
              url: mountPoint[levelOnePath][levelTwoPath][levelThreePath].route,
            })
          }
        })
      }
    })
  }
}

arrayOfItems.map((path) => {
  let pathUrl = path.url.split('/')
  const currentPathUrl = pathUrl.map((route) => {
    if (route.startsWith(':')) {
      return (route = testIdentityNumbers[route])
    }
    return route
  })
  pathUrl = currentPathUrl.join('/')
  describe(`${mountPointName}${path.url}`, () => {
    before(() => {
      cy.visit('/' + mountPointName + pathUrl)
      // Wait until page has loaded first
      cy.initA11y()
    })

    it('Page should not have any a11y violations', () => {
      cy.runA11y()
    })
  })
})
