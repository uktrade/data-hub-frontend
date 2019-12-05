const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')

const companyMock = require('../../../../../test/unit/data/companies/minimal-company.json')
const { renderAddGlobalHQ } = require('../hierarchies')

describe('Companies hierarchies controller', () => {
  describe('#renderAddGlobalHQ', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      renderAddGlobalHQ(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should call breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledTwice
    })

    it('should call breadcrumb with', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `/companies/${companyMock.id}`)
    })

    it('should call breadcrumb with', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith('Link Global HQ')
    })

    it('should call render', () => {
      expect(this.middlewareParameters.resMock.render).to.be.calledOnce
      expect(this.middlewareParameters.resMock.render).to.be.calledWith('companies/views/add-global-hq.njk')
    })
  })
})
