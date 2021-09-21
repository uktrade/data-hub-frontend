const config = require('../../../../../config')
const controller = require('../controllers')

describe('OMIS list controllers', () => {
  beforeEach(() => {
    this.req = {
      session: {
        token: 'abcd',
        user: {
          permissions: ['order.export_order'],
        },
      },
      query: {},
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      query: {},
    }

    this.nextSpy = sinon.spy()

    const metaMock = [
      { id: '1', name: 'm1', disabled_on: null },
      { id: '2', name: 'm2', disabled_on: null },
      { id: '3', name: 'm3', disabled_on: null },
    ]

    nock(config.apiRoot)
      .get('/v4/metadata/sector?level__lte=0')
      .reply(200, metaMock)
      .get('/v4/metadata/omis-market')
      .reply(200, metaMock)
      .get('/v4/metadata/uk-region')
      .reply(200, metaMock)
  })

  describe('renderList()', () => {
    beforeEach(async () => {
      await controller.renderList(this.req, this.res, this.nextSpy)
      this.renderOptions = this.res.render.firstCall.args[1]
    })

    it('should call render method', () => {
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should lookup options for the form', () => {
      expect(nock.isDone()).to.be.true
    })

    it('should pass a sortform the view', () => {
      expect(this.renderOptions).to.have.property('sortForm')
    })

    it('should pass a filter form to the view', () => {
      expect(this.renderOptions).to.have.property('filtersFields')
    })

    it('should pass a summary of selected filters to the view', () => {
      expect(this.renderOptions).to.have.property('selectedFilters')
    })
  })
})
