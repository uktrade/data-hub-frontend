const FormController = require('~/src/apps/omis/controllers/form')

const Controller = proxyquire('~/src/apps/omis/apps/create/controllers/market', {
  '../../../../../lib/metadata': {
    omisMarketOptions: [{
      id: '1',
      name: 'One',
      disabled_on: null,
    }, {
      id: '2',
      name: 'Two',
      disabled_on: '2010-01-01T00:00:00',
    }, {
      id: '3',
      name: 'Three',
      disabled_on: null,
    }],
  },
})

describe('OMIS create market controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.controller = new Controller({ route: '/' })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('configure()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        form: {
          options: {
            fields: {
              primary_market: {},
            },
          },
        },
      })

      this.sandbox.spy(FormController.prototype, 'configure')
    })

    it('should set the list of markets', () => {
      this.controller.configure(this.reqMock, globalRes, this.nextSpy)

      expect(this.reqMock.form.options.fields.primary_market.options).to.deep.equal([
        {
          value: '1',
          label: 'One',
        },
        {
          value: '3',
          label: 'Three',
        },
      ])
      expect(FormController.prototype.configure).to.be.calledWith(this.reqMock, globalRes, this.nextSpy)
    })
  })
})
