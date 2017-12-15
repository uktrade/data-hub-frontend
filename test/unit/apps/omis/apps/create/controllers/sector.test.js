const FormController = require('~/src/apps/omis/controllers/form')

const sectorOptionsMock = [{
  id: '1',
  name: 'Sector one',
}, {
  id: '2',
  name: 'Sector two',
}, {
  id: '3',
  name: 'Sector three',
}]

const Controller = proxyquire('~/src/apps/omis/apps/create/controllers/sector', {
  '../../../../../lib/metadata': {
    sectorOptions: sectorOptionsMock,
  },
})

describe('OMIS create sector controller', () => {
  beforeEach(() => {
    this.nextSpy = sandbox.spy()
    this.controller = new Controller({ route: '/' })
  })

  describe('configure()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        form: {
          options: {
            fields: {
              sector: {},
            },
          },
        },
      })

      sandbox.spy(FormController.prototype, 'configure')
    })

    it('should set the list of markets', () => {
      this.controller.configure(this.reqMock, globalRes, this.nextSpy)

      expect(this.reqMock.form.options.fields.sector.options).to.deep.equal([
        {
          value: '1',
          label: 'Sector one',
        },
        {
          value: '2',
          label: 'Sector two',
        },
        {
          value: '3',
          label: 'Sector three',
        },
      ])
      expect(FormController.prototype.configure).to.be.calledWith(this.reqMock, globalRes, this.nextSpy)
    })
  })

  describe('saveValues()', () => {
    beforeEach(() => {
      this.reqMock = Object.assign({}, globalReq, {
        form: {
          values: {},
        },
      })
      this.resMock = Object.assign({}, globalRes, {
        locals: {
          company: {
            sector: {
              id: 'b3959812-6095-e211-a939-e4115bead28a',
              name: 'ICT',
            },
          },
        },
      })

      sandbox.stub(FormController.prototype, 'saveValues')
    })

    context('when using company\'s sector', () => {
      beforeEach(() => {
        this.reqMock.form.values.use_sector_from_company = 'true'

        this.controller.saveValues(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set sector to company\'s sector value', () => {
        expect(this.reqMock.form.values.sector).to.equal('b3959812-6095-e211-a939-e4115bead28a')
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
        expect(this.reqMock.form.values.sector).to.equal('98d14e94-5d95-e211-a939-e4115bead28a')
      })

      it('should call parent saveValues method', () => {
        expect(FormController.prototype.saveValues).to.have.been.calledOnce
      })
    })
  })
})
