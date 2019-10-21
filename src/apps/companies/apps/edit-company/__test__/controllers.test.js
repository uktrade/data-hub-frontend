const config = require('../../../../../../config')
const {
  renderEditCompanyForm,
  postEditCompany,
} = require('../controllers')
const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')

const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')

const metadataMock = {
  turnoverRangeOptions: [
    { id: '1', name: 'tr1', disabled_on: null },
    { id: '2', name: 'tr2', disabled_on: null },
    { id: '3', name: 'tr3', disabled_on: null },
  ],
  employeeRangeOptions: [
    { id: '1', name: 'er1', disabled_on: null },
    { id: '2', name: 'er2', disabled_on: null },
    { id: '3', name: 'er3', disabled_on: null },
  ],
  regionOptions: [
    { id: '1', name: 'r1', disabled_on: null },
    { id: '2', name: 'r2', disabled_on: null },
    { id: '3', name: 'r3', disabled_on: null },
  ],
  sectorOptions: [
    { id: '1', name: 's1', disabled_on: null },
    { id: '2', name: 's2', disabled_on: null },
    { id: '3', name: 's3', disabled_on: null },
  ],
  headquarterTypeOptions: [
    { id: '1', name: 'ht1', disabled_on: null },
    { id: '2', name: 'ht2', disabled_on: null },
    { id: '3', name: 'ht3', disabled_on: null },
  ],
}

function assertCommonTemplate (actualTemplate) {
  expect(actualTemplate).to.be.calledWith(
    'companies/apps/edit-company/views/client-container'
  )
}

function assertCommonBreadcrumbs (actualBreadcrumbs) {
  expect(actualBreadcrumbs).to.deep.equal([
    ['Test Company', '/companies/1'],
    ['Business details', '/companies/1/business-details'],
    ['Edit business details'],
  ])
}

function assertCommonProps (actualProps) {
  expect(actualProps.companyDetails).to.not.be.null
  expect(actualProps.turnoverRanges).to.have.length(3)
  expect(actualProps.employeeRanges).to.have.length(3)
  expect(actualProps.regions).to.have.length(3)
  expect(actualProps.sectors).to.have.length(3)
  expect(actualProps.headquarterTypes).to.have.length(4)
  expect(actualProps.oneListEmail).to.equal(config.oneList.email)
}

describe('Edit company form controllers', () => {
  let middlewareParams
  let actualProps

  describe('#renderEditCompanyForm', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/v4/metadata/turnover')
        .reply(200, metadataMock.turnoverRangeOptions)

      nock(config.apiRoot)
        .get('/v4/metadata/employee-range')
        .reply(200, metadataMock.employeeRangeOptions)

      nock(config.apiRoot)
        .get('/v4/metadata/uk-region')
        .reply(200, metadataMock.regionOptions)

      nock(config.apiRoot)
        .get('/v4/metadata/sector')
        .reply(200, metadataMock.sectorOptions)

      nock(config.apiRoot)
        .get('/v4/metadata/headquarter-type')
        .reply(200, metadataMock.headquarterTypeOptions)
    })

    context('when editing a foreign company', () => {
      beforeEach(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: {
            id: 1,
            name: 'Test Company',
            uk_based: true,
          },
        })

        await renderEditCompanyForm(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )

        actualProps = middlewareParams.resMock.render.firstCall.args[1].props
      })

      it('should render the edit page', () => {
        assertCommonTemplate(middlewareParams.resMock.render.firstCall)
      })

      it('should set the breadcrumbs', () => {
        assertCommonBreadcrumbs(middlewareParams.resMock.breadcrumb.args)
      })

      it('should set common props', () => {
        assertCommonProps(actualProps)
      })

      it('should not show the company number field', () => {
        expect(actualProps.showCompanyNumberForUkBranch).to.be.false
      })
    })

    context('when editing a UK branch of a foreign company', () => {
      beforeEach(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: {
            id: 1,
            name: 'Test Company',
            uk_based: true,
            business_type: {
              'name': 'UK branch of foreign company (BR)',
              'id': 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
            },
          },
        })

        await renderEditCompanyForm(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )

        actualProps = middlewareParams.resMock.render.firstCall.args[1].props
      })

      it('should render the edit page', () => {
        assertCommonTemplate(middlewareParams.resMock.render.firstCall)
      })

      it('should set the breadcrumbs', () => {
        assertCommonBreadcrumbs(middlewareParams.resMock.breadcrumb.args)
      })

      it('should set common props', () => {
        assertCommonProps(actualProps)
      })

      it('should show the company number field', () => {
        expect(actualProps.showCompanyNumberForUkBranch).to.be.true
      })
    })

    context('when the rendering fails', () => {
      const error = new Error('Could not render')

      beforeEach(async () => {
        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
        })
        middlewareParams.resMock.render = () => { throw error }

        await renderEditCompanyForm(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should call next() with an error', () => {
        expect(middlewareParams.nextSpy).to.have.been.calledOnceWithExactly(error)
      })
    })
  })

  describe('#postEditCompany', () => {
    context('when the company is successfully updated', () => {
      let middlewareParams

      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v4/company/1')
          .reply(200, { all: 'good' })

        middlewareParams = buildMiddlewareParameters({
          company: { id: '1' },
          requestBody: companyMock,
        })

        await postEditCompany(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should flash a created message', () => {
        expect(middlewareParams.reqMock.flash).to.be
          .calledOnceWithExactly('success', 'Company record updated')
      })

      it('should respond with the created company', () => {
        expect(middlewareParams.resMock.json).to.be
          .calledOnceWithExactly({ all: 'good' })
      })

      it('should not call next() with an error', async () => {
        expect(middlewareParams.nextSpy).to.not.have.been.called
      })
    })

    context('when there is an error', () => {
      let middlewareParams

      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v4/company/1')
          .reply(500, 'Error message')

        middlewareParams = buildMiddlewareParameters({
          company: { id: '1' },
          requestBody: companyMock,
        })

        await postEditCompany(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should not flash a created message', () => {
        expect(middlewareParams.reqMock.flash).to.not.have.been.called
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
