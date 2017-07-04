const { LTD, UKOTHER, FOREIGN } = require('~/src/apps/companies/services/data')
const company = require('../../../data/company/ukothercompany.json')

describe('Company controller, details', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getDisplayCompanyStub = this.sandbox.stub()
    this.detailsController = proxyquire('~/src/apps/companies/controllers/details', {
      '../services/formatting': {
        getDisplayCompany: this.getDisplayCompanyStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should get formatted data for CDMS company details', (done) => {
    this.detailsController.getDetails({
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }, {
      locals: {
        company,
        headingName: 'test',
      },
      render: (tempate, data) => {
        expect(this.getDisplayCompanyStub).to.be.calledWith(company)
        expect(data).to.have.property('companyDetails')
        done()
      },
    },
    (error) => {
      done(error)
    })
  })

  it('should pick the correct fields to show for a ltd company', (done) => {
    this.detailsController.getDetails({
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }, {
      locals: {
        company,
        companyType: LTD,
        headingName: 'test',
      },
      render: (tempate, data) => {
        expect(data.companyDetailsDisplayOrder).to.deep.equal(['alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range'])
        done()
      },
    },
    (error) => {
      done(error)
    })
  })

  it('should pick the correct fields to show for a uk other company', (done) => {
    this.detailsController.getDetails({
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }, {
      locals: {
        company,
        companyType: UKOTHER,
        headingName: 'test',
      },
      render: (tempate, data) => {
        expect(data.companyDetailsDisplayOrder).to.deep.equal(['business_type', 'registered_address', 'alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range'])
        done()
      },
    },
    (error) => {
      done(error)
    })
  })

  it('should pick the correct fields to show for a foreign company', (done) => {
    this.detailsController.getDetails({
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }, {
      locals: {
        company,
        companyType: FOREIGN,
        headingName: 'test',
      },
      render: (tempate, data) => {
        expect(data.companyDetailsDisplayOrder).to.deep.equal(['business_type', 'registered_address', 'alias', 'trading_address', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range'])
        done()
      },
    },
    (error) => {
      done(error)
    })
  })

  it('should provide account management information', (done) => {
    this.detailsController.getDetails({
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }, {
      locals: {
        company,
        headingName: 'test',
      },
      render: (template, data) => {
        expect(data).to.have.property('accountManagementDisplay')
        expect(data).to.have.property('accountManagementDisplayLabels')
        done()
      },
    },
    (error) => {
      done(error)
    })
  })

  it('should set the correct tab and title', (done) => {
    this.detailsController.getDetails({
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }, {
      locals: {
        company,
        headingName: 'test',
      },
      render: (template, data) => {
        expect(data.tab).to.equal('details')
        expect(data.title).to.deep.equal(['test', 'Companies'])
        done()
      },
    },
    (error) => {
      done(error)
    })
  })
})
