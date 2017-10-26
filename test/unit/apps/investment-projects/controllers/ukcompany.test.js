const investmentData = { investor_company: { name: 'company' } }

describe('investment uk company', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.updateInvestmentStub = this.sandbox.stub().resolves(investmentData)
    this.searchStub = this.sandbox.stub().resolves()
    this.transformerStub = this.sandbox.stub()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/ukcompany', {
      '../../search/services': {
        searchCompanies: this.searchStub,
      },
      '../repos': {
        updateInvestment: this.updateInvestmentStub,
      },
      '../../search/transformers': {
        transformApiResponseToSearchCollection: this.transformerStub,
      },
    })

    this.req = {
      params: {
        investmentId: '1',
      },
      query: {},
      session: {
        token: 'abcd',
      },
      flash: this.sandbox.spy(),
    }
    this.res = {
      locals: {
        investmentData: {
          name: 'investment',
        },
      },
      render: this.sandbox.spy(),
      breadcrumb: this.sandbox.stub().returnsThis(),
      redirect: this.sandbox.spy(),
    }
    this.next = this.sandbox.spy()
  })

  describe('#selectUKCompany', () => {
    context('when a uk company is selected', () => {
      context('server has no errors', () => {
        beforeEach(async () => {
          this.req.query.company = '1234'

          await this.controller.selectUKCompany(this.req, this.res, this.next)
        })

        it('should save the change to the investment project', () => {
          expect(this.updateInvestmentStub).to.be.calledWith('abcd', '1', {
            uk_company: '1234',
          })
        })

        it('should set a flash message to say it updated', () => {
          expect(this.req.flash).to.be.calledWith('success', 'Investment details updated')
        })

        it('should redirect the user back to the investment details page.', () => {
          expect(this.res.redirect).to.be.calledWith('/investment-projects/1/details')
        })
      })

      context('server returns an error', () => {
        beforeEach(async () => {
          this.req.query.company = '1234'
          this.error = this.sandbox.stub()

          this.updateInvestmentStub.rejects(this.error)

          await this.controller.selectUKCompany(this.req, this.res, this.next)
        })

        it('should call next with the error', () => {
          expect(this.next).to.be.calledWith(this.error)
        })

        it('should not redirect the user', () => {
          expect(this.res.redirect).to.not.be.called
        })
      })
    })

    context('when a uk company is not selected', () => {
      beforeEach(async () => {
        await this.controller.selectUKCompany(this.req, this.res, this.next)
      })

      it('should not save anything', () => {
        expect(this.updateInvestmentStub).to.not.be.called
      })

      it('should not redirect the user', () => {
        expect(this.res.redirect).to.not.be.called
      })

      it('should just call next', () => {
        expect(this.next).to.be.calledWith()
      })
    })
  })

  describe('#searchForUKCompany', () => {
    context('when a search term is provided', () => {
      context('and search returns results', () => {
        beforeEach(async () => {
          this.req.query.term = 'test'
          await this.controller.searchForUKCompany(this.req, this.res, this.next)
        })

        it('should call search', () => {
          expect(this.searchStub).to.be.calledWith({
            token: 'abcd',
            searchTerm: 'test',
            isUkBased: true,
          })
        })

        it('should transform the result', () => {
          expect(this.transformerStub).to.be.calledOnce
        })

        it('should pass the result onto the next controller', () => {
          expect(this.res.locals).to.have.property('results')
        })
      })

      context('and search causes an error', () => {
        beforeEach(async () => {
          this.req.query.term = 'test'
          this.error = this.sandbox.stub()
          this.searchStub.rejects(this.error)
          await this.controller.searchForUKCompany(this.req, this.res, this.next)
        })

        it('should pass the error to next', () => {
          expect(this.next).to.be.calledWith(this.error)
        })
      })
    })

    context('when no search term is provided', () => {
      beforeEach(async () => {
        await this.controller.searchForUKCompany(this.req, this.res, this.next)
      })

      it('should not call search', () => {
        expect(this.searchStub).to.not.be.called
      })

      it('should call next', () => {
        expect(this.next).to.be.calledWith()
      })
    })
  })

  describe('#renderCompanyResults', () => {
    beforeEach(() => {
      this.controller.renderCompanyResults(this.req, this.res, this.next)
    })

    it('should render the correct template', () => {
      expect(this.res.render).to.be.calledWith('investment-projects/views/ukcompany')
    })
  })

  describe('#removeUKCompany', () => {
    context('when there is an id', () => {
      beforeEach(async () => {
        await this.controller.removeUKCompany(this.req, this.res, this.next)
      })

      it('should update the investment record', () => {
        expect(this.updateInvestmentStub).to.be.calledWith('abcd', '1', { uk_company: null })
      })

      it('should redirect back to the details page', () => {
        expect(this.res.redirect).to.be.calledWith('/investment-projects/1/details')
      })
    })

    context('when there is an error removing the company from the investment', () => {
      beforeEach(async () => {
        this.error = this.sandbox.stub()

        this.updateInvestmentStub.rejects(this.error)
        await this.controller.removeUKCompany(this.req, this.res, this.next)
      })

      it('should call next with the error', () => {
        expect(this.next).to.be.calledWith(this.error)
      })

      it('should not redirect the user', () => {
        expect(this.res.redirect).to.not.be.called
      })
    })
  })
})
