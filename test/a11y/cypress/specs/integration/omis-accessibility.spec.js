import urls from '../../../../../src/lib/urls'
import { testIdentityNumbers } from './testIdentityNumbers'
import { urlTestExclusions } from './urlTestExclusions'
import { differenceBy } from 'lodash'

const mountPoint = urls.omis
const mountPointName = 'omis'

const arrayOfUrls = []
const excludedUrls = urlTestExclusions[mountPointName]

for (const levelOnePath in mountPoint) {
  if (mountPoint[levelOnePath].route) {
    arrayOfUrls.push({ url: mountPoint[levelOnePath].route })
  } else {
    const levelTwoPaths = Object.keys(mountPoint[levelOnePath])
    levelTwoPaths.forEach((levelTwoPath) => {
      if (mountPoint[levelOnePath][levelTwoPath].route) {
        arrayOfUrls.push({
          url: mountPoint[levelOnePath][levelTwoPath].route,
        })
      } else {
        const levelThreePaths = Object.keys(
          mountPoint[levelOnePath][levelTwoPath]
        )
        levelThreePaths.forEach((levelThreePath) => {
          if (mountPoint[levelOnePath][levelTwoPath][levelThreePath].route) {
            arrayOfUrls.push({
              url: mountPoint[levelOnePath][levelTwoPath][levelThreePath].route,
            })
          }
        })
      }
    })
  }
}

let filteredArrayOfUrls = differenceBy(arrayOfUrls, excludedUrls, 'url')

filteredArrayOfUrls = filteredArrayOfUrls.filter(
  (path) => path.url.split('/').pop() !== 'data'
)

filteredArrayOfUrls = filteredArrayOfUrls.filter(
  (path) => path.url.split('/').pop() !== 'export'
)

filteredArrayOfUrls.map((path) => {
  let pathUrl = path.url.split('/')
  const currentPathUrl = pathUrl.map((route) => {
    if (route.startsWith(':')) {
      return (route = testIdentityNumbers[route])
    }
    return route
  })
  return currentPathUrl.join('/')
})

filteredArrayOfUrls.map((path) => {
  describe(`${mountPointName}${path.url}`, () => {
    before(() => {
      cy.visit('/' + mountPointName + path.url)
      // Wait until page has loaded first
      cy.initA11y()
    })

    it('Page should not have any a11y violations', () => {
      cy.runA11y()
    })
  })
})
