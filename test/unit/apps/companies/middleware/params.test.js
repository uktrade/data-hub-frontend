const company = require('~/test/unit/data/companies/company-v4.json')
const companiesHouseRecord = require('~/test/unit/data/companies/companies-house.json')

describe('Companies form middleware', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.getDitCompanyStub = sinon.stub()
    this.getCHCompanyStub = sinon.stub()
    this.getDitCompanyFromListStub = sinon.stub()
    this.addDitCompanyToListStub = sinon.stub()
    this.removeDitCompanyFromListStub = sinon.stub()
    this.flashSpy = sinon.spy()
    this.redirectSpy = sinon.spy()
    this.reqMock = { query: {}, session: { token: 2 } }
    this.resMock = { locals: {} }

    this.middleware = proxyquire('~/src/apps/companies/middleware/params.js', {
      '../repos': {
        getDitCompany: this.getDitCompanyStub,
        getCHCompany: this.getCHCompanyStub,
        getDitCompanyFromList: this.getDitCompanyFromListStub,
        addDitCompanyToList: this.addDitCompanyToListStub,
        removeDitCompanyFromList: this.removeDitCompanyFromListStub,
      },
    })
  })

  describe('getCompany', () => {
    beforeEach(async () => {
      this.getDitCompanyStub.resolves(company)
      await this.middleware.getCompany(this.reqMock, this.resMock, this.nextSpy, 2)
    })

    it('should return the company', () => {
      expect(this.resMock.locals).to.have.deep.property('company', company)
    })
  })

  describe('getCompaniesHouseRecord', () => {
    context('when the API returns a companies house record', async () => {
      beforeEach(async () => {
        this.getCHCompanyStub.resolves(companiesHouseRecord)
        await this.middleware.getCompaniesHouseRecord(this.reqMock, this.resMock, this.nextSpy, 2)
      })

      it('should return the companies house record', () => {
        expect(this.resMock.locals).to.have.deep.property('companiesHouseRecord', companiesHouseRecord)
      })

      it('should return the companies house category', () => {
        expect(this.resMock.locals).to.have.property('companiesHouseCategory', 'Private Limited Company')
      })
    })
  })

  describe('setIsCompanyAlreadyAdded', () => {
    context('when the company is already added to the user company list', async () => {
      beforeEach(async () => {
        this.getDitCompanyFromListStub.resolves()
        await this.middleware.setIsCompanyAlreadyAdded(this.reqMock, this.resMock, this.nextSpy, 2)
      })

      it('should set a local variable for displaying a user message', () => {
        expect(this.resMock.locals).to.have.deep.property('isCompanyAlreadyAdded', true)
      })
    })

    context('when the company is not added to the user company list', async () => {
      beforeEach(async () => {
        this.getDitCompanyFromListStub.rejects()
        await this.middleware.setIsCompanyAlreadyAdded(this.reqMock, this.resMock, this.nextSpy, 2)
      })

      it('should not set a local variable for displaying a user message', () => {
        expect(this.resMock.locals).to.not.have.deep.property('isCompanyAlreadyAdded', true)
      })
    })
  })

  describe('addCompanyOrRemoveFromList', () => {
    context('when adding a company to the user company list', async () => {
      beforeEach(async () => {
        this.resMock = {
          ...this.resMock,
          locals: {
            company: {
              id: '2',
            },
          },
          redirect: this.redirectSpy,
        }
        this.reqMock = {
          ...this.reqMock,
          body: {
            action: 'add',
          },
          flash: this.flashSpy,
        }
        await this.middleware.addCompanyOrRemoveFromList(this.reqMock, this.resMock, this.nextSpy)
      })
      it('should add a company to the user list', () => {
        expect(this.addDitCompanyToListStub).to.be.calledOnce
        expect(this.flashSpy).to.be.calledWithExactly('success', 'This company has been added to your list of companies. You can find this list on your Data Hub Home page. Only you can see this list.')
      })
      it('should redirect to the company page', () => {
        expect(this.redirectSpy).to.be.calledWithExactly(`${this.reqMock.baseUrl}/${this.resMock.locals.company.id}`)
      })
    })
    context('when removing a company from the user company list', async () => {
      beforeEach(async () => {
        this.resMock = {
          ...this.resMock,
          locals: {
            company: {
              id: '2',
            },
          },
          redirect: this.redirectSpy,
        }
        this.reqMock = {
          ...this.reqMock,
          body: {
            action: 'remove',
          },
          baseUrl: '/companies',
          flash: this.flashSpy,
        }
        await this.middleware.addCompanyOrRemoveFromList(this.reqMock, this.resMock, this.nextSpy)
      })
      it('should remove a company from the user list', () => {
        expect(this.removeDitCompanyFromListStub).to.be.calledOnce
        expect(this.flashSpy).to.be.calledWithExactly('success', 'This company has been removed from your list.')
      })
      it('should redirect to the company page', () => {
        expect(this.redirectSpy).to.be.calledWithExactly(`${this.reqMock.baseUrl}/${this.resMock.locals.company.id}`)
      })
    })
  })
})
