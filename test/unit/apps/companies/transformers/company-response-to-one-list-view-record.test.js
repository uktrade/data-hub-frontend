const { assign } = require('lodash')

const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const transformCompanyResponseToOneListViewRecord = require('~/src/apps/companies/transformers/company-response-to-one-list-view-record')

describe('transformCompanyResponseToOneListViewRecord', () => {
  context('when there is one list information', () => {
    beforeEach(() => {
      const company = assign({}, minimalCompany, {
        one_list_account_owner: null,
        classification: null,
      })

      this.viewRecord = transformCompanyResponseToOneListViewRecord(company)
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

      this.viewRecord = transformCompanyResponseToOneListViewRecord(company)
    })

    it('indicate there is no one list account management information', () => {
      expect(this.viewRecord).to.deep.equal({
        'One List account manager': 'The owner',
        'One List tier': 'The classification',
      })
    })
  })
})
