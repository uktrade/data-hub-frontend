const companyMock = require('~/test/unit/data/api-response-intermediary-company.json')
const tokenMock = '12345abcde'

describe('Company export controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.saveCompany = this.sandbox.stub()
    this.breadcrumbStub = this.sandbox.stub().returnsThis()
    this.renderSpy = this.sandbox.spy()
    this.nextSpy = this.sandbox.spy()
    this.redirectSpy = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/exports', {
      '../repos': {
        saveCompany: this.saveCompany,
      },
      '../../../lib/metadata': {
        countryOptions: [{
          id: '1234',
          name: 'France',
        }],
      },
    })

    this.reqMock = {
      session: {
        token: tokenMock,
      },
    }
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      redirect: this.redirectSpy,
      locals: {
        company: companyMock,
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('renderExports()', () => {
    beforeEach(() => {
      this.controller.renderExports(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should set correct breadcrumbs', () => {
      expect(this.breadcrumbStub).to.have.been.calledTwice
    })

    it('should render the correct view', () => {
      expect(this.renderSpy.args[0][0]).to.equal('companies/views/exports-view')
      expect(this.renderSpy).to.have.been.calledOnce
    })

    it('send labels to view', () => {
      expect(this.renderSpy.args[0][1]).to.have.property('exportDetailsLabels')
    })

    it('send display order to view', () => {
      expect(this.renderSpy.args[0][1]).to.have.property('exportDetailsDisplayOrder')
    })

    it('should exports to view', () => {
      expect(this.renderSpy.args[0][1]).to.have.property('exportDetails')
      expect(this.renderSpy.args[0][1].exportDetails).to.deep.equal({
        exportToCountries: 'France<br>Italy',
        futureInterestCountries: 'Germany<br>Argentina',
      })
    })
  })

  describe('populateExportForm()', () => {
    context('when no request body exists', () => {
      beforeEach(() => {
        this.controller.populateExportForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should populate formData on locals', () => {
        expect(this.resMock.locals).to.have.property('formData')
        expect(this.resMock.locals.formData).to.deep.equal({
          export_to_countries: ['1234', '2234'],
          future_interest_countries: ['4321', '5678'],
        })
      })

      it('should call next with no arguments', () => {
        expect(this.nextSpy).to.have.been.calledWith()
        expect(this.nextSpy).to.have.been.calledOnce
      })
    })

    context('when request body exists', () => {
      beforeEach(() => {
        this.reqMock.body = {
          export_to_countries: ['09876'],
          future_interest_countries: ['67890'],
        }
        this.controller.populateExportForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should populate formData on locals', () => {
        expect(this.resMock.locals).to.have.property('formData')
        expect(this.resMock.locals.formData).to.deep.equal({
          export_to_countries: ['09876'],
          future_interest_countries: ['67890'],
        })
      })

      it('should call next with no arguments', () => {
        expect(this.nextSpy).to.have.been.calledWith()
        expect(this.nextSpy).to.have.been.calledOnce
      })
    })
  })

  describe('renderExportEdit()', () => {
    beforeEach(() => {
      this.controller.renderExportEdit(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should set correct breadcrumbs', () => {
      expect(this.breadcrumbStub).to.have.been.calledThrice
    })

    it('should render the correct view', () => {
      expect(this.renderSpy.args[0][0]).to.equal('companies/views/exports-edit')
      expect(this.renderSpy).to.have.been.calledOnce
    })

    it('send labels to view', () => {
      expect(this.renderSpy.args[0][1]).to.have.property('exportDetailsLabels')
    })

    it('should exports to view', () => {
      expect(this.renderSpy.args[0][1]).to.have.property('countryOptions')
      expect(this.renderSpy.args[0][1].countryOptions).to.deep.equal([{
        value: '1234',
        label: 'France',
      }])
    })
  })

  describe('handleEditFormPost()', () => {
    beforeEach(() => {
      this.reqMock.body = {
        export_to_countries: '123456',
        future_interest_countries: ['67890', 'abcde'],
      }
    })

    context('when save is successful', () => {
      beforeEach(async () => {
        this.saveCompany.resolves(companyMock)

        await this.controller.handleEditFormPost(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call save method with token', () => {
        expect(this.saveCompany.args[0][0]).to.equal(tokenMock)
      })

      it('should call save method with flattened body data', () => {
        expect(this.saveCompany.args[0][1]).to.have.property('export_to_countries')
        expect(this.saveCompany.args[0][1].export_to_countries).to.deep.equal(['123456'])
        expect(this.saveCompany.args[0][1]).to.have.property('future_interest_countries')
        expect(this.saveCompany.args[0][1].future_interest_countries).to.deep.equal(['67890', 'abcde'])
      })

      it('should redirect to exports routes', () => {
        expect(this.redirectSpy).to.have.been.calledWith(`/companies/${companyMock.id}/exports`)
        expect(this.redirectSpy).to.have.been.calledOnce
      })

      it('next should not have been called', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context('when save rejects with error', () => {
      beforeEach(async () => {
        this.errorMock = {
          statusCode: 500,
        }
        this.saveCompany.rejects(this.errorMock)

        await this.controller.handleEditFormPost(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next with error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
        expect(this.nextSpy).to.have.been.calledOnce
      })
    })
  })
})
