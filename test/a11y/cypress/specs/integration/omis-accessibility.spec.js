import urls from '../../../../../src/lib/urls'
import { urlTestExclusions } from './config/urlTestExclusions'
import { cleanseArrayOfUrls, createArrayOfUrls } from './config/utils'

const mountPoint = urls.omis
const excludedUrls = urlTestExclusions.omis

const arrayOfUrls = createArrayOfUrls(mountPoint)

const filteredArrayOfUrls = cleanseArrayOfUrls(arrayOfUrls, excludedUrls)

filteredArrayOfUrls.map((path) => {
  describe(`${path}`, () => {
    before(() => {
      cy.visit(path, { timeout: 20000 })
      // Wait until page has loaded first
      cy.initA11y()
    })

    it('Page should not have any a11y violations', () => {
      cy.runA11y()
    })
  })
})
