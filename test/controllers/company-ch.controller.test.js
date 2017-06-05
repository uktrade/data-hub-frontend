const next = function (error) {
  throw Error(error)
}

describe('Company controller, Companies Houe', function () {
  let getInflatedDitCompanyStub
  let getCHCompanyStub
  let getDisplayCHStub
  let getDisplayCompanyStub
  let getHeadingNameStub
  let getHeadingAddressStub
  let companyControllerCh
  const chCompany = {
    id: '972173',
    created_on: '2017-04-11T10:28:30.639369',
    modified_on: '2017-04-11T10:28:30.639369',
    name: 'ADALEOP LTD',
    registered_address_1: '13 HOWICK PARK AVENUE',
    registered_address_2: 'PENWORTHAM',
    registered_address_3: null,
    registered_address_4: null,
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
    uri: 'http://business.data.gov.uk/id/company/10620176',
    incorporation_date: '2017-02-15',
    registered_address_country: {
      id: '80756b9a-5d95-e211-a939-e4115bead28a',
      name: 'United Kingdom',
    },
  }

  beforeEach(function () {
    getInflatedDitCompanyStub = sinon.stub().resolves({ company_number: '1234' })
    getDisplayCHStub = sinon.stub().returns({ company_number: '1234' })
    getDisplayCompanyStub = sinon.stub().returns({ company_number: '1234' })
    getCHCompanyStub = sinon.stub().resolves(chCompany)

    companyControllerCh = proxyquire('~/src/controllers/company-ch.controller', {
      '../services/company.service': {
        getInflatedDitCompany: getInflatedDitCompanyStub,
      },
      '../services/company-formatting.service': {
        getDisplayCompany: getDisplayCompanyStub,
        getDisplayCH: getDisplayCHStub,
        getHeadingName: getHeadingNameStub,
        getHeadingAddress: getHeadingAddressStub,
      },
      '../repos/company.repo': {
        getCHCompany: getCHCompanyStub,
      },
    })
  })

  describe('get details', function () {
    it('should get the ch company details', function (done) {
      companyControllerCh.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, {
        locals: {},
        render: function () {
          expect(getCHCompanyStub).to.be.calledWith('1234', '9999')
          done()
        },
      }, next)
    })
    it('should return the company heading name and address', function (done) {
      const res = {
        locals: {},
        render: function () {
          expect(res.locals.headingName).to.equal('ADALEOP LTD')
          expect(res.locals.headingAddress).to.equal('13 Howick Park Avenue, Penwortham, Preston, PR1 0LS, United Kingdom')
          done()
        },
      }

      companyControllerCh.getDetails({
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
        render: function () {
          expect(getDisplayCHStub).to.be.calledWith(chCompany)
          expect(res.locals).to.have.property('chDetails')
          expect(res.locals).to.have.property('chDetailsLabels')
          expect(res.locals.chDetailsDisplayOrder).to.deep.equal(['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code'])
          done()
        },
      }

      companyControllerCh.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should not try and get formatted data for CDMS company details', function (done) {
      const res = {
        locals: {},
        render: function () {
          expect(getDisplayCompanyStub).to.not.be.called
          expect(res.locals).to.not.have.property('companyDetails')
          done()
        },
      }

      companyControllerCh.getDetails({
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }, res, next)
    })
    it('should not provide account management information', function (done) {
      const res = {
        locals: {},
        render: function () {
          expect(res.locals).to.not.have.property('accountManagementDisplay')
          expect(res.locals).to.not.have.property('accountManagementDisplayLabels')
          done()
        },
      }

      companyControllerCh.getDetails({
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
        render: function (template) {
          expect(template).to.equal('company/details-ch')
          done()
        },
      }

      companyControllerCh.getDetails({
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
