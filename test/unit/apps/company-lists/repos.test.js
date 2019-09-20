const config = require('~/config')

const {
  getCompanyList,
  deleteCompanyList,
  createUserCompanyList,
} = require('~/src/apps/company-lists/repos')

const companyListFixture = require('~/test/unit/data/company-lists/list-with-multiple-items.json')

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
    beforeEach(async () => {
      nock(config.apiRoot)
        .delete(`/v4/company-list/${companyListId}`)
        .reply(204)
    })

    it('deletes a company list', async () => {
      expect(
        async () => deleteCompanyList('token', companyListId)
      ).to.not.throw()
    })
  })
})
