const { renderAddGlobalHQ } = require('~/src/apps/companies/controllers/hierarchies')

describe('Companies hierarchies controller', () => {
  const companyId = 'mock-id'
  const companyName = 'mock-name'

  beforeEach(() => {
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.resMock = {
      ...globalRes,
      breadcrumb: this.breadcrumbStub,
      render: sandbox.spy(),
      locals: {
        company: {
          id: companyId,
          name: companyName,
        },
      },
    }
    this.reqMock = {
      ...globalReq,
    }
    this.nextSpy = sandbox.spy()
  })

  describe('#renderAddGlobalHQ', () => {
    beforeEach(() => {
      renderAddGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should call breadcrumb', () => {
      expect(this.resMock.breadcrumb).to.be.calledTwice
    })

    it('should call breadcrumb with', () => {
      expect(this.resMock.breadcrumb).to.be.calledWith(companyName, `/companies/${companyId}`)
    })

    it('should call breadcrumb with', () => {
      expect(this.resMock.breadcrumb).to.be.calledWith('Link Global HQ')
    })

    it('should call render', () => {
      expect(this.resMock.render).to.be.calledOnce
      expect(this.resMock.render).to.be.calledWith('companies/views/add-global-hq.njk')
    })
  })
})
