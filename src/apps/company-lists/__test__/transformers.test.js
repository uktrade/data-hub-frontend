const allLists = require('../../../../test/unit/data/company-lists/all-lists')
const allListsCompaniesIn = require('../../../../test/unit/data/company-lists/all-lists-company-is-in')

const {
  transformCompaniesInLists,
} = require('../../../../src/apps/company-lists/transformers')

describe('#transformCompaniesInLists', () => {
  let transformed
  beforeEach(async () => {
    transformed = await transformCompaniesInLists(allLists, allListsCompaniesIn)
  })
  it('should return a list of what lists the company is in', () => {
    expect(transformed).to.deep.equal({
      companyLists: [
        {
          listName: 'List A',
          listId: '75e14e32-292e-4d1b-a361-992d548251f7',
          isAdded: 'yes',
        },
        {
          listName: 'List B',
          listId: 'a87af6bc-e117-47c7-ad3d-35f9900bbd0e',
          isAdded: 'no',
        },
      ],
    })
  })
})
