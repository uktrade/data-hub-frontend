describe('Companies account management controller', () => {
  beforeEach(() => {
    this.controller = require('~/src/apps/companies/controllers/account-management')
    this.reqMock = {
      session: {
        token: 'abcd',
      },
      body: {},
    }
    this.resMock = {
      breadcrumb: sandbox.stub().returnsThis(),
      title: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      redirect: sandbox.spy(),
      locals: {
        entityName: 'company',
        returnLink: 'return',
        company: {
          id: '1',
          name: 'Company',
        },
        advisers: [],
      },
    }
    this.nextSpy = sandbox.spy()
  })

  describe('#renderAccountManagementEditPage', () => {
    beforeEach(async () => {
      await this.controller.renderAccountManagementEditPage(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should add a breadcrumb', async () => {
      expect(this.resMock.breadcrumb.firstCall).to.be.calledWith('Edit account management')
      expect(this.resMock.breadcrumb).to.have.been.calledOnce
    })

    it('should add a title', async () => {
      expect(this.resMock.title.firstCall).to.be.calledWith('Edit account management for Company')
      expect(this.resMock.title).to.have.been.calledOnce
    })

    it('should render the account management page', async () => {
      expect(this.resMock.render).to.be.calledWith('companies/views/account-management-edit')
      expect(this.resMock.render).to.have.been.calledOnce
    })

    it('should render the account management page with a return link', async () => {
      const actual = this.resMock.render.getCall(0).args[1].accountManagementForm.returnLink
      expect(actual).to.equal('/companies/1')
    })
  })
})
