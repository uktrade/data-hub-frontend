const urls = require('../../../../../lib/urls')
const {
  renderDnbSubsidiaries,
  fetchSubsidiariesHandler,
} = require('../controllers')

const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const subsidiaries = require('../../../../../../test/unit/data/companies/subsidiary-company-search-response')
const { mockDnbSubsidiariesEndpoint } = require('./utils')

const companyMock = {
  id: '1',
  name: 'Test company',
  duns_number: '999999',
  is_global_ultimate: true,
}

describe('D&B Company Subsidiaries', () => {
  describe('#renderDnbSubsidiaries', () => {
    context('when the collection renders successfully', async () => {
      let middlewareParams

      before(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
        })

        await renderDnbSubsidiaries(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should render', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnce
      })

      it('should render the activity feed template', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/dnb-subsidiaries/views/client-container', {
            heading: 'Companies related to Test company',
            props: {
              dataEndpoint: urls.companies.dnbSubsidiaries.data('1'),
            },
          })
      })

      it('should add a breadcrumb', () => {
        expect(middlewareParams.resMock.breadcrumb).to.have.been.calledWith(
          'Test company', urls.companies.detail('1'))

        expect(middlewareParams.resMock.breadcrumb).to.have.been.calledWith(
          'Business details', urls.companies.businessDetails('1'))

        expect(middlewareParams.resMock.breadcrumb).to.have.been.calledWith(
          'Related companies')
      })

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

        await renderDnbSubsidiaries(
          middlewareParams.reqMock,
          errorRes,
          middlewareParams.nextSpy,
        )
      })

      it('should call next with an error', async () => {
        expect(middlewareParams.nextSpy).to.have.been.calledWith(error)
      })
    })

    context('when a company is not a D&B Global Ultimate', async () => {
      let middlewareParams

      before(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: {
            is_global_ultimate: false,
          },
        })

        await renderDnbSubsidiaries(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should call next() with an error', async () => {
        expect(middlewareParams.nextSpy).to.have.been.calledOnceWithExactly(sinon.match({
          message: 'This company is not a D&B Global Ultimate',
          statusCode: 403,
        }))
      })
    })
  })

  describe('#fetchSubsidiariesHandler', () => {
    context('when fetching D&B subsidiaries', async () => {
      let middlewareParams

      before(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
          requestQuery: {
            page: 2,
          },
        })

        mockDnbSubsidiariesEndpoint({
          globalUltimateSunsNumber: companyMock.duns_number,
          responseBody: subsidiaries,
          offset: 10,
        })

        await fetchSubsidiariesHandler(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should respond with a list of D&B subsidiaries', () => {
        expect(middlewareParams.resMock.json).to.be
          .calledOnceWithExactly(
            {
              count: 2,
              results: [{
                badges: ['United States'],
                headingText: 'Mars Exports Ltd',
                headingUrl: '/companies/b2c34b41-1d5a-4b4b-9249-7c53ff2868dd',
                metadata: [{ label: 'Sector', value: 'Retail' }, { label: 'Address', value: '12 First Street, New York, 765413, United States' }],
                subheading: 'Updated on 16 Nov 2017, 11:00am',
              }, {
                badges: ['United Kingdom', 'North West'],
                headingText: 'Mars Components Ltd',
                headingUrl: '/companies/731bdcc1-f685-4c8e-bd66-b356b2c16995',
                metadata: [{ label: 'Sector', value: 'Retail' }, { label: 'Address', value: '12 Alpha Street, Volcanus, NE28 5AQ, United Kingdom' }],
                subheading: 'Updated on 16 Oct 2017, 12:00pm',
              }],
            }
          )
      })

      it('should not call next() with an error', async () => {
        expect(middlewareParams.nextSpy).to.not.have.been.called
      })
    })

    context('when there is an error', async () => {
      let middlewareParams

      before(async () => {
        mockDnbSubsidiariesEndpoint({
          globalUltimateSunsNumber: companyMock.duns_number,
          responseCode: 500,
          responseBody: 'Error message',
        })

        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
          requestBody: companyMock,
        })

        await fetchSubsidiariesHandler(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should not respond', () => {
        expect(middlewareParams.resMock.json).to.not.have.been.called
      })

      it('should call next() with an error', async () => {
        expect(middlewareParams.nextSpy).to.have.been.calledOnceWithExactly(sinon.match({
          message: '500 - "Error message"',
        }))
      })
    })
  })
})
