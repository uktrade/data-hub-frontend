import urls from '../../../../../src/lib/urls'
import { urlTestExclusions } from '../../config/urlTestExclusions'
import { cleanseArrayOfUrls, createArrayOfUrls } from '../../config/utils'

const arrayOfUrls = createArrayOfUrls(urls)

const filteredArrayOfUrls = cleanseArrayOfUrls(arrayOfUrls, urlTestExclusions)

filteredArrayOfUrls.map((path) => {
  describe(`${path}`, () => {
    before(() => {
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
