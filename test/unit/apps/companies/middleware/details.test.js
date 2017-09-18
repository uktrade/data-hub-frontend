describe('Company details middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.company = require('~/test/unit/data/companies/company.json')

    this.getDitCompanyStub = this.sandbox.stub().resolves(this.company)

    this.detailsMiddleware = proxyquire('~/src/apps/companies/middleware/details', {
      '../repos': {
        getDitCompany: this.getDitCompanyStub,
      },
    })

    this.req = {
      query: {},
      params: {
        companyId: '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
      },
      session: {
        token: '1234',
      },
    }

    this.res = {
      locals: {},
    }

    this.next = this.sandbox.stub()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('fetch company data', () => {
    it('should not fetch company data if the ID is not a GUID', async () => {
      this.req.params.companyId = '1234'
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)
      expect(this.getDitCompanyStub).to.not.be.called
    })

    it('should fetch company data if the ID is a GUID', async () => {
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)
      expect(this.getDitCompanyStub).to.be.calledWith('1234', '3a4b36c6-a950-43c5-ba41-82cf6bffaa91')
    })
  })

  describe('get address for header', () => {
    it('should not return an address if the ID is not a UID', async () => {
      this.req.params.companyId = '1234'
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)
      expect(this.res.locals).to.not.have.property('headingAddress')
    })

    it('should return the datahub trading address if there is one', async () => {
      this.company = Object.assign({}, {
        trading_address_1: 'Trading address',
        trading_address_2: '2 Victoria Street',
        trading_address_town: 'Trading town',
        trading_address_county: 'Trading county',
        trading_address_postcode: 'WC1 1AA',
        trading_address_country: {
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
          name: 'United Kingdom',
        },
      }, this.company)

      this.getDitCompanyStub.resolves(this.company)
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)

      expect(this.res.locals.headingAddress).to.equal('Trading Address, 2 Victoria Street, Trading Town, Trading County, WC1 1AA, United Kingdom')
    })

    it('should return the datahub registered address if there is no trading and no CH', async () => {
      this.company = Object.assign({}, {
        companies_house_data: null,
        trading_address_1: null,
        trading_address_2: null,
        trading_address_town: null,
        trading_address_county: null,
        trading_address_postcode: null,
        trading_address_country: null,
      }, this.company)

      this.getDitCompanyStub.resolves(this.company)
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)

      expect(this.res.locals.headingAddress).to.equal('52a High Street, Sheffield, S20 1ED, United Kingdom')
    })

    it('should return the CH registered address if there is no trading address but there is a CH', async () => {
      this.company = Object.assign({}, {
        companies_house_data: {
          id: 4179778,
          name: 'AMAZON SAVERS',
          registered_address_1: '52A HIGH STREET',
          registered_address_2: '',
          registered_address_town: 'SHEFFIELD',
          registered_address_county: '',
          registered_address_postcode: 'S20 1ED',
          company_number: '02658484',
          company_category: 'Private Limited Company',
          company_status: 'Active',
          sic_code_1: '82990 - Other business support service activities n.e.c.',
          sic_code_2: '82991 - Other business support service activities n.e.c.',
          sic_code_3: '',
          sic_code_4: '',
          uri: 'http://business.data.gov.uk/id/companies/07937720',
          incorporation_date: '2012-02-06',
          registered_address_country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
            name: 'United Kingdom',
          },
        },
        registered_address_county: 'Greater London',
        registered_address_postcode: 'SW1H 0ET',
        trading_address_1: null,
        trading_address_2: null,
        trading_address_town: null,
        trading_address_county: null,
        trading_address_postcode: null,
        trading_address_country: null,
      }, this.company)

      this.getDitCompanyStub.resolves(this.company)
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)

      expect(this.res.locals.headingAddress).to.equal('52a High Street, Sheffield, S20 1ED, United Kingdom')
    })
  })

  describe('get company name for title', () => {
    it('should not return a title name if the ID is not a GUID', async () => {
      this.req.params.companyId = '1234'
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)
      expect(this.res.locals).to.not.have.property('headingName')
    })

    it('should return the trading name if there is one for a datahub company', async () => {
      this.company = Object.assign({}, {
        trading_name: 'Trading',
      }, this.company)

      this.getDitCompanyStub.resolves(this.company)
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)

      expect(this.res.locals.headingName).to.equal('Trading')
    })

    it('should return the registered name if there is no trading name for a datahub company', async () => {
      this.company = Object.assign({}, {
        trading_name: '',
        name: 'Registered',
      }, this.company)

      this.getDitCompanyStub.resolves(this.company)
      await this.detailsMiddleware.getCompanyDetails(this.req, this.res, this.next)

      expect(this.res.locals.headingName).to.equal('Registered')
    })
  })
})
