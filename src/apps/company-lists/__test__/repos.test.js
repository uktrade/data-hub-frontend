const config = require('../../../../config')

const {
  getCompanyList,
  deleteCompanyList,
  createUserCompanyList,
  getListsCompanyIsIn,
  getAllCompanyLists,
  addCompanyToList,
  removeCompanyFromList,
} = require('../../../../src/apps/company-lists/repos')

const companyListFixture = require('../../../../test/unit/data/company-lists/list-with-multiple-items.json')

const companyListId = companyListFixture.id

describe('Company list repository', () => {
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
      const companyList = await createUserCompanyList('TEST_TOKEN', '1', 'listName')
      expect(companyList).to.deep.equal({ id: '1', name: 'listName', created_on: '2019' })
    })
  })

  describe('#getListsCompanyIsIn', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/v4/company-list?items__company_id=1')
        .reply(200, companyListFixture)
    })

    it('should return all lists a company is in', async () => {
      const companyList = await getListsCompanyIsIn('TEST_TOKEN', '1')
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
      const companyList = await getAllCompanyLists('TEST_TOKEN')
      expect(companyList).to.deep.equal(companyListFixture)
    })
  })

  describe('#getCompanyList', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v4/company-list/${companyListId}`)
        .reply(200, companyListFixture)
    })

    it('returns a company list', async () => {
      let companyList = await getCompanyList('token', companyListId)
      expect(companyList).to.deep.equal(companyListFixture)
    })
  })

  describe('#deleteCompanyList', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .delete(`/v4/company-list/${companyListId}`)
        .reply(204)
    })

    it('deletes a company list', () => {
      expect(
        () => deleteCompanyList('token', companyListId)
      ).to.not.throw()
    })
  })

  describe('#addCompanyToList', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .put('/v4/company-list/1/item/2')
        .reply(204)
    })

    it('should add a company to a list', () => {
      expect(
        () => addCompanyToList('TEST_TOKEN', '1', '2')
      ).to.not.throw()
    })
  })

  describe('#removeCompanyFromList', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .delete('/v4/company-list/1/item/2')
        .reply(204)
    })

    it('should delete a company from a list', () => {
      expect(
        () => removeCompanyFromList('TEST_TOKEN', '1', '2')
      ).to.not.throw()
    })
  })
})
