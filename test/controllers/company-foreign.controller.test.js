/* globals expect: true, describe: true, it: true, beforeEach: true, sinon: true */
/* eslint no-unused-expressions: 0 */

const proxyquire = require('proxyquire')
const { render } = require('../nunjucks')
const { hqLabels } = require('../../src/labels/company-labels')
const { expectTextFieldWithLabel, expectDropdownWithLabel, expectHiddenField, expectRadioWithLabel, expectTextAreaWithLabel } = require('../form-helpers')
const next = function (error) {
  throw Error(error)
}

describe('Company controller, foreign', function () {
  let getInflatedDitCompanyStub
  let getCHCompanyStub
  let getDitCompanyStub
  let getDisplayCHStub
  let getDisplayCompanyStub
  let getForeignCompanyAsFormDataStub
  let companyControllerForeign
  let fakeCompanyForm
  let saveCompanyFormStub
  let flashStub
  const company = {
    id: '9999',
    company_number: '10620176',
    copanies_house_data: null,
    name: 'Freds ltd',
    business_type: {
      id: '43134234',
      name: 'Charity'
    },
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
    businessTypeOptions: [{id: '1', name: 'Charity'}],
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
    getCHCompanyStub = sinon.stub().resolves(null)
    getDitCompanyStub = sinon.stub().resolves(company)
    getForeignCompanyAsFormDataStub = sinon.stub().returns(fakeCompanyForm)
    saveCompanyFormStub = sinon.stub().returns(fakeCompanyForm)
    flashStub = sinon.stub()

    companyControllerForeign = proxyquire('../../src/controllers/company-foreign.controller', {
      '../services/company.service': {
        getInflatedDitCompany: getInflatedDitCompanyStub
      },
      '../services/company-formatting.service': {
        getDisplayCompany: getDisplayCompanyStub,
        getDisplayCH: getDisplayCHStub
      },
      '../services/company-form.service': {
        getForeignCompanyAsFormData: getForeignCompanyAsFormDataStub,
        saveCompanyForm: saveCompanyFormStub
      },
      '../repos/company.repo': {
        getCHCompany: getCHCompanyStub,
        getDitCompany: getDitCompanyStub
      },
      '../repos/metadata.repo': metadataRepositoryStub
    })
  })

  describe('get details', function () {
    it('should get the company details', function (done) {
      companyControllerForeign.getDetails({
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
          expect(res.locals.headingName).to.equal('Freds ltd')
          expect(res.locals.headingAddress).to.equal('13 Howick Park Avenue, Penwortham, Preston, PR1 0LS, United Kingdom')
          done()
        }
      }

      companyControllerForeign.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
      }, res, next)
    })
    it('should get not get a formatted copy of the company house data to display', function (done) {
      const res = {
        locals: {},
        render: function () {
          expect(getDisplayCHStub).to.not.be.called
          expect(res.locals).to.not.have.property('chDetails')
          expect(res.locals).to.not.have.property('chDetailsLabels')
          expect(res.locals).to.not.have.property('chDetailsDisplayOrder')
          done()
        }
      }

      companyControllerForeign.getDetails({
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
          expect(res.locals.companyDetailsDisplayOrder).to.deep.equal(['business_type', 'registered_address', 'alias', 'trading_address', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range'])
          done()
        }
      }

      companyControllerForeign.getDetails({
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

      companyControllerForeign.getDetails({
        session: {
          token: '1234'
        },
        params: {
          id: '9999'
        }
      }, res, next)
    })
    it('should use a template for ch data', function (done) {
      const res = {
        locals: {},
        render: function (template) {
          expect(template).to.equal('company/details-foreign')
          done()
        }
      }

      companyControllerForeign.getDetails({
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
    it('should not create form defaults for an empty company', function (done) {
      const req = {
        session: { token: '1234' },
        query: { business_type: 'charity' },
        params: {}
      }
      const res = {
        locals: {},
        render: function () {
          expect(res.locals.formData).to.deep.equal({ business_type: '1' })
          done()
        }
      }

      companyControllerForeign.addDetails(req, res, next)
    })
    it('should pass an populated form if called with errors', function (done) {
      const body = {
        sector: '1234'
      }

      const req = {
        session: { token: '1234' },
        params: { id: '00112233' },
        query: { business_type: 'charity' },
        body
      }
      const res = {
        locals: {},
        render: function () {
          expect(res.locals.formData).to.deep.equal(body)
          done()
        }
      }

      companyControllerForeign.addDetails(req, res, next)
    })
    it('should render with the correct template', function (done) {
      const req = {
        session: { token: '1234' },
        query: { business_type: 'charity' },
        params: { id: '00112233' }
      }
      const res = {
        locals: {},
        render: function (template) {
          expect(template).to.equal('company/edit-foreign')
          done()
        }
      }

      companyControllerForeign.addDetails(req, res, next)
    })
  })
  describe('render add/edit', function () {
    let document
    let formData

    beforeEach(function () {
      formData = {
        id: '1234',
        company_number: null,
        business_type: '111',
        uk_based: 'no',
        name: 'Fred ltd',
        registered_address_1: 'add1',
        registered_address_2: 'add2',
        registered_address_3: 'add3',
        registered_address_4: 'add4',
        registered_address_town: 'town',
        registered_address_county: 'county',
        registered_address_postcode: 'postcode',
        registered_address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
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

      return render('../../src/views/company/edit-foreign.njk', {
        regionOptions: metadataRepositoryStub.regionOptions,
        sectorOptions: metadataRepositoryStub.sectorOptions,
        employeeOptions: metadataRepositoryStub.employeeOptions,
        turnoverOptions: metadataRepositoryStub.turnoverOptions,
        headquarterOptions: metadataRepositoryStub.headquarterOptions,
        countryOptions: metadataRepositoryStub.countryOptions,
        hqLabels,
        formData
      })
      .then((_document) => {
        document = _document
      })
      .catch((error) => {
        console.log(error)
        throw Error(error)
      })
    })
    it('should include all the company fields that can be edited', function () {
      expectHiddenField(document, 'id', formData.id)
      expectHiddenField(document, 'business_type', formData.business_type)
      expectHiddenField(document, 'uk_based', 'no')
      expectTextFieldWithLabel(document, 'name', 'Name', formData.name)
      expectTextFieldWithLabel(document, 'registered_address_1', 'Business and street (optional)', formData.registered_address_1)
      expectTextFieldWithLabel(document, 'registered_address_2', '', formData.registered_address_2)
      expectTextFieldWithLabel(document, 'registered_address_town', 'Town or city (optional)', formData.registered_address_town)
      expectTextFieldWithLabel(document, 'registered_address_county', 'County (optional)', formData.registered_address_county)
      expectTextFieldWithLabel(document, 'registered_address_postcode', 'Postcode (optional)', formData.registered_address_postcode)
      expectDropdownWithLabel(document, 'registered_address_country', 'Country', formData.registered_address_country)
      expectTextFieldWithLabel(document, 'alias', 'Trading name', formData.trading_name)
      expectTextFieldWithLabel(document, 'trading_address_1', 'Business and street (optional)', formData.trading_address_1)
      expectTextFieldWithLabel(document, 'trading_address_2', '', formData.trading_address_2)
      expectTextFieldWithLabel(document, 'trading_address_town', 'Town or city (optional)', formData.trading_address_town)
      expectTextFieldWithLabel(document, 'trading_address_county', 'County (optional)', formData.trading_address_county)
      expectTextFieldWithLabel(document, 'trading_address_postcode', 'Postcode (optional)', formData.trading_address_postcode)
      expectDropdownWithLabel(document, 'trading_address_country', 'Country', formData.trading_address_country)
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
          expect(getForeignCompanyAsFormDataStub).to.be.calledWith(company)
          expect(res.locals.formData).to.deep.equal(fakeCompanyForm)
          done()
        }
      }

      companyControllerForeign.editDetails(req, res, next)
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
          expect(getForeignCompanyAsFormDataStub).to.not.be.called
          expect(res.locals.formData).to.deep.equal(body)
          done()
        }
      }

      companyControllerForeign.editDetails(req, res, next)
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
          expect(template).to.equal('company/edit-foreign')
          done()
        }
      }

      companyControllerForeign.editDetails(req, res, next)
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

      companyControllerForeign.editDetails(req, res, next)
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

      companyControllerForeign.editDetails(req, res, next)
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
      companyControllerForeign.postDetails(req, res, next)
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
          expect(url).to.equal('/company/view/foreign/999')
          done()
        },
        render: function () {
          throw Error('error')
        }
      }
      companyControllerForeign.postDetails(req, res, next)
    })
    it('should re-render the edit form with form data on error', function (done) {
      saveCompanyFormStub = sinon.stub().rejects({
        errors: { name: ['test'] }
      })

      companyControllerForeign = proxyquire('../../src/controllers/company-foreign.controller', {
        '../services/company.service': {
          getInflatedDitCompany: getInflatedDitCompanyStub
        },
        '../services/company-formatting.service': {
          getDisplayCompany: getDisplayCompanyStub,
          getDisplayCH: getDisplayCHStub
        },
        '../services/company-form.service': {
          getForeignCompanyAsFormData: getForeignCompanyAsFormDataStub,
          saveCompanyForm: saveCompanyFormStub
        },
        '../repos/company.repo': {
          getCHCompany: getCHCompanyStub,
          getDitCompany: getDitCompanyStub
        },
        '../repos/metadata.repo': metadataRepositoryStub
      })

      const body = {
        id: '999',
        name: 'freds'
      }
      const req = {
        session: {
          token: '1234'
        },
        query: { business_type: 'charity' },
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
          expect(template).to.equal('company/edit-foreign')
          expect(res.locals).to.have.property('errors')
          done()
        }
      }
      companyControllerForeign.postDetails(req, res, next)
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
      companyControllerForeign.postDetails(req, res, next)
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
      companyControllerForeign.editCommon(req, res)
      expect(res.locals).to.have.property('regionOptions')
      expect(res.locals).to.have.property('sectorOptions')
      expect(res.locals).to.have.property('employeeOptions')
      expect(res.locals).to.have.property('turnoverOptions')
      expect(res.locals).to.have.property('headquarterOptions')
      expect(res.locals).to.have.property('hqLabels')
      expect(res.locals).to.have.property('csrfToken')
      expect(res.locals).to.have.property('companyDetailsLabels')
    })

    it('should goto the next function if there is one', function () {
      const next = sinon.stub()
      companyControllerForeign.editCommon(req, res, next)
      expect(next).to.be.called
    })
  })
})
