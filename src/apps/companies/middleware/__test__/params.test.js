const proxyquire = require('proxyquire')
const company = require('../../../../../test/unit/data/companies/company-v4.json')
const oneListTypeDItaCompany = require('../../../../../test/unit/data/companies/one-list-group-tier-d-ita.json')

describe('Companies form middleware', () => {
  let nextSpy
  let getDitCompanyStub
  let getDitCompanyFromListStub
  let addDitCompanyToListStub
  let getAllCompanyListsStub
  let removeDitCompanyFromListStub
  let flashSpy
  let redirectSpy
  let reqMock
  let resMock
  let middleware

  before(() => {
    nextSpy = sinon.spy()
    getDitCompanyStub = sinon.stub()
    getDitCompanyFromListStub = sinon.stub()
    addDitCompanyToListStub = sinon.stub()
    getAllCompanyListsStub = sinon.stub()
    removeDitCompanyFromListStub = sinon.stub()
    flashSpy = sinon.spy()
    redirectSpy = sinon.spy()
    reqMock = { query: {}, session: { token: 2 } }
    resMock = {
      locals: {},
    }

    middleware = proxyquire('../../../../../src/apps/companies/middleware/params', {
      '../repos': {
        getDitCompany: getDitCompanyStub,
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
    context('when the company is not a One list Tier D ITA', () => {
      before(async () => {
        getDitCompanyStub.resolves(company)
        await middleware.getCompany(reqMock, resMock, nextSpy, 2)
      })

      it('should return the company', () => {
        expect(resMock.locals).to.have.deep.property('company', {
          ...company,
          isItaTierDAccount: false,
          hasAllocatedLeadIta: true,
          hasManagedAccountDetails: true,
          isGlobalHQ: null,
          isUltimate: false,
        })
      })
    })
    context('when the company is a One list Tier D ITA', () => {
      before(async () => {
        getDitCompanyStub.resolves(oneListTypeDItaCompany)
        await middleware.getCompany(reqMock, resMock, nextSpy, 2)
      })

      it('should return the company', () => {
        expect(resMock.locals).to.have.deep.property('company', {
          ...oneListTypeDItaCompany,
          isItaTierDAccount: true,
          hasAllocatedLeadIta: true,
          hasManagedAccountDetails: true,
          isGlobalHQ: null,
          isUltimate: false,
        })
      })
    })
  })

  describe('setIsCompanyAlreadyAdded', () => {
    context('when the company is already added to the user company list', async () => {
      before(async () => {
        getDitCompanyFromListStub.resolves()
        await middleware.setIsCompanyAlreadyAdded(reqMock, resMock, nextSpy, 2)
      })

      it('should set a local variable for displaying a user message', () => {
        expect(resMock.locals).to.have.deep.property('isCompanyAlreadyAdded', true)
      })
    })

    context('when the company is not added to the user company list', async () => {
      before(async () => {
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
      before(async () => {
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
      before(async () => {
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
})
