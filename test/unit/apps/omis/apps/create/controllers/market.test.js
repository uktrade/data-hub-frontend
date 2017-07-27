const FormController = require('hmpo-form-wizard').Controller

const Controller = proxyquire('~/src/apps/omis/apps/create/controllers/market', {
  '../../../../../lib/metadata': {
    countryOptions: [{
      id: '1',
      name: 'One',
    }, {
      id: '2',
      name: 'Two',
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

      FormController.prototype.configure = this.sandbox.spy()
    })

    it('should set the list of markets', () => {
      this.controller.configure(this.reqMock, globalRes, this.nextSpy)

      expect(this.reqMock.form.options.fields.primary_market.options).to.deep.equal([
        {
          value: '1',
          label: 'One',
        },
        {
          value: '2',
          label: 'Two',
        },
      ])
      expect(FormController.prototype.configure).to.be.calledWith(this.reqMock, globalRes, this.nextSpy)
    })
  })
})
