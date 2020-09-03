const { assign } = require('lodash')

const { apiRoot } = require('../../../../../../config')
const FormController = require('../../../../controllers/form')
const Controller = require('../sector')

const sectorOptionsMock = [
  { id: '9999', name: 'ICT' },
  { id: '8888', name: 'Farming' },
]

describe('OMIS create sector controller', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.controller = new Controller({ route: '/' })
  })

  describe('configure()', () => {
    context('when getOptions returns 200', () => {
      beforeEach(async () => {
        nock(apiRoot).get('/v4/metadata/sector').reply(200, sectorOptionsMock)

        this.reqMock = assign({}, globalReq, {
          form: {
            options: {
              fields: {
                sector: {},
              },
            },
          },
        })

        sinon.spy(FormController.prototype, 'configure')
        await this.controller.configure(this.reqMock, globalRes, this.nextSpy)
      })

      it('should set list of markets dynamically', () => {
        expect(this.reqMock.form.options.fields.sector.options).to.deep.equal([
          { value: '8888', label: 'Farming' },
          { value: '9999', label: 'ICT' },
        ])
      })

      it('should call parent configure method', () => {
        expect(FormController.prototype.configure).to.be.calledOnce
        expect(FormController.prototype.configure).to.be.calledWith(
          this.reqMock,
          globalRes,
          this.nextSpy
        )
      })
    })

    context('when getOptions returns an error', () => {
      beforeEach(async () => {
        this.errorMessageMock = 'ERROR_REASON'

        nock(apiRoot)
          .get('/v4/metadata/sector')
          .replyWithError(this.errorMessageMock)

        await this.controller.configure(globalReq, globalRes, this.nextSpy)
      })

      it('should call next with the error', () => {
        const errorArgument = this.nextSpy.args[0][0]

        expect(this.nextSpy).to.be.calledOnce
        expect(errorArgument instanceof Error).to.be.true
        expect(errorArgument.message).to.equal(
          `Error: ${this.errorMessageMock}`
        )
      })
    })
  })

  describe('saveValues()', () => {
    beforeEach(() => {
      this.reqMock = assign({}, globalReq, {
        form: {
          values: {},
        },
      })
      this.resMock = assign({}, globalRes, {
        locals: {
          company: {
            sector: {
              id: 'b3959812-6095-e211-a939-e4115bead28a',
              name: 'ICT',
            },
          },
        },
      })

      sinon.stub(FormController.prototype, 'saveValues')
    })

    context("when using company's sector", () => {
      beforeEach(() => {
        this.reqMock.form.values.use_sector_from_company = 'true'

        this.controller.saveValues(this.reqMock, this.resMock, this.nextSpy)
      })

      it("should set sector to company's sector value", () => {
        expect(this.reqMock.form.values.sector).to.equal(
          'b3959812-6095-e211-a939-e4115bead28a'
        )
      })

      it('should call parent saveValues method', () => {
        expect(FormController.prototype.saveValues).to.have.been.calledOnce
      })
    })

    context('when setting a custom sector', () => {
      beforeEach(() => {
        this.reqMock.form.values.use_sector_from_company = 'false'
        this.reqMock.form.values.sector = '98d14e94-5d95-e211-a939-e4115bead28a'

        this.controller.saveValues(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set sector to custom sector value', () => {
        expect(this.reqMock.form.values.sector).to.equal(
          '98d14e94-5d95-e211-a939-e4115bead28a'
        )
      })

      it('should call parent saveValues method', () => {
        expect(FormController.prototype.saveValues).to.have.been.calledOnce
      })
    })
  })
})
