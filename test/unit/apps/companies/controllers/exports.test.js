const companyMock = require('~/test/unit/data/api-response-intermediary-company.json')
const tokenMock = '12345abcde'

describe('Company export controller', () => {
  beforeEach(() => {
    this.saveCompany = sandbox.stub()
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.renderSpy = sandbox.spy()
    this.nextSpy = sandbox.spy()
    this.redirectSpy = sandbox.spy()
    this.transformerSpy = sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/exports', {
      '../repos': {
        saveCompany: this.saveCompany,
      },
      '../../../lib/metadata': {
        countryOptions: [{
          id: '1234',
          name: 'France',
        }],
        exportExperienceCategory: [{
          id: '73023b55-9568-4e3f-a134-53ec58451d3f',
          name: 'Export growth',
        }],
      },
      '../transformers': {
        transformCompanyToExportDetailsView: this.transformerSpy,
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

  describe('renderExports()', () => {
    beforeEach(() => {
      this.controller.renderExports(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should set correct breadcrumbs', () => {
      expect(this.breadcrumbStub).to.be.calledWith('Exports')
    })

    it('should call the transformer to get the deails', () => {
      expect(this.transformerSpy).to.be.calledWith(companyMock)
    })

    it('should render the correct view', () => {
      expect(this.renderSpy.args[0][0]).to.equal('companies/views/exports-view')
      expect(this.renderSpy).to.have.been.calledOnce
    })

    it('should exports to view', () => {
      expect(this.renderSpy.args[0][1]).to.have.property('exportDetails')
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
          export_experience_category: {
            id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
            name: 'Increasing export markets',
          },
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
          export_experience_category: {
            id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
            name: 'Increasing export markets',
          },
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

    it('send export experience categories options to view', () => {
      expect(this.renderSpy.args[0][1]).to.have.property('exportExperienceCategories')
      expect(this.renderSpy.args[0][1].exportExperienceCategories).to.deep.equal([{
        value: '73023b55-9568-4e3f-a134-53ec58451d3f',
        label: 'Export growth',
      }])
    })

    it('send country options to view', () => {
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
        export_experience_category: '111',
        export_to_countries: '222',
        future_interest_countries: ['333', '444'],
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
        const actualData = this.saveCompany.args[0][1]
        expect(actualData.export_experience_category).to.equal('111')
        expect(actualData.export_to_countries).to.deep.equal(['222'])
        expect(actualData.future_interest_countries).to.deep.equal(['333', '444'])
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
