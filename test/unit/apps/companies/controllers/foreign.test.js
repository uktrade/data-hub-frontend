const next = function (error) {
  throw Error(error)
}

describe('Company controller, foreign', function () {
  let getCHCompanyStub
  let getDitCompanyStub
  let getDisplayCHStub
  let getDisplayCompanyStub
  let companyControllerForeign
  let breadcrumbStub
  let company

  beforeEach(function () {
    company = {
      id: '9999',
      company_number: '10620176',
      companies_house_data: null,
      name: 'Freds ltd',
      business_type: {
        id: '43134234',
        name: 'Charity',
      },
      registered_address_1: '13 HOWICK PARK AVENUE',
      registered_address_2: 'PENWORTHAM',
      registered_address_town: 'PRESTON',
      registered_address_county: '',
      registered_address_postcode: 'PR1 0LS',
    }
    getDisplayCHStub = sinon.stub().returns({ company_number: '1234' })
    getDisplayCompanyStub = sinon.stub().returns({ company_number: '1234' })
    getCHCompanyStub = sinon.stub().resolves(null)
    getDitCompanyStub = sinon.stub().resolves(company)
    breadcrumbStub = function () {
      return this
    }

    companyControllerForeign = proxyquire('~/src/apps/companies/controllers/foreign', {
      '../services/formatting': {
        getDisplayCompany: getDisplayCompanyStub,
        getDisplayCH: getDisplayCHStub,
      },
      '../repos': {
        getCHCompany: getCHCompanyStub,
        getDitCompany: getDitCompanyStub,
      },
    })
  })

  describe('get details', function () {
    it('should get the company details', function (done) {
      companyControllerForeign.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, {
        locals: {},
        breadcrumb: breadcrumbStub,
        render: function () {
          expect(getDitCompanyStub).to.be.calledWith('1234', '9999')
          done()
        },
      }, next)
    })
    it('should return the company heading name and address', function (done) {
      const res = {
        locals: {},
        breadcrumb: breadcrumbStub,
        render: function () {
          expect(res.locals.headingName).to.equal('Freds ltd')
          expect(res.locals.headingAddress).to.equal('13 Howick Park Avenue, Penwortham, Preston, PR1 0LS, United Kingdom')
          done()
        },
      }

      companyControllerForeign.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should get not get a formatted copy of the company house data to display', function (done) {
      const res = {
        locals: {},
        breadcrumb: breadcrumbStub,
        render: function () {
          expect(getDisplayCHStub).to.not.be.called
          expect(res.locals).to.not.have.property('chDetails')
          expect(res.locals).to.not.have.property('chDetailsLabels')
          expect(res.locals).to.not.have.property('chDetailsDisplayOrder')
          done()
        },
      }

      companyControllerForeign.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should get formatted data for CDMS company details', function (done) {
      const res = {
        locals: {},
        breadcrumb: breadcrumbStub,
        render: function () {
          expect(getDisplayCompanyStub).to.be.calledWith(company)
          expect(res.locals).to.have.property('companyDetails')
          expect(res.locals).to.have.property('companyDetailsLabels')
          expect(res.locals.companyDetailsDisplayOrder).to.deep.equal([
            'business_type',
            'registered_address',
            'trading_name',
            'trading_address',
            'headquarter_type',
            'sector',
            'website',
            'description',
            'employee_range',
            'turnover_range',
          ])
          done()
        },
      }

      companyControllerForeign.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should provide account management information', function (done) {
      const res = {
        locals: {},
        breadcrumb: breadcrumbStub,
        render: function () {
          expect(res.locals).to.have.property('accountManagementDisplay')
          expect(res.locals).to.have.property('accountManagementDisplayLabels')
          done()
        },
      }

      companyControllerForeign.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should use a template for ch data', function (done) {
      const res = {
        locals: {},
        breadcrumb: breadcrumbStub,
        render: function (template) {
          try {
            expect(template).to.equal('companies/views/details')
            done()
          } catch (e) {
            done(e)
          }
        },
      }

      companyControllerForeign.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
  })
})
