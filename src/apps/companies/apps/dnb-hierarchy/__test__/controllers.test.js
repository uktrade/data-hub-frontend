const urls = require('../../../../../lib/urls')
const {
  renderDnbHierarchy,
  fetchDnbHierarchyHandler,
} = require('../controllers')

const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const hierarchy = require('../../../../../../test/unit/data/companies/subsidiary-company-search-response')
const { mockGetDnbHierarchy } = require('./utils')

const companyMock = {
  id: '1',
  name: 'Test company',
  duns_number: '999999',
  global_ultimate_duns_number: '999999',
  isGlobalHQ: false,
}

describe('D&B Company hierarchy', () => {
  describe('#renderDnbHierarchy', () => {
    context('when the collection renders successfully', async () => {
      let middlewareParams

      before(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
        })

        await renderDnbHierarchy(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy
        )
      })
      // NOTE: covered in test/functional/cypress/specs/companies/dnb-hierarchy-spec.js:29
      it('should render', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnce
      })
      // TODO: mostly covered in test/functional/cypress/specs/companies/dnb-hierarchy-spec.js, but could add a check for isGlobal HQ
      it('should render the activity feed template', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/dnb-hierarchy/views/client-container',
          {
            heading: 'Company records related to Test company',
            props: {
              isGlobalHQ: false,
              dataEndpoint: urls.companies.dnbHierarchy.data('1'),
            },
          }
        )
      })
      // NOTE: covered in test/functional/cypress/specs/companies/dnb-hierarchy-spec.js:39
      it('should add a breadcrumb', () => {
        expect(middlewareParams.resMock.breadcrumb).to.have.been.calledWith(
          'Test company',
          urls.companies.detail('1')
        )
        // NOTE: as line 52
        expect(middlewareParams.resMock.breadcrumb).to.have.been.calledWith(
          'Business details',
          urls.companies.businessDetails('1')
        )
        // NOTE: as line 52
        expect(middlewareParams.resMock.breadcrumb).to.have.been.calledWith(
          'Related companies'
        )
      })
      // TODO: add something about not displaying an error
      it('should not call "next" with an error', async () => {
        expect(middlewareParams.nextSpy).to.not.have.been.called
      })
    })

    context('when the rendering fails', async () => {
      let middlewareParams
      const error = new Error('Could not render')

      before(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
        })

        const errorRes = {
          ...middlewareParams.resMock,
          render: () => {
            throw error
          },
        }

        await renderDnbHierarchy(
          middlewareParams.reqMock,
          errorRes,
          middlewareParams.nextSpy
        )
      })
      // TODO: add test to dnb-hierachy-spec.js about errors
      it('should call next with an error', async () => {
        expect(middlewareParams.nextSpy).to.have.been.calledWith(error)
      })
    })

    context('when a company does not belong to D&B hierarchy', async () => {
      let middlewareParams

      before(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: {
            global_ultimate_duns_number: null,
          },
        })

        await renderDnbHierarchy(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy
        )
      })
      // TODO: add a test case for this case to dnb-hierachy-spec.js
      it('should call next() with an error', async () => {
        expect(middlewareParams.nextSpy).to.have.been.calledOnceWithExactly(
          sinon.match({
            message: 'This company does not belong to any D&B hierarchy',
            statusCode: 403,
          })
        )
      })
    })
  })

  describe('#fetchDnbHierarchyHandler', () => {
    context('when fetching D&B hierarchy', async () => {
      let middlewareParams

      before(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            page: 2,
          },
        })

        mockGetDnbHierarchy({
          globalUltimateDunsNumber: companyMock.global_ultimate_duns_number,
          responseBody: hierarchy,
          offset: 10,
        })

        await fetchDnbHierarchyHandler(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy
        )
      })
      // NOTE: covered in: test/functional/cypress/specs/companies/dnb-hierarchy-spec.js:49
      it('should respond with a list of D&B hierarchy', () => {
        expect(middlewareParams.resMock.json).to.be.calledOnceWithExactly({
          count: 1,
          results: [
            {
              badges: [{ text: 'United Kingdom' }, { text: 'North West' }],
              headingText: 'Mars Components Ltd',
              headingUrl: '/companies/731bdcc1-f685-4c8e-bd66-b356b2c16995',
              metadata: [
                { label: 'Sector', value: 'Retail' },
                {
                  label: 'Address',
                  value: '12 Alpha Street, Volcanus, NE28 5AQ, United Kingdom',
                },
              ],
              subheading: 'Updated on 16 Oct 2017, 12:00pm',
            },
          ],
        })
      })
      // TODO: add check to dnb-hierachy-spec.js about not erroring
      it('should not call next() with an error', async () => {
        expect(middlewareParams.nextSpy).to.not.have.been.called
      })
    })

    context('when there is an error', async () => {
      let middlewareParams

      before(async () => {
        mockGetDnbHierarchy({
          globalUltimateDunsNumber: companyMock.global_ultimate_duns_number,
          responseCode: 500,
          responseBody: 'Error message',
        })

        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
          requestBody: companyMock,
        })

        await fetchDnbHierarchyHandler(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy
        )
      })
      // TODO: add 500 mock error case to functional test
      it('should not respond', () => {
        expect(middlewareParams.resMock.json).to.not.have.been.called
      })

      it('should call next() with an error', async () => {
        expect(middlewareParams.nextSpy).to.have.been.calledOnceWithExactly(
          sinon.match({
            message: '500 - "Error message"',
          })
        )
      })
    })
  })
})
