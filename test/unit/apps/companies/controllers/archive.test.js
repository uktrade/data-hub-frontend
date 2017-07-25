const next = function (error) {
  throw Error(error)
}

describe('Company controller, archive', function () {
  let companyRepositoryArchiveCompanyStub
  let companyRepositoryUnArchiveCompanyStub
  let buildCompanyUrlStub
  let flashStub
  const token = '1234'
  const company = {
    id: '9999',
    company_number: '10620176',
    companies_house_data: null,
    name: 'ADALEOP LTD',
    registered_address_1: '13 HOWICK PARK AVENUE',
    registered_address_2: 'PENWORTHAM',
    registered_address_town: 'PRESTON',
    registered_address_county: '',
    registered_address_postcode: 'PR1 0LS',
  }
  let getDitCompanyStub
  let companyArchiveController

  beforeEach(function () {
    this.resMock = {
      breadcrumb: {
        add: () => this.resMock,
        update: () => this.resMock,
        get: () => [],
      },
    }
    getDitCompanyStub = sinon.stub().resolves(company)
    buildCompanyUrlStub = sinon.stub().returns('/testurl')
    companyRepositoryArchiveCompanyStub = sinon.stub().resolves(null)
    companyRepositoryUnArchiveCompanyStub = sinon.stub().resolves(null)
    companyArchiveController = proxyquire('~/src/apps/companies/controllers/archive', {
      '../services/data': {
        buildCompanyUrl: buildCompanyUrlStub,
      },
      '../repos': {
        getDitCompany: getDitCompanyStub,
        archiveCompany: companyRepositoryArchiveCompanyStub,
        unarchiveCompany: companyRepositoryUnArchiveCompanyStub,
      },
    })
    flashStub = sinon.stub()
  })
  it('should call the archive company method for the id and reason', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'test', archived_reason_other: '' },
      params: {
        id: company.id,
      },
      flash: flashStub,
    }
    const res = Object.assign(this.resMock, {
      locals: {},
      redirect: function () {
        expect(companyRepositoryArchiveCompanyStub).to.be.calledWith(token, company.id, req.body.archived_reason)
        done()
      },
    })

    companyArchiveController.postArchiveCompany(req, res, next)
  })
  it('should call the archive company method for the id and other reason', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'Other', archived_reason_other: 'otherreason' },
      params: {
        id: company.id,
      },
      flash: flashStub,
    }
    const res = Object.assign(this.resMock, {
      locals: {},
      redirect: function () {
        expect(companyRepositoryArchiveCompanyStub).to.be.calledWith(token, company.id, req.body.archived_reason_other)
        done()
      },
    })

    companyArchiveController.postArchiveCompany(req, res, next)
  })
  it('should get the company and generate a url to redirect to', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'Other', archived_reason_other: 'otherreason' },
      params: {
        id: company.id,
      },
      flash: flashStub,
    }
    const res = Object.assign(this.resMock, {
      locals: {},
      redirect: function (url) {
        expect(getDitCompanyStub).to.be.calledWith(token, company.id)
        expect(buildCompanyUrlStub).to.be.calledWith(company)
        expect(url).to.equal('/testurl')
        done()
      },
    })

    companyArchiveController.postArchiveCompany(req, res, next)
  })
  it('should send a flash message that all went well', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'Other', archived_reason_other: 'otherreason' },
      params: {
        id: company.id,
      },
      flash: flashStub,
    }
    const res = Object.assign(this.resMock, {
      locals: {},
      redirect: function (url) {
        expect(flashStub).to.be.calledWith('success', 'Updated company record')
        done()
      },
    })

    companyArchiveController.postArchiveCompany(req, res, next)
  })
  it('should sent a flash message if there was a problem', function (done) {
    const req = {
      session: { token },
      body: { archived_reason: 'Other', archived_reason_other: '' },
      params: {
        id: company.id,
      },
      flash: flashStub,
    }
    const res = Object.assign(this.resMock, {
      locals: {},
      redirect: function (url) {
        expect(flashStub).to.be.calledWith('error', 'Unable to archive company, no reason given')
        done()
      },
    })

    companyArchiveController.postArchiveCompany(req, res, next)
  })
  it('should call unarchive', function (done) {
    const req = {
      session: { token },
      params: {
        id: company.id,
      },
      flash: flashStub,
    }
    const res = Object.assign(this.resMock, {
      locals: {},
      redirect: function () {
        expect(companyRepositoryUnArchiveCompanyStub).to.be.calledWith(token, company.id)
        done()
      },
    })

    companyArchiveController.getUnarchiveCompany(req, res, next)
  })
})
