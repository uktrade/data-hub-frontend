const { assign } = require('lodash')

const { apiRoot } = require('~/config')
const FormController = require('~/src/apps/omis/controllers/form')
const Controller = require('~/src/apps/omis/apps/create/controllers/market')

const marketOptionsMock = [
  { id: '9999', name: 'United Kingdom' },
  { id: '8888', name: 'Germany' },
]

describe('OMIS create market controller', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.controller = new Controller({ route: '/' })
  })

  describe('configure()', () => {
    context('when getOptions returns 200', () => {
      beforeEach(async () => {
        nock(apiRoot)
          .get('/v4/metadata/omis-market')
          .reply(200, marketOptionsMock)

        this.reqMock = assign({}, globalReq, {
          form: {
            options: {
              fields: {
                primary_market: {},
              },
            },
          },
        })

        sinon.spy(FormController.prototype, 'configure')
        await this.controller.configure(this.reqMock, globalRes, this.nextSpy)
      })

      it('should set list of markets dynamically', () => {
        expect(this.reqMock.form.options.fields.primary_market.options).to.deep.equal([
          { value: '8888', label: 'Germany' },
          { value: '9999', label: 'United Kingdom' },
        ])
      })

      it('should call parent configure method', () => {
        expect(FormController.prototype.configure).to.be.calledOnce
        expect(FormController.prototype.configure).to.be.calledWith(this.reqMock, globalRes, this.nextSpy)
      })
    })

    context('when getOptions returns an error', () => {
      beforeEach(async () => {
        this.errorMessageMock = 'ERROR_REASON'

        nock(apiRoot)
          .get('/v4/metadata/omis-market')
          .replyWithError(this.errorMessageMock)

        await this.controller.configure(globalReq, globalRes, this.nextSpy)
      })

      it('should call next with the error', () => {
        const errorArgument = this.nextSpy.args[0][0]

        expect(this.nextSpy).to.be.calledOnce
        expect(errorArgument instanceof Error).to.be.true
        expect(errorArgument.message).to.equal(`Error: ${this.errorMessageMock}`)
      })
    })
  })
})
