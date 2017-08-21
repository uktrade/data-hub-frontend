const metadatarepository = require('~/src/lib/metadata')

describe('company form service', function () {
  let companyFormService
  let saveCompanyStub

  beforeEach(function () {
    saveCompanyStub = sinon.stub().resolves({ id: '1234' })

    companyFormService = proxyquire('~/src/apps/companies/services/form', {
      '../repos': {
        saveCompany: saveCompanyStub,
      },
      '../../../lib/metadata': {
        businessTypeOptions: [{ id: '80756b9a-5d95-e211-a939-e4115bead28a', name: 'Private Limited Company' }],
        getIdForName: metadatarepository.getIdForName,
      },
    })
  })

  describe('convert from API to form data', function () {
    it('ltd', function () {
      const company = {
        id: '1234',
        company_number: '0011',
        business_type: { id: 'ltd', name: 'private limited' },
        uk_based: true,
        name: 'Fred',
        trading_name: 'Trading name',
        registered_address_1: 'a1',
        registered_address_2: 'a2',
        registered_address_town: 'at',
        registered_address_county: 'acounty',
        registered_address_postcode: 'apcode',
        registered_address_country: { id: 'c1', name: 'United Kingdom' },
        trading_address_1: 't1',
        trading_address_2: 't2',
        trading_address_town: 'tt',
        trading_address_county: 'tcounty',
        trading_address_postcode: 'tpcode',
        trading_address_country: { id: 'c1', name: 'United Kingdom' },
        uk_region: { id: 'r1', name: 'London' },
        headquarter_type: { id: 'h1', name: 'ukhq' },
        sector: { id: 's1', name: 'Computing' },
        website: 'http://www.test.com',
        description: 'description',
        employee_range: { id: 'e1', name: '1-100' },
        turnover_range: null,
      }
      const expected = {
        id: '1234',
        company_number: '0011',
        business_type: 'ltd',
        uk_based: 'yes',
        name: 'Fred',
        trading_name: 'Trading name',
        registered_address_1: 'a1',
        registered_address_2: 'a2',
        registered_address_town: 'at',
        registered_address_county: 'acounty',
        registered_address_postcode: 'apcode',
        registered_address_country: 'c1',
        trading_address_1: 't1',
        trading_address_2: 't2',
        trading_address_town: 'tt',
        trading_address_county: 'tcounty',
        trading_address_postcode: 'tpcode',
        trading_address_country: 'c1',
        uk_region: 'r1',
        headquarter_type: 'h1',
        sector: 's1',
        website: 'http://www.test.com',
        description: 'description',
        employee_range: 'e1',
        turnover_range: null,
      }
      const actual = companyFormService.getLtdCompanyAsFormData(company)
      expect(actual).to.deep.equal(expected)
    })
    it('ukother', function () {
      const company = {
        id: '1234',
        company_number: null,
        business_type: { id: 'sole', name: 'Sole trader' },
        uk_based: true,
        name: 'Fred',
        trading_name: 'Trading name',
        registered_address_1: 'a1',
        registered_address_2: 'a2',
        registered_address_town: 'at',
        registered_address_county: 'acounty',
        registered_address_postcode: 'apcode',
        registered_address_country: { id: 'c1', name: 'United Kingdom' },
        trading_address_1: 't1',
        trading_address_2: 't2',
        trading_address_town: 'tt',
        trading_address_county: 'tcounty',
        trading_address_postcode: 'tpcode',
        trading_address_country: { id: 'c1', name: 'United Kingdom' },
        uk_region: { id: 'r1', name: 'London' },
        headquarter_type: { id: 'h1', name: 'ukhq' },
        sector: { id: 's1', name: 'Computing' },
        website: 'http://www.test.com',
        description: 'description',
        employee_range: { id: 'e1', name: '1-100' },
        turnover_range: null,
      }
      const expected = {
        id: '1234',
        business_type: 'sole',
        uk_based: 'yes',
        name: 'Fred',
        trading_name: 'Trading name',
        registered_address_1: 'a1',
        registered_address_2: 'a2',
        registered_address_town: 'at',
        registered_address_county: 'acounty',
        registered_address_postcode: 'apcode',
        registered_address_country: 'c1',
        trading_address_1: 't1',
        trading_address_2: 't2',
        trading_address_town: 'tt',
        trading_address_county: 'tcounty',
        trading_address_postcode: 'tpcode',
        trading_address_country: 'c1',
        uk_region: 'r1',
        headquarter_type: 'h1',
        sector: 's1',
        website: 'http://www.test.com',
        description: 'description',
        employee_range: 'e1',
        turnover_range: null,
      }
      const actual = companyFormService.getUkOtherCompanyAsFormData(company)
      expect(actual).to.deep.equal(expected)
    })
    it('foreign', function () {
      const company = {
        id: '1234',
        company_number: null,
        business_type: { id: 'sole', name: 'Sole trader' },
        uk_based: false,
        name: 'Fred',
        trading_name: 'Trading name',
        registered_address_1: 'a1',
        registered_address_2: 'a2',
        registered_address_town: 'at',
        registered_address_county: 'acounty',
        registered_address_postcode: 'apcode',
        registered_address_country: { id: 'c1', name: 'France' },
        trading_address_1: 't1',
        trading_address_2: 't2',
        trading_address_town: 'tt',
        trading_address_county: 'tcounty',
        trading_address_postcode: 'tpcode',
        trading_address_country: { id: 'c1', name: 'France' },
        uk_region: { id: 'r1', name: 'London' },
        headquarter_type: { id: 'h1', name: 'ukhq' },
        sector: { id: 's1', name: 'Computing' },
        website: 'http://www.test.com',
        description: 'description',
        employee_range: { id: 'e1', name: '1-100' },
        turnover_range: null,
      }
      const expected = {
        id: '1234',
        business_type: 'sole',
        uk_based: 'no',
        name: 'Fred',
        trading_name: 'Trading name',
        registered_address_1: 'a1',
        registered_address_2: 'a2',
        registered_address_town: 'at',
        registered_address_county: 'acounty',
        registered_address_postcode: 'apcode',
        registered_address_country: 'c1',
        trading_address_1: 't1',
        trading_address_2: 't2',
        trading_address_town: 'tt',
        trading_address_county: 'tcounty',
        trading_address_postcode: 'tpcode',
        trading_address_country: 'c1',
        headquarter_type: 'h1',
        sector: 's1',
        website: 'http://www.test.com',
        description: 'description',
        employee_range: 'e1',
        turnover_range: null,
      }
      const actual = companyFormService.getForeignCompanyAsFormData(company)
      expect(actual).to.deep.equal(expected)
    })
    it('default populated form for CH data', function () {
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

      const expected = {
        company_number: '10620176',
        business_type: '80756b9a-5d95-e211-a939-e4115bead28a',
        uk_based: 'yes',
        name: 'ADALEOP LTD',
        registered_address_1: '13 HOWICK PARK AVENUE',
        registered_address_2: 'PENWORTHAM',
        registered_address_town: 'PRESTON',
        registered_address_county: null,
        registered_address_postcode: 'PR1 0LS',
        registered_address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
      }

      const formData = companyFormService.getDefaultLtdFormForCH(chCompany)

      expect(formData).to.deep.equal(expected)
    })
  })
  describe('save', function () {
    it('saves company data to repository', function () {
      const company = {
        thing: 'yes',
        other: 'no',
      }
      return companyFormService.saveCompanyForm('1234', company)
        .then((result) => {
          expect(saveCompanyStub).to.be.called
        })
    })
    it('converts yes/no to true/false', function () {
      const company = {
        thing: 'yes',
        other: 'no',
      }
      return companyFormService.saveCompanyForm('1234', company)
        .then((result) => {
          expect(saveCompanyStub).to.be.calledWith('1234', { thing: true, other: false })
        })
    })
    it('nulls empty fields', function () {
      const company = {
        thing: '',
      }
      return companyFormService.saveCompanyForm('1234', company)
        .then((result) => {
          expect(saveCompanyStub).to.be.calledWith('1234', { thing: null })
        })
    })
    it('handles errors', function () {
      saveCompanyStub = sinon.stub().rejects({ error: 'test' })
      companyFormService = proxyquire('~/src/apps/companies/services/form', {
        '../repos': {
          saveCompany: saveCompanyStub,
        },
      })
      const company = { thing: '' }

      return companyFormService.saveCompanyForm('1234', company)
        .catch((error) => {
          expect(error).to.deep.equal({ error: 'test' })
        })
    })
  })
})
