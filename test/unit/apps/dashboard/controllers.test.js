describe('dashboard controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.reqMock = Object.assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })

    this.resMock = {
      locals: {},
      render: this.sandbox.spy(),
      title: this.sandbox.stub().returnsThis(),
    }

    this.nextSpy = this.sandbox.spy()

    this.fetchHomepageDataStub = this.sandbox.stub()

    this.controllers = proxyquire('~/src/apps/dashboard/controllers', {
      './repos': {
        fetchHomepageData: this.fetchHomepageDataStub,
      },
    })
  })

  context('when there are no errors calling the API', () => {
    beforeEach(async () => {
      this.dashData = {
        contacts: [{
          id: '1234',
        }],
        interactions: [{
          id: '4321',
        }],
      }

      this.fetchHomepageDataStub.resolves(this.dashData)
      await this.controllers.renderDashboard(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should render the dashboard template', () => {
      expect(this.resMock.render).to.be.calledWith('dashboard/views/dashboard')
    })

    it('should render the page with contacts', () => {
      const renderOptions = this.resMock.render.firstCall.args[1]
      expect(renderOptions.contacts).to.deep.equal(this.dashData.contacts)
    })

    it('sould render the page with interactions', () => {
      const renderOptions = this.resMock.render.firstCall.args[1]
      expect(renderOptions.interactions).to.deep.equal(this.dashData.interactions)
    })

    it('should not call next', () => {
      expect(this.nextSpy).to.not.have.been.called
    })

    it('should set a page title', () => {
      expect(this.resMock.title).to.be.calledWith('Dashboard')
    })
  })

  context('when there is a problem calling the API', () => {
    beforeEach(async () => {
      this.error = { status: 500 }
      this.fetchHomepageDataStub.rejects(this.error)
      await this.controllers.renderDashboard(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should show an error', () => {
      expect(this.nextSpy).to.have.been.calledWith(this.error)
    })

    it('should not render the page', () => {
      expect(this.resMock.render).to.not.have.been.called
    })
  })
})
