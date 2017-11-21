const { assign } = require('lodash')

const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const transformCompanyToOneListView = require('~/src/apps/companies/transformers/company-to-one-list-view')

describe('transformCompanyToOneListView', () => {
  context('when there is one list information', () => {
    beforeEach(() => {
      const company = assign({}, minimalCompany, {
        one_list_account_owner: null,
        classification: null,
      })

      this.viewRecord = transformCompanyToOneListView(company)
    })

    it('indicate there is no one list account management information', () => {
      expect(this.viewRecord).to.deep.equal({
        'One List account manager': 'None',
        'One List tier': 'None',
      })
    })
  })

  context('when there is no one list information', () => {
    beforeEach(() => {
      const company = assign({}, minimalCompany, {
        one_list_account_owner: {
          id: '1234',
          name: 'The owner',
        },
        classification: {
          id: '4321',
          name: 'The classification',
        },
      })

      this.viewRecord = transformCompanyToOneListView(company)
    })

    it('indicate there is no one list account management information', () => {
      expect(this.viewRecord).to.deep.equal({
        'One List account manager': 'The owner',
        'One List tier': 'The classification',
      })
    })
  })
})
