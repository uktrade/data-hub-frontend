const next = function (error) {
  throw Error(error)
}

describe('Company controller, ltd', function () {
  let getDitCompanyStub
  let getDisplayCHStub
  let getDisplayCompanyStub
  let companyControllerLtd

  const chCompany = {
    id: '972173',
    created_on: '2017-04-11T10:28:30.639369',
    modified_on: '2017-04-11T10:28:30.639369',
    name: 'ADALEOP LTD',
    registered_address_1: '13 HOWICK PARK AVENUE',
    registered_address_2: 'PENWORTHAM',
    registered_address_town: 'PRESTON',
    registered_address_county: '',
    registered_address_postcode: 'PR1 0LS',
    company_number: '10620176',
    company_category: 'Private Limited Company',
    company_status: 'Active',
    sic_code_1: '82110 - Combined office administrative service activities',
    sic_code_2: '',
    sic_code_3: '',
    sic_code_4: '',
    uri: 'http://business.data.gov.uk/id/companies/10620176',
    incorporation_date: '2017-02-15',
    registered_address_country: {
      id: '80756b9a-5d95-e211-a939-e4115bead28a',
      name: 'United Kingdom',
    },
  }
  const company = {
    id: '9999',
    company_number: '10620176',
    companies_house_data: chCompany,
    name: 'ADALEOP LTD',
    registered_address_1: '13 HOWICK PARK AVENUE',
    registered_address_2: 'PENWORTHAM',
    registered_address_town: 'PRESTON',
    registered_address_county: '',
    registered_address_postcode: 'PR1 0LS',
  }
  const metadataRepositoryStub = {
    regionOptions: [{ id: '1', name: 'option 1' }],
    sectorOptions: [{ id: '1', name: 'option 1' }],
    employeeOptions: [{ id: '1', name: 'option 1' }],
    turnoverOptions: [{ id: '1', name: 'option 1' }],
    countryOptions: [{ id: '80756b9a-5d95-e211-a939-e4115bead28a', name: 'United Kingdom' }],
    headquarterOptions: [
      { id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b', name: 'ehq' },
      { id: '43281c5e-92a4-4794-867b-b4d5f801e6f3', name: 'ghq' },
      { id: '3e6debb4-1596-40c5-aa25-f00da0e05af9', name: 'ukhq' },
    ],
  }

  beforeEach(function () {
    getDisplayCHStub = sinon.stub().returns({ company_number: '1234' })
    getDisplayCompanyStub = sinon.stub().returns({ company_number: '1234' })
    getDitCompanyStub = sinon.stub().resolves(company)

    this.breadcrumbStub = function () {
      return this
    }

    companyControllerLtd = proxyquire('~/src/apps/companies/controllers/ltd', {
      '../services/formatting': {
        getDisplayCompany: getDisplayCompanyStub,
        getDisplayCH: getDisplayCHStub,
      },
      '../repos': {
        getDitCompany: getDitCompanyStub,
      },
      '../../../lib/metadata': metadataRepositoryStub,
    })
  })

  describe('get details', function () {
    it('should get the company details', function (done) {
      companyControllerLtd.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        render: function () {
          expect(getDitCompanyStub).to.be.calledWith('1234', '9999')
          done()
        },
      }, next)
    })
    it('should return the company heading name and address', function (done) {
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        render: function () {
          expect(res.locals.headingName).to.equal('ADALEOP LTD')
          expect(res.locals.headingAddress).to.equal('13 Howick Park Avenue, Penwortham, Preston, PR1 0LS, United Kingdom')
          done()
        },
      }

      companyControllerLtd.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should get a formatted copy of the company house data to display', function (done) {
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        render: function () {
          expect(getDisplayCHStub).to.be.calledWith(chCompany)
          expect(res.locals).to.have.property('chDetails')
          expect(res.locals).to.have.property('chDetailsLabels')
          expect(res.locals.chDetailsDisplayOrder).to.deep.equal([
            'name',
            'company_number',
            'registered_address',
            'business_type',
            'company_status',
            'incorporation_date',
            'sic_code',
          ])
          done()
        },
      }

      companyControllerLtd.getDetails({
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
        breadcrumb: this.breadcrumbStub,
        render: function () {
          expect(getDisplayCompanyStub).to.be.calledWith(company)
          expect(res.locals).to.have.property('companyDetails')
          expect(res.locals).to.have.property('companyDetailsLabels')
          expect(res.locals.companyDetailsDisplayOrder).to.deep.equal([
            'trading_name',
            'trading_address',
            'uk_region',
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

      companyControllerLtd.getDetails({
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
        breadcrumb: this.breadcrumbStub,
        render: function () {
          expect(res.locals).to.have.property('accountManagementDisplay')
          expect(res.locals).to.have.property('accountManagementDisplayLabels')
          done()
        },
      }

      companyControllerLtd.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should use a template for ltd data', function (done) {
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        render: function (template) {
          try {
            expect(template).to.equal('companies/views/details')
            done()
          } catch (e) {
            done(e)
          }
        },
      }

      companyControllerLtd.getDetails({
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
