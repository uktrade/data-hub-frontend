const config = require('~/config')

describe('Investment profile controller', () => {
  const metadataMock = {
    sectorOptions: [
      { id: 's1', name: 's1', disabled_on: null },
    ],
    adviserOptions: {
      results: [
        { id: 'ad1', name: 'ad1', is_active: true, dit_team: { name: 'ad1' } },
      ],
    },
  }

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
      locals: {
        userAgent: {
          isIE: false,
        },
      },
    }
    this.nextSpy = sinon.spy()

    nock(config.apiRoot)
      .get('/metadata/sector/?level__lte=0')
      .reply(200, metadataMock.sectorOptions)
      .get('/adviser/?limit=100000&offset=0')
      .reply(200, metadataMock.adviserOptions)
  })

  describe('#renderProfilesView', () => {
    context('when the list renders successfully', () => {
      beforeEach(async () => {
        const controller = require('~/src/apps/investments/controllers/profiles')

        await controller.renderProfilesView(this.req, this.res, this.nextSpy)
      })

      it('should render', () => {
        expect(this.res.render).to.be.calledOnce
      })

      it('should render the collection template', () => {
        expect(this.res.render.firstCall.args[0]).to.equal('investments/views/profiles')
      })

      it('should render the view with a title', () => {
        expect(this.res.render.firstCall.args[1].title).to.equal('Investments')
      })

      it.skip('should render the view with a count label', () => {
        expect(this.res.render.firstCall.args[1].countLabel).to.equal('project')
      })

      it.skip('should render the view with a sort form', () => {
        expect(this.res.render.firstCall.args[1].sortForm).to.exist
      })

      it.skip('should render the view with selected filters', () => {
        expect(this.res.render.firstCall.args[1].selectedFilters).to.exist
      })

      it.skip('should render the view with an export action', () => {
        expect(this.res.render.firstCall.args[1].exportAction).to.deep.equal({ enabled: false })
      })

      it.skip('should render the view with filter fields', () => {
        expect(this.res.render.firstCall.args[1].filtersFields).to.exist
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        this.error = new Error('error')
        const erroneousSpy = sinon.stub().throws(this.error)

        const controller = proxyquire('~/src/apps/investments/controllers/profiles', {
          '../../builders': {
            buildSelectedFiltersSummary: erroneousSpy,
            buildFieldsWithSelectedEntities: sinon.stub(),
          },
        })

        await controller.renderProfilesView(this.req, this.res, this.nextSpy)
      })

      it.skip('should not render the view', () => {
        expect(this.res.render).to.not.be.called
      })

      it.skip('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
        expect(this.nextSpy).to.have.been.calledOnce
      })
    })
  })
})
