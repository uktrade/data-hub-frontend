const requestErrors = require('request-promise/errors')
const buildMiddlewareParameters = require('../../../../test/unit/helpers/middleware-parameters-builder')
const config = require('../../../config')

const {
  fetchCompanyList,
  getCompanyList,
  deleteCompanyList,
  createUserCompanyList,
  getListsCompanyIsIn,
  getAllCompanyLists,
  addCompanyToList,
  removeCompanyFromList,
} = require('../../../../src/apps/company-lists/repos')

const companyList = require('../../../../test/unit/data/company-lists/list-with-multiple-items.json')
const companyListFixture = require('../../../../test/unit/data/company-lists/list-with-multiple-items.json')

const listId = companyListFixture.id
const stubRequest = { session: { token: 'abcd' } }

describe('Company list repository', () => {
  describe('#fetchCompanyList', () => {
    let middlewareParameters

    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
        requestParams: {
          listId,
        },
      })
    })
    context('when the list is successfully retrieved', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/company-list/${listId}`)
          .reply(200, companyList)

        await fetchCompanyList(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('adds the company list to res.locals', () => {
        expect(
          middlewareParameters.resMock.locals.companyList
        ).to.be.deep.equal(companyList)
      })
    })

    context('when there is an error retrieving the list', () => {
      beforeEach(async () => {
        nock(config.apiRoot).get(`/v4/company-list/${listId}`).reply(404)

        await fetchCompanyList(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('forwards the error to the next middleware', () => {
        expect(middlewareParameters.resMock.locals.companyList).to.be.undefined
        expect(middlewareParameters.nextSpy).to.be.called
        expect(middlewareParameters.nextSpy.firstCall.args[0]).to.be.instanceof(
          requestErrors.StatusCodeError
        )
      })
    })
  })

  describe('#createUserCompanyList', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .post('/v4/company-list', {
          id: '1',
          name: 'listName',
        })
        .reply(200, { id: '1', name: 'listName', created_on: '2019' })
    })

    it('should return company', async () => {
      const companyList = await createUserCompanyList(
        stubRequest,
        '1',
        'listName'
      )
      expect(companyList).to.deep.equal({
        id: '1',
        name: 'listName',
        created_on: '2019',
      })
    })
  })

  describe('#getListsCompanyIsIn', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/v4/company-list?items__company_id=1')
        .reply(200, companyListFixture)
    })

    it('should return all lists a company is in', async () => {
      const companyList = await getListsCompanyIsIn(stubRequest, '1')
      expect(companyList).to.deep.equal(companyListFixture)
    })
  })

  describe('#getAllCompanyLists', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/v4/company-list')
        .reply(200, companyListFixture)
    })

    it('should return all company lists', async () => {
      const companyList = await getAllCompanyLists(stubRequest)
      expect(companyList).to.deep.equal(companyListFixture)
    })
  })

  describe('#getCompanyList', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v4/company-list/${listId}`)
        .reply(200, companyListFixture)
    })

    it('returns a company list', async () => {
      const companyList = await getCompanyList(stubRequest, listId)
      expect(companyList).to.deep.equal(companyListFixture)
    })
  })

  describe('#deleteCompanyList', () => {
    beforeEach(() => {
      nock(config.apiRoot).delete(`/v4/company-list/${listId}`).reply(204)
    })

    it('deletes a company list', () => {
      expect(() => deleteCompanyList(stubRequest, listId)).to.not.throw()
    })
  })

  describe('#addCompanyToList', () => {
    beforeEach(() => {
      nock(config.apiRoot).put('/v4/company-list/1/item/2').reply(204)
    })

    it('should add a company to a list', () => {
      expect(() => addCompanyToList(stubRequest, '1', '2')).to.not.throw()
    })
  })

  describe('#removeCompanyFromList', () => {
    beforeEach(() => {
      nock(config.apiRoot).delete('/v4/company-list/1/item/2').reply(204)
    })

    it('should delete a company from a list', () => {
      expect(() => removeCompanyFromList(stubRequest, '1', '2')).to.not.throw()
    })
  })
})
