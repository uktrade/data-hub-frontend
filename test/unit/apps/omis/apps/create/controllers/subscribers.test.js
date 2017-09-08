const FormController = require('hmpo-form-wizard').Controller

const getAdvisersMock = require('~/test/unit/data/investment/interaction/advisers')

describe('OMIS create subscribers controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getAdvisersStub = this.sandbox.stub().resolves(getAdvisersMock)

    this.ControllerClass = proxyquire('~/src/apps/omis/apps/create/controllers/subscribers', {
      '../../../../adviser/repos': {
        getAdvisers: this.getAdvisersStub,
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
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
              subscribers: {},
            },
          },
        },
      })

      FormController.prototype.configure = this.sandbox.spy()
    })

    it('should set options for advisers', (done) => {
      FormController.prototype.configure = (req, res, next) => {
        try {
          expect(req).to.deep.equal(this.reqMock)
          expect(res).to.deep.equal(globalRes)
          next()
        } catch (err) {
          done(err)
        }
      }

      const nextSpy = () => {
        try {
          expect(this.reqMock.form.options.fields.subscribers.options).to.deep.equal([
            {
              value: '0513453c-86bc-e211-a646-e4115bead28a',
              label: 'Tom Thumb',
            },
          ])
          done()
        } catch (err) {
          done(err)
        }
      }

      this.controller.configure(this.reqMock, globalRes, nextSpy)
    })
  })
})
