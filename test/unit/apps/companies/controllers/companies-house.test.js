const companyMock = {
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
const formattedMock = Object.assign({}, companyMock, {
  created_on: '11 April 2017',
  modified_on: '11 April 2017',
})

describe('Company controller, Companies House', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getDisplayCHStub = this.sandbox.stub().returns(formattedMock)
    this.breadcrumbStub = this.sandbox.stub().returnsThis()
    this.renderSpy = this.sandbox.spy()
    this.nextSpy = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/companies-house', {
      '../services/formatting': {
        getDisplayCH: this.getDisplayCHStub,
      },
    })

    this.reqMock = {

    }

    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      locals: {
        companiesHouseRecord: companyMock,
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('renderCompaniesHouseCompany()', () => {
    it('should set breadcrumb with company name', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.breadcrumbStub).to.have.been.calledWith(companyMock.name)
      expect(this.breadcrumbStub).to.have.been.calledOnce
    })

    it('should only call render once', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.renderSpy).to.have.been.calledOnce
    })

    it('should render the details template', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.renderSpy.args[0][0]).to.equal('companies/views/details')
    })

    it('should set the correct tab', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.renderSpy.args[0][1]).to.have.property('tab', 'details')
    })

    it('should send companies house labels to view', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.renderSpy.args[0][1]).to.have.property('chDetailsLabels')
    })

    it('should send companies house labels order to view', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.renderSpy.args[0][1]).to.have.property('chDetailsDisplayOrder')
    })

    it('should send formatted companies house company to view', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.renderSpy.args[0][1]).to.have.property('chDetails', formattedMock)
      expect(this.getDisplayCHStub).to.have.been.calledWith(companyMock)
    })

    it('should send company object to view', () => {
      this.controller.renderCompaniesHouseCompany(this.reqMock, this.resMock, this.nextSpy)

      expect(this.renderSpy.args[0][1]).to.have.property('company')
      expect(this.renderSpy.args[0][1].company).to.deep.equal({
        name: companyMock.name,
        company_number: companyMock.company_number,
        companies_house_data: companyMock,
        address: '13 Howick Park Avenue, Penwortham, Preston, PR1 0LS, United Kingdom',
      })
    })
  })
})
