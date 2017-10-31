const investmentCollection = require('~/test/unit/data/investment/collection.json')

const investmentData = { investor_company: { name: 'company' } }

describe('investment associated controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.updateInvestmentStub = this.sandbox.stub().resolves(investmentData)
    this.searchStub = this.sandbox.stub().resolves(investmentCollection)
    this.transformerStub = this.sandbox.stub()
    this.transformInvestmentProjectToListItemStub = this.sandbox.stub()
    this.transformInvestmentListItemToDisableMetaLinksStub = this.sandbox.stub().returns({ id: 1 })

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/associated', {
      '../repos': {
        updateInvestment: this.updateInvestmentStub,
      },
      '../../search/services': {
        searchInvestments: this.searchStub,
      },
      '../../../lib/metadata': {
        investmentTypeOptions: [{
          id: '031269ab-b7ec-40e9-8a4e-7371404f0622',
          name: 'Commitment to invest',
          disabled_on: null,
        }, {
          id: '3e143372-496c-4d1e-8278-6fdd3da9b48b',
          'name': 'FDI',
          disabled_on: null,
        }, {
          id: '9c364e64-2b28-401b-b2df-50e08b0bca44',
          name: 'Non-FDI',
          disabled_on: null,
        }],
      },
      '../transformers': {
        transformInvestmentProjectToListItem: this.transformInvestmentProjectToListItemStub,
        transformInvestmentListItemToDisableMetaLinks: this.transformInvestmentListItemToDisableMetaLinksStub,
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

  describe('#selectAssociatedInvestmentProject', () => {
    context('when a project is selected', () => {
      context('server has no errors', () => {
        beforeEach(async () => {
          this.req.query.project = '1234'
          await this.controller.selectAssociatedInvestmentProject(this.req, this.res, this.next)
        })

        it('should save the change to the investment project', () => {
          expect(this.updateInvestmentStub).to.be.calledWith('abcd', '1', {
            associated_non_fdi_r_and_d_project: '1234',
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
          this.req.query.project = '1234'
          this.error = this.sandbox.stub()

          this.updateInvestmentStub.rejects(this.error)

          await this.controller.selectAssociatedInvestmentProject(this.req, this.res, this.next)
        })

        it('should call next with the error', () => {
          expect(this.next).to.be.calledWith(this.error)
        })

        it('should not redirect the user', () => {
          expect(this.res.redirect).to.not.be.called
        })
      })
    })

    context('when a project is not selected', () => {
      beforeEach(async () => {
        await this.controller.selectAssociatedInvestmentProject(this.req, this.res, this.next)
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

  describe('#searchForAssociatedInvestmentProject', () => {
    context('when a search term is provided', () => {
      beforeEach(() => {
        this.req.query = Object.assign({}, this.req.query, {
          term: 'test',
          page: '2',
        })
      })

      context('and search returns results', () => {
        beforeEach(async () => {
          await this.controller.searchForAssociatedInvestmentProject(this.req, this.res, this.next)
        })

        it('should call search with the search term', () => {
          expect(this.searchStub).to.be.called

          const params = this.searchStub.firstCall.args[0]
          expect(params.searchTerm).equal('test')
        })

        it('should filter search to only include non-FDI results', () => {
          const params = this.searchStub.firstCall.args[0]
          expect(params.filters.investment_type).to.equal('9c364e64-2b28-401b-b2df-50e08b0bca44')
        })

        it('should allow the user to page through results', () => {
          const params = this.searchStub.firstCall.args[0]
          expect(params.page).to.equal('2')
        })

        it('should transform into an investment result collection item', () => {
          expect(this.transformInvestmentProjectToListItemStub).to.be.called
        })

        it('should transform the result to disable meta item links', () => {
          expect(this.transformInvestmentListItemToDisableMetaLinksStub).to.be.called
        })

        it('should pass the result to the next controller', () => {
          expect(this.res.locals).to.have.property('results')
        })
      })

      context('and search throw an error', () => {
        beforeEach(async () => {
          this.error = this.sandbox.stub()
          this.searchStub.rejects(this.error)
          await this.controller.searchForAssociatedInvestmentProject(this.req, this.res, this.next)
        })

        it('should call next with the error', () => {
          expect(this.next).to.be.calledWith(this.error)
        })
      })
    })

    context('when no search term is provided', () => {
      beforeEach(async () => {
        await this.controller.searchForAssociatedInvestmentProject(this.req, this.res, this.next)
      })

      it('should not call search', () => {
        expect(this.searchStub).to.not.be.called
      })

      it('should call next', () => {
        expect(this.next).to.be.calledWith()
      })
    })
  })

  describe('#renderAssociatedInvestmentProjectResults', () => {
    beforeEach(() => {
      this.controller.renderAssociatedInvestmentProjectResults(this.req, this.res, this.next)
    })

    it('should render the correct template', () => {
      expect(this.res.render).to.be.calledWith('investment-projects/views/associated')
    })
  })

  describe('#removeAssociatedInvestmentProject', () => {
    context('when there is an id', () => {
      beforeEach(async () => {
        await this.controller.removeAssociatedInvestmentProject(this.req, this.res, this.next)
      })

      it('should update the investment record', () => {
        expect(this.updateInvestmentStub).to.be.calledWith('abcd', '1', { associated_non_fdi_r_and_d_project: null })
      })

      it('should redirect back to the details page', () => {
        expect(this.res.redirect).to.be.calledWith('/investment-projects/1/details')
      })
    })

    context('when there is an error removing the association from the investment', () => {
      beforeEach(async () => {
        this.error = this.sandbox.stub()

        this.updateInvestmentStub.rejects(this.error)
        await this.controller.removeAssociatedInvestmentProject(this.req, this.res, this.next)
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
