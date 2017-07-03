const companiesHouseData = require('../../data/companies-house.json')

describe('Companies house controllers', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getCompaniesHouseStub = this.sandbox.stub().resolves(companiesHouseData)
    this.getDisplayCompaniesHouseStub = this.sandbox.stub()
    this.token = '1234'
    this.id = '111'

    this.controller = proxyquire('~/src/apps/companies-house/controllers', {
      './repos': {
        getCompaniesHouse: this.getCompaniesHouseStub,
      },
      './services/formatting': {
        getDisplayCompaniesHouse: this.getDisplayCompaniesHouseStub,
      },
    })

    this.req = {
      params: {
        id: this.id,
      },
      session: {
        token: this.token,
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should get companies house details', (done) => {
    this.controller.getDetails(
      this.req,
      {
        render: () => {
          expect(this.getCompaniesHouseStub).to.be.calledWith(this.token, this.id)
          done()
        },
      },
      done
    )
  })

  it('should return formatted companies house data, labels and keys', (done) => {
    this.controller.getDetails(
      this.req,
      {
        render: (template, options) => {
          expect(this.getDisplayCompaniesHouseStub).to.be.calledWith(companiesHouseData)
          expect(options).to.have.property('companiesHouseDetails')
          expect(options).to.have.property('companiesHouseDetailsDisplayOrder')
          expect(options).to.have.property('companiesHouseDetailsLabels')
          done()
        },
      },
      done
    )
  })

  it('should include a url to add a new company', (done) => {
    this.controller.getDetails(
      this.req,
      {
        render: (template, options) => {
          expect(options).to.have.property('addUrl', '/company/add/ltd/02658484')
          done()
        },
      },
      done
    )
  })

  it('should give a display name for the heading', (done) => {
    this.controller.getDetails(
      this.req,
      {
        render: (template, options) => {
          expect(options.headingName).to.equal('Amazon Savers')
          done()
        },
      },
      done
    )
  })

  it('should include page title information', (done) => {
    this.controller.getDetails(
      this.req,
      {
        render: (template, options) => {
          expect(options.title).to.deep.equal(['Amazon Savers', 'Companies House'])
          done()
        },
      },
      done
    )
  })
})
