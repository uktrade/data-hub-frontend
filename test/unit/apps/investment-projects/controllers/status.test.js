const { merge, find } = require('lodash')

describe('investment status controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.updateInvestmentStub = this.sandbox.stub().resolves()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/status', {
      '../repos': {
        updateInvestment: this.updateInvestmentStub,
      },
    })

    this.req = {
      session: {
        token: 'abcd',
      },
      body: {},
      params: {
        investmentId: '111',
      },
      flash: this.sandbox.spy(),
    }

    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      title: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {
        investmentData: {
          id: '111',
          status: 'open',
        },
      },
    }

    this.next = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderStatusPage', () => {
    context('when rendering a form for first time', () => {
      beforeEach(async () => {
        this.status = 'open'
        this.res.locals.investmentData.status = this.status
        await this.controller.renderStatusPage(this.req, this.res, this.next)
      })

      it('should render the status page', () => {
        expect(this.res.render).to.be.calledWith('investment-projects/views/status')
      })

      it('should render the status page with a return link', async () => {
        const actual = this.res.render.getCall(0).args[1].statusForm.returnLink

        expect(actual).to.equal('/investment-projects/111/details')
      })

      it('should render the status page with a status form', () => {
        const actual = this.res.render.getCall(0).args[1].statusForm.children
        expect(actual).to.be.an('array')
      })

      it('should rnder the status page form with the existing status', () => {
        const statusForm = this.res.render.getCall(0).args[1].statusForm
        const actualStatus = find(statusForm.children, { name: 'status' }).value

        expect(actualStatus).to.equal(this.status)
      })
    })

    context('when re-rendering a form with errors', () => {
      beforeEach(async () => {
        this.status = 'bad'

        this.messages = {
          status: 'error 1',
        }

        this.res = merge({}, this.res, {
          locals: {
            errors: this.messages,
          },
        })

        this.req = merge({}, this.req, {
          body: {
            status: this.status,
          },
        })

        await this.controller.renderStatusPage(this.req, this.res, this.next)
      })

      it('should render the status page', () => {
        expect(this.res.render).to.be.calledWith('investment-projects/views/status')
      })

      it('should render the status page with a return link', async () => {
        const actual = this.res.render.getCall(0).args[1].statusForm.returnLink

        expect(actual).to.equal('/investment-projects/111/details')
      })

      it('should render the status page with a status form', () => {
        const actual = this.res.render.getCall(0).args[1].statusForm.children
        expect(actual).to.be.an('array')
      })

      it('should render the status page form with posted status', () => {
        const statusForm = this.res.render.getCall(0).args[1].statusForm
        const actualStatus = find(statusForm.children, { name: 'status' }).value

        expect(actualStatus).to.equal(this.status)
      })

      it('should indicate there is an error for status', () => {
        const statusForm = this.res.render.getCall(0).args[1].statusForm
        const actualStatusError = find(statusForm.children, { name: 'status' }).error

        expect(actualStatusError).to.equal(this.messages.status)
      })
    })
  })

  describe('#postStatus', () => {
    beforeEach(() => {
      this.req.body = {
        status: 'test',
      }
    })

    context('when a post is good', () => {
      beforeEach(async () => {
        await this.controller.postStatus(this.req, this.res, this.next)
      })

      it('should save the data to the API', () => {
        expect(this.updateInvestmentStub).to.be.calledWith(this.req.session.token, this.req.params.investmentId, { status: 'test' })
      })

      it('should send a flash message with an update', () => {
        expect(this.req.flash).to.be.calledWith('success', 'Investment details updated')
      })

      it('should redirect the user back to the details screen', () => {
        expect(this.res.redirect).to.be.calledWith('/investment-projects/111/details')
      })
    })

    context('when a post causes form errors', () => {
      beforeEach(async () => {
        this.error = this.sandbox.stub()

        this.updateInvestmentStub.rejects({
          statusCode: 400,
          error: this.error,
        })

        await this.controller.postStatus(this.req, this.res, this.next)
      })

      it('should set the local errors value', () => {
        expect(this.res.locals.errors).to.deep.equal(this.error)
      })

      it('should call the next link the chain', () => {
        expect(this.next).to.be.calledWith()
      })
    })

    context('when a post causes an unknown error', () => {
      beforeEach(async () => {
        this.error = this.sandbox.stub()

        this.updateInvestmentStub.rejects(this.error)

        await this.controller.postStatus(this.req, this.res, this.next)
      })

      it('should call the next link the chain with the error', () => {
        expect(this.next).to.be.calledWith(this.error)
      })
    })
  })
})
