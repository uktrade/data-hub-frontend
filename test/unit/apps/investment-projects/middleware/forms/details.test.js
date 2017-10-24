describe('investment details middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()

    this.updateInvestmentStub = this.sandbox.stub().resolves({ id: '999' })
    this.createInvestmentStub = this.sandbox.stub().resolves({ id: '888' })

    this.req = {
      session: {
        token: '1234',
      },
      body: {},
      params: {},
    }

    this.res = {
      locals: {
        form: {},
      },
    }

    this.detailsMiddleware = proxyquire('~/src/apps/investment-projects/middleware/forms/details', {
      '../../repos': {
        updateInvestment: this.updateInvestmentStub,
        createInvestmentProject: this.createInvestmentStub,
      },
    })
  })

  describe('#handleFormPost', () => {
    context('when saving a new investment project', () => {
      beforeEach(async () => {
        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should create a new investment', () => {
        expect(this.createInvestmentStub).to.be.calledOnce
      })
    })

    context('when editing an existing investment project', () => {
      beforeEach(async () => {
        this.req.params.investmentId = '777'
        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should create a new investment', () => {
        expect(this.updateInvestmentStub).to.be.calledOnce
      })
    })

    context('when saving the form raises no errors', () => {
      beforeEach(async () => {
        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should call next', () => {
        expect(this.next).to.be.called
      })
    })

    context('when saving form raises an error', () => {
      beforeEach(async () => {
        this.err = {
          statusCode: 400,
          error: {},
        }

        this.createInvestmentStub.rejects(this.err)
      })

      context('and a single contact and business activity are provided', () => {
        beforeEach(async () => {
          this.req.body = {
            client_contacts: '1234',
            business_activities: '4321',
          }

          await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
        })

        it('should return contacts to the form as an array', () => {
          expect(this.res.locals.form.state.client_contacts).to.deep.equal(['1234'])
        })

        it('should return activities to the form as an array', () => {
          expect(this.res.locals.form.state.business_activities).to.deep.equal(['4321'])
        })
      })

      context('and multiple contacts and business activities are provided', () => {
        beforeEach(async () => {
          this.req.body = {
            client_contacts: ['1234', '5678'],
            business_activities: ['4321', '8765'],
          }

          await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
        })

        it('should return contacts to the form as an array', () => {
          expect(this.res.locals.form.state.client_contacts).to.deep.equal(['1234', '5678'])
        })

        it('should return activities to the form as an array', () => {
          expect(this.res.locals.form.state.business_activities).to.deep.equal(['4321', '8765'])
        })
      })
    })

    context('the user select add another contact', () => {
      beforeEach(async () => {
        this.req.body = {
          client_contacts: ['1234', '5678'],
          business_activities: ['4321', '8765'],
          'add-item': 'client_contacts',
        }

        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should not save the data', () => {
        expect(this.updateInvestmentStub).to.not.be.called
      })

      it('should return a form state with an additional empty contact', () => {
        expect(this.res.locals.form.state.client_contacts).to.deep.equal(['1234', '5678', ''])
      })
    })

    context('the user select add another business activity', () => {
      beforeEach(async () => {
        this.req.body = {
          client_contacts: ['1234', '5678'],
          business_activities: ['4321', '8765'],
          'add-item': 'business_activities',
        }

        await this.detailsMiddleware.handleFormPost(this.req, this.res, this.next)
      })

      it('should not save the data', () => {
        expect(this.updateInvestmentStub).to.not.be.called
      })

      it('should return a form state with an additional empty contact', () => {
        expect(this.res.locals.form.state.business_activities).to.deep.equal(['4321', '8765', ''])
      })
    })
  })
})
