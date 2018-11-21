const config = require('~/config')

describe('Investment list controller', () => {
  beforeEach(() => {
    this.req = {
      session: {
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
        token: 'abcd',
      },
      query: {
        sortby: 'estimated_land_date:asc',
      },
    }
    this.res = {
      render: sinon.spy(),
      query: {},
    }
    this.nextSpy = sinon.spy()

    nock(config.apiRoot)
      .get('/metadata/sector/?level__lte=0')
      .reply(200, [
        { id: 's1', name: 's1', disabled_on: null },
      ])
  })

  describe('#renderInvestmentList', () => {
    context('when the list renders successfully', () => {
      beforeEach(async () => {
        const controller = require('~/src/apps/investment-projects/controllers/list')

        await controller.renderInvestmentList(this.req, this.res, this.nextSpy)
      })

      it('should render', () => {
        expect(this.res.render).to.be.calledOnce
      })

      it('should render the collection template', () => {
        expect(this.res.render.firstCall.args[0]).to.equal('_layouts/collection')
      })

      it('should render the view with a title', () => {
        expect(this.res.render.firstCall.args[1].title).to.equal('Investment Projects')
      })

      it('should render the view with a count label', () => {
        expect(this.res.render.firstCall.args[1].countLabel).to.equal('project')
      })

      it('should render the view with a sort form', () => {
        expect(this.res.render.firstCall.args[1].sortForm).to.not.be.undefined
      })

      it('should render the view with selected filters', () => {
        expect(this.res.render.firstCall.args[1].selectedFilters).to.not.be.undefined
      })

      it('should render the view with an export action', () => {
        expect(this.res.render.firstCall.args[1].exportAction).to.deep.equal({ enabled: false })
      })

      it('should render the view with filter fields', () => {
        expect(this.res.render.firstCall.args[1].filtersFields).to.not.be.undefined
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        this.error = new Error('error')
        const erroneousSpy = sinon.stub().throws(this.error)

        const controller = proxyquire('~/src/apps/investment-projects/controllers/list', {
          '../../builders': {
            buildSelectedFiltersSummary: erroneousSpy,
            buildFieldsWithSelectedEntities: sinon.stub(),
          },
        })

        await controller.renderInvestmentList(this.req, this.res, this.nextSpy)
      })

      it('should not render the view', () => {
        expect(this.res.render).to.not.be.called
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
        expect(this.nextSpy).to.have.been.calledOnce
      })
    })
  })
})
