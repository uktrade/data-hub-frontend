const proxyquire = require('proxyquire')
const company = require('../../../../unit/data/companies/company-v4.json')
const companiesHouseRecord = require('../../../../unit/data/companies/companies-house.json')

describe('Companies form middleware', () => {
  let nextSpy
  let getDitCompanyStub
  let getCHCompanyStub
  let getDitCompanyFromListStub
  let addDitCompanyToListStub
  let getAllCompanyListsStub
  let removeDitCompanyFromListStub
  let flashSpy
  let redirectSpy
  let reqMock
  let resMock
  let middleware

  beforeEach(() => {
    nextSpy = sinon.spy()
    getDitCompanyStub = sinon.stub()
    getCHCompanyStub = sinon.stub()
    getDitCompanyFromListStub = sinon.stub()
    addDitCompanyToListStub = sinon.stub()
    getAllCompanyListsStub = sinon.stub()
    removeDitCompanyFromListStub = sinon.stub()
    flashSpy = sinon.spy()
    redirectSpy = sinon.spy()
    reqMock = { query: {}, session: { token: 2 } }
    resMock = {
      locals: {
        user: {
          permissions: ['company_list.view_companylist'],
        },
      },
    }

    middleware = proxyquire('../../../../../src/apps/companies/middleware/params', {
      '../repos': {
        getDitCompany: getDitCompanyStub,
        getCHCompany: getCHCompanyStub,
        getDitCompanyFromList: getDitCompanyFromListStub,
        addDitCompanyToList: addDitCompanyToListStub,
        removeDitCompanyFromList: removeDitCompanyFromListStub,
      },
      '../../company-lists/repos': {
        getAllCompanyLists: getAllCompanyListsStub,
      },
    })
  })

  describe('getCompany', () => {
    beforeEach(async () => {
      getDitCompanyStub.resolves(company)
      await middleware.getCompany(reqMock, resMock, nextSpy, 2)
    })

    it('should return the company', () => {
      expect(resMock.locals).to.have.deep.property('company', company)
    })
  })

  describe('getCompaniesHouseRecord', () => {
    context('when the API returns a companies house record', async () => {
      beforeEach(async () => {
        getCHCompanyStub.resolves(companiesHouseRecord)
        await middleware.getCompaniesHouseRecord(reqMock, resMock, nextSpy, 2)
      })

      it('should return the companies house record', () => {
        expect(resMock.locals).to.have.deep.property('companiesHouseRecord', companiesHouseRecord)
      })

      it('should return the companies house category', () => {
        expect(resMock.locals).to.have.property('companiesHouseCategory', 'Private Limited Company')
      })
    })
  })

  describe('setIsCompanyAlreadyAdded', () => {
    context('when the company is already added to the user company list', async () => {
      beforeEach(async () => {
        getDitCompanyFromListStub.resolves()
        await middleware.setIsCompanyAlreadyAdded(reqMock, resMock, nextSpy, 2)
      })

      it('should set a local variable for displaying a user message', () => {
        expect(resMock.locals).to.have.deep.property('isCompanyAlreadyAdded', true)
      })
    })

    context('when the company is not added to the user company list', async () => {
      beforeEach(async () => {
        getDitCompanyFromListStub.rejects()
        await middleware.setIsCompanyAlreadyAdded(reqMock, resMock, nextSpy, 2)
      })

      it('should not set a local variable for displaying a user message', () => {
        expect(resMock.locals).to.not.have.deep.property('isCompanyAlreadyAdded', true)
      })
    })
  })

  describe('addCompanyOrRemoveFromList', () => {
    context('when adding a company to the user company list', async () => {
      beforeEach(async () => {
        resMock = {
          ...resMock,
          locals: {
            company: {
              id: '2',
            },
          },
          redirect: redirectSpy,
        }
        reqMock = {
          ...reqMock,
          body: {
            action: 'add',
          },
          flash: flashSpy,
        }
        await middleware.addCompanyOrRemoveFromList(reqMock, resMock, nextSpy)
      })
      it('should add a company to the user list', () => {
        expect(addDitCompanyToListStub).to.be.calledOnce
        expect(flashSpy).to.be.calledWith('success', 'This company has been added to your list of companies. You can find this list on your Data Hub Home page. Only you can see this list.')
      })
      it('should redirect to the company page', () => {
        expect(redirectSpy).to.be.calledWithExactly(`${reqMock.baseUrl}/${resMock.locals.company.id}`)
      })
    })
    context('when removing a company from the user company list', async () => {
      beforeEach(async () => {
        resMock = {
          ...resMock,
          locals: {
            company: {
              id: '2',
            },
          },
          redirect: redirectSpy,
        }
        reqMock = {
          ...reqMock,
          body: {
            action: 'remove',
          },
          baseUrl: '/companies',
          flash: flashSpy,
        }
        await middleware.addCompanyOrRemoveFromList(reqMock, resMock, nextSpy)
      })
      it('should remove a company from the user list', () => {
        expect(removeDitCompanyFromListStub).to.be.calledOnce
        expect(flashSpy).to.be.calledWithExactly('success', 'This company has been removed from your list.')
      })
      it('should redirect to the company page', () => {
        expect(redirectSpy).to.be.calledWithExactly(`${reqMock.baseUrl}/${resMock.locals.company.id}`)
      })
    })
  })

  describe('setDoAnyListsExist', () => {
    context('when a users has company lists added', async () => {
      beforeEach(async () => {
        nextSpy = sinon.spy()
        getAllCompanyListsStub.resolves({ count: 1 })
        await middleware.setDoAnyListsExist(reqMock, resMock, nextSpy, 2)
      })

      it('should set a local variable for displaying the right action on the companies page', () => {
        expect(resMock.locals).to.have.deep.property('listsExist', true)
        expect(nextSpy).to.have.been.called
      })
    })
    context('when a users has no company lists added', async () => {
      beforeEach(async () => {
        nextSpy = sinon.spy()
        getAllCompanyListsStub.resolves({ count: 0 })
        await middleware.setDoAnyListsExist(reqMock, resMock, nextSpy, 2)
      })

      it('should set a local variable for displaying the right action on the companies page', () => {
        expect(resMock.locals).to.have.deep.property('listsExist', false)
        expect(nextSpy).to.have.been.called
      })
    })
    context('when there is an error getting company lists', async () => {
      beforeEach(async () => {
        nextSpy = sinon.spy()
        getAllCompanyListsStub.rejects()
        await middleware.setDoAnyListsExist(reqMock, resMock, nextSpy, 2)
      })
      it('should throw an error', () => {
        expect(nextSpy.firstCall.args[0]).to.be.instanceof(Error)
      })
    })
    context('when the user is a LEP/DA or has no permission to view/edit company lists', () => {
      beforeEach(async () => {
        resMock = {
          ...resMock,
          locals: {
            user: {
              permissions: [],
            },
          },
        }
        nextSpy = sinon.spy()
        await middleware.setDoAnyListsExist(reqMock, resMock, nextSpy, 2)
      })
      it('should not call the API', () => {
        expect(resMock.locals.canViewCompanyList).to.equal(false)
        expect(nextSpy).to.have.been.called
      })
    })
  })
})
