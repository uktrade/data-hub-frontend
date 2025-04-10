import urls from '../../../../src/lib/urls'
import { initialiseTests } from '../config/initialiseTests'
import { urlTestExclusions } from '../config/urlTestExclusions'
import { cleanseArrayOfUrls, createArrayOfUrls } from '../config/utils'

const arrayOfUrls = createArrayOfUrls(urls)

let filteredArrayOfUrls = cleanseArrayOfUrls(arrayOfUrls, urlTestExclusions)
// TODO remove limited tests
filteredArrayOfUrls = [filteredArrayOfUrls[12], filteredArrayOfUrls[11]]

filteredArrayOfUrls.map((path) => {
  describe(`${path}`, () => {
    before(() => {
      if (initialiseTests[path]) {
        path = initialiseTests[path]()
      }

      cy.visit(path, { timeout: 20000 })
      // Wait until page has loaded first
      cy.initA11y()
    })

    it('Page should not have any a11y violations', () => {
      cy.checkA11y(null, {
        retries: 3,
        interval: 100,
      })
    })
  })
})
