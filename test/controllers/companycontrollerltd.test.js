/* globals expect: true, describe: true, it: true, beforeEach: true, sinon: true */
const proxyquire = require('proxyquire')
const { render } = require('../nunjucks')
const { hqLabels } = require('../../src/labels/companylabels')
const { expectTextFieldWithLabel, expectDropdownWithLabel, expectHiddenField, expectRadioWithLabel, expectTextAreaWithLabel } = require('../formhelpers')

const next = function (error) {
  throw Error(error)
}

describe('Company controller, ltd', function () {
  let getInflatedDitCompanyStub
  let getCHCompanyStub
  let getDitCompanyStub
  let getDisplayCHStub
  let getDisplayCompanyStub
  let companyControllerLtd
  let getLtdCompanyAsFormDataStub
  let getDefaultLtdFormForCHStub
  let fakeCompanyForm
  let saveCompanyFormStub
  let flashStub
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
      selectable: true
    }
  }
  const company = {
    id: '9999',
    company_number: '10620176',
    companies_house_data: chCompany,
    name: 'ADALEOP LTD',
    registered_address_1: '13 HOWICK PARK AVENUE',
    registered_address_2: 'PENWORTHAM',
    registered_address_3: null,
    registered_address_4: null,
    registered_address_town: 'PRESTON',
    registered_address_county: '',
    registered_address_postcode: 'PR1 0LS'
  }
  const metadataRepositoryStub = {
    regionOptions: [{id: '1', name: 'option 1'}],
    sectorOptions: [{id: '1', name: 'option 1'}],
    employeeOptions: [{id: '1', name: 'option 1'}],
    turnoverOptions: [{id: '1', name: 'option 1'}],
    countryOptions: [{ id: '80756b9a-5d95-e211-a939-e4115bead28a', name: 'United Kingdom' }],
    headquarterOptions: [
      { id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b', name: 'ehq', selectable: true },
      { id: '43281c5e-92a4-4794-867b-b4d5f801e6f3', name: 'ghq', selectable: true },
      { id: '3e6debb4-1596-40c5-aa25-f00da0e05af9', name: 'ukhq', selectable: true }
    ]
  }

  beforeEach(function () {
    fakeCompanyForm = { id: '999', sector: 10 }
    getInflatedDitCompanyStub = sinon.stub().resolves(company)
    getDisplayCHStub = sinon.stub().returns({ company_number: '1234' })
    getDisplayCompanyStub = sinon.stub().returns({ company_number: '1234' })
    getCHCompanyStub = sinon.stub().resolves(chCompany)
    getDitCompanyStub = sinon.stub().resolves(company)
    getLtdCompanyAsFormDataStub = sinon.stub().returns(fakeCompanyForm)
    getDefaultLtdFormForCHStub = sinon.stub().returns(fakeCompanyForm)
    saveCompanyFormStub = sinon.stub().returns(fakeCompanyForm)
    flashStub = sinon.stub()

    companyControllerLtd = proxyquire('../../src/controllers/companycontrollerltd', {
      '../services/companyservice': {
        getInflatedDitCompany: getInflatedDitCompanyStub
      },
      '../services/companyformattingservice': {
        getDisplayCompany: getDisplayCompanyStub,
        getDisplayCH: getDisplayCHStub
      },
      '../repositorys/companyrepository': {
        getCHCompany: getCHCompanyStub,
        getDitCompany: getDitCompanyStub
      },
      '../services/companyformservice': {
        getLtdCompanyAsFormData: getLtdCompanyAsFormDataStub,
        getDefaultLtdFormForCH: getDefaultLtdFormForCHStub,
        saveCompanyForm: saveCompanyFormStub
      },
      '../repositorys/metadatarepository': metadataRepositoryStub
    })
  })

  describe('get details', function () {
    it('should get the company details', function (done) {
      companyControllerLtd.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
      }, {
        locals: {},
        render: function () {
          expect(getInflatedDitCompanyStub).to.be.calledWith('1234', '9999')
          done()
        }
      }, next)
    })
    it('should return the company heading name and address', function (done) {
      const res = {
        locals: {},
        render: function () {
          expect(res.locals.headingName).to.equal('ADALEOP LTD')
          expect(res.locals.headingAddress).to.equal('13 Howick Park Avenue, Penwortham, Preston, PR1 0LS, United Kingdom')
          done()
        }
      }

      companyControllerLtd.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
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
        }
      }

      companyControllerLtd.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
      }, res, next)
    })
    it('should get formatted data for CDMS company details', function (done) {
      const res = {
        locals: {},
        render: function () {
          expect(getDisplayCompanyStub).to.be.calledWith(company)
          expect(res.locals).to.have.property('companyDetails')
          expect(res.locals).to.have.property('companyDetailsLabels')
          expect(res.locals.companyDetailsDisplayOrder).to.deep.equal(['alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range'])
          done()
        }
      }

      companyControllerLtd.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
      }, res, next)
    })
    it('should provide account management information', function (done) {
      const res = {
        locals: {},
        render: function () {
          expect(res.locals).to.have.property('accountManagementDisplay')
          expect(res.locals).to.have.property('accountManagementDisplayLabels')
          done()
        }
      }

      companyControllerLtd.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
      }, res, next)
    })
    it('should use a template for ltd data', function (done) {
      const res = {
        locals: {},
        render: function (template) {
          expect(template).to.equal('company/details-ltd')
          done()
        }
      }

      companyControllerLtd.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
      }, res, next)
    })
  })
  describe('add details', function () {
    it('should create form defaults for an empty company', function (done) {
      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' }
      }
      const res = {
        locals: {},
        render: function () {
          expect(getDefaultLtdFormForCHStub).to.be.calledWith(chCompany)
          expect(res.locals.formData).to.deep.equal(fakeCompanyForm)
          done()
        }
      }

      companyControllerLtd.addDetails(req, res, next)
    })
    it('should pass an populated form if called with errors', function (done) {
      const body = {
        sector: '1234'
      }

      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' },
        body
      }
      const res = {
        locals: {},
        render: function () {
          expect(res.locals.formData).to.deep.equal(body)
          done()
        }
      }

      companyControllerLtd.addDetails(req, res, next)
    })
    it('should load CH details to populate defaults', function (done) {
      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' }
      }
      const res = {
        locals: {},
        render: function () {
          expect(getCHCompanyStub).to.be.calledWith('1234', '00112233')
          expect(getDisplayCHStub).to.be.calledWith(chCompany)
          expect(res.locals).to.have.property('chCompany')
          expect(res.locals).to.have.property('chDetails')
          done()
        }
      }

      companyControllerLtd.addDetails(req, res, next)
    })
    it('should render with the correct template', function (done) {
      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' }
      }
      const res = {
        locals: {},
        render: function (template) {
          expect(template).to.equal('company/edit-ltd')
          done()
        }
      }

      companyControllerLtd.addDetails(req, res, next)
    })
  })
  describe('render add/edit', function () {
    let document
    let formData

    beforeEach(function () {
      const chDetails = {
        company_number: '02658484',
        registered_address: '52a High Street, Sheffield, S20 1ED, United Kingdom',
        business_type: 'Private Limited Company',
        name: 'Amazon Savers',
        company_status: 'Active',
        sic_code: ['82990 - Other business support service activities n.e.c.', '82991 - Other business support service activities n.e.c.'],
        incorporation_date: '6 February 2012'
      }

      formData = {
        company_number: '001122',
        business_type: '111',
        uk_based: 'yes',
        name: 'Fred ltd',
        registered_address_1: 'add1',
        registered_address_2: 'add2',
        registered_address_3: 'add3',
        registered_address_4: 'add4',
        registered_address_town: 'town',
        registered_address_county: 'county',
        registered_address_postcode: 'postcode',
        registered_address_country: '222',
        alias: 'trading_name',
        trading_address_1: 'trading address 1',
        trading_address_2: 'trading address 2',
        trading_address_town: 'trading town',
        trading_address_county: 'trading county',
        trading_address_postcode: 'trading postcode',
        trading_address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        uk_region: '5555',
        headquarter_type: metadataRepositoryStub.headquarterOptions[0].id,
        sector: '1',
        website: 'https://www.test.com',
        description: 'This is a test',
        employee_range: '1',
        turnover_range: '1'
      }

      return render('../../src/views/company/edit-ltd.html', {
        regionOptions: metadataRepositoryStub.regionOptions,
        sectorOptions: metadataRepositoryStub.sectorOptions,
        employeeOptions: metadataRepositoryStub.employeeOptions,
        turnoverOptions: metadataRepositoryStub.turnoverOptions,
        headquarterOptions: metadataRepositoryStub.headquarterOptions,
        countryOptions: metadataRepositoryStub.countryOptions,
        hqLabels,
        formData,
        chCompany,
        chDetails
      })
      .then((_document) => {
        document = _document
      })
      .catch((error) => {
        console.log(error)
        throw Error(error)
      })
    })
    it('should store the default CH data in hidden fields', function () {
      expectHiddenField(document, 'company_number', formData.company_number)
      expectHiddenField(document, 'business_type', formData.business_type)
      expectHiddenField(document, 'uk_based', 'yes')
      expectHiddenField(document, 'name', formData.name)
      expectHiddenField(document, 'registered_address_1', formData.registered_address_1)
      expectHiddenField(document, 'registered_address_2', formData.registered_address_2)
      expectHiddenField(document, 'registered_address_3', formData.registered_address_3)
      expectHiddenField(document, 'registered_address_4', formData.registered_address_4)
      expectHiddenField(document, 'registered_address_town', formData.registered_address_town)
      expectHiddenField(document, 'registered_address_county', formData.registered_address_county)
      expectHiddenField(document, 'registered_address_postcode', formData.registered_address_postcode)
      expectHiddenField(document, 'registered_address_country', formData.registered_address_country)
    })
    it('should include all the company fields that can be edited', function () {
      expectTextFieldWithLabel(document, 'alias', 'Trading name', formData.trading_name)
      expectTextFieldWithLabel(document, 'trading_address_1', 'Business and street (optional)', formData.trading_address_1)
      expectTextFieldWithLabel(document, 'trading_address_2', '', formData.trading_address_2)
      expectTextFieldWithLabel(document, 'trading_address_town', 'Town or city (optional)', formData.trading_address_town)
      expectTextFieldWithLabel(document, 'trading_address_county', 'County (optional)', formData.trading_address_county)
      expectTextFieldWithLabel(document, 'trading_address_postcode', 'Postcode (optional)', formData.trading_address_postcode)
      expectDropdownWithLabel(document, 'trading_address_country', '', formData.trading_address_country)
      expectDropdownWithLabel(document, 'uk_region', 'UK region', formData.ukregion)
      expectRadioWithLabel(document, 'headquarters', 'Is this a headquarters?', formData.headquarter_type)
      expectDropdownWithLabel(document, 'sector', 'Sector', formData.sector)
      expectTextFieldWithLabel(document, 'website', 'Website', formData.website)
      expectTextAreaWithLabel(document, 'description', 'Business description (optional)', formData.description)
      expectDropdownWithLabel(document, 'employee_range', 'Number of employees (optional)', formData.employee_range)
      expectDropdownWithLabel(document, 'turnover_range', 'Annual turnover (optional)', formData.turnover_range)
    })
  })
  describe('edit details', function () {
    it('should translate a company record into form data if no body posted', function (done) {
      const req = {
        session: { token: '1234' },
        params: { id: '9999' }
      }
      const res = {
        locals: {},
        render: function () {
          expect(getDitCompanyStub).to.be.calledWith('1234', '9999')
          expect(getLtdCompanyAsFormDataStub).to.be.calledWith(company)
          expect(res.locals.formData).to.deep.equal(fakeCompanyForm)
          done()
        }
      }

      companyControllerLtd.editDetails(req, res, next)
    })
    it('should pass through form data if called with errors', function (done) {
      const body = {
        sector: '1234'
      }

      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' },
        body
      }
      const res = {
        locals: {},
        render: function () {
          expect(getDitCompanyStub).to.not.be.called
          expect(getLtdCompanyAsFormDataStub).to.not.be.called
          expect(res.locals.formData).to.deep.equal(body)
          done()
        }
      }

      companyControllerLtd.editDetails(req, res, next)
    })
    it('should render with the correct template', function (done) {
      const body = {
        sector: '1234'
      }

      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' },
        body
      }
      const res = {
        locals: {},
        render: function (template) {
          expect(template).to.equal('company/edit-ltd')
          done()
        }
      }

      companyControllerLtd.editDetails(req, res, next)
    })
    it('should indicate if the view should show the trading address section', function (done) {
      const body = { id: '1234', trading_address_country: '80756b9a-5d95-e211-a939-e4115bead28a' }

      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' },
        body
      }
      const res = {
        locals: {},
        render: function (template) {
          expect(res.locals.showTradingAddress).to.equal(true)
          done()
        }
      }

      companyControllerLtd.editDetails(req, res, next)
    })
    it('should indicate if the view should hide the trading address section', function (done) {
      const body = { id: '1234', trading_address_country: '' }

      const req = {
        session: { token: '1234' },
        params: { company_number: '00112233' },
        body
      }
      const res = {
        locals: {},
        render: function (template) {
          expect(res.locals.showTradingAddress).to.equal(false)
          done()
        }
      }

      companyControllerLtd.editDetails(req, res, next)
    })
  })
  describe('post details', function () {
    it('call the company repository to save the company', function (done) {
      const body = {
        id: '1234',
        name: 'freds'
      }
      const req = {
        session: {
          token: '1234'
        },
        flash: flashStub,
        body
      }
      const res = {
        locals: {},
        redirect: function () {
          expect(saveCompanyFormStub).to.be.calledWith('1234', body)
          done()
        },
        render: function () {
          throw Error('error')
        }
      }
      companyControllerLtd.postDetails(req, res, next)
    })
    it('should forward to the detail screen if save is good', function (done) {
      const body = {
        id: '999',
        name: 'freds'
      }
      const req = {
        session: {
          token: '1234'
        },
        flash: flashStub,
        body
      }
      const res = {
        locals: {},
        redirect: function (url) {
          expect(url).to.equal('/company/view/ltd/999')
          done()
        },
        render: function () {
          throw Error('error')
        }
      }
      companyControllerLtd.postDetails(req, res, next)
    })
    it('should re-render the edit form with form data on error', function (done) {
      saveCompanyFormStub = sinon.stub().rejects({
        error: { name: ['test'] }
      })

      companyControllerLtd = proxyquire('../../src/controllers/companycontrollerltd', {
        '../services/companyservice': {
          getInflatedDitCompany: getInflatedDitCompanyStub
        },
        '../services/companyformattingservice': {
          getDisplayCompany: getDisplayCompanyStub,
          getDisplayCH: getDisplayCHStub
        },
        '../repositorys/companyrepository': {
          getCHCompany: getCHCompanyStub,
          getDitCompany: getDitCompanyStub
        },
        '../services/companyformservice': {
          getLtdCompanyAsFormData: getLtdCompanyAsFormDataStub,
          getDefaultLtdFormForCH: getDefaultLtdFormForCHStub,
          saveCompanyForm: saveCompanyFormStub
        },
        '../repositorys/metadatarepository': metadataRepositoryStub
      })

      const body = {
        id: '999',
        name: 'freds'
      }
      const req = {
        session: {
          token: '1234'
        },
        params: {},
        flash: flashStub,
        body
      }
      const res = {
        locals: {},
        redirect: function () {
          throw Error('error')
        },
        render: function (template) {
          expect(template).to.equal('company/edit-ltd')
          expect(res.locals).to.have.property('errors')
          done()
        }
      }
      companyControllerLtd.postDetails(req, res, next)
    })
    it('should flash a message to let people know they did something', function (done) {
      const body = {
        id: '1234',
        name: 'freds'
      }
      const req = {
        session: {
          token: '1234'
        },
        flash: flashStub,
        body
      }
      const res = {
        locals: {},
        redirect: function () {
          expect(flashStub).to.be.calledWith('success-message', 'Updated company record')
          done()
        },
        render: function () {
          throw Error('error')
        }
      }
      companyControllerLtd.postDetails(req, res, next)
    })
  })
  describe('edit common', function () {
    let req
    let res

    beforeEach(function () {
      req = {
        session: {
          token: '1234'
        }
      }
      res = {
        locals: {}
      }
    })
    it('should include the require properties in the response', function () {
      companyControllerLtd.editCommon(req, res)
      expect(res.locals).to.have.property('chDetailsLabels')
      expect(res.locals).to.have.property('chDetailsDisplayOrder')
      expect(res.locals).to.have.property('regionOptions')
      expect(res.locals).to.have.property('sectorOptions')
      expect(res.locals).to.have.property('employeeOptions')
      expect(res.locals).to.have.property('turnoverOptions')
      expect(res.locals).to.have.property('headquarterOptions')
      expect(res.locals).to.have.property('hqLabels')
      expect(res.locals).to.have.property('csrfToken')
    })

    it('should goto the next function if there is one', function () {
      const next = sinon.stub()
      companyControllerLtd.editCommon(req, res, next)
      expect(next).to.be.called
    })
  })
})
