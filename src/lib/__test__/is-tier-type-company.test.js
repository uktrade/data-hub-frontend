const { isItaTierDAccount } = require('../is-tier-type-company')

describe('Check tier type', () => {
  describe('#isItaTierDAccount', () => {
    const companyA = {
      one_list_group_tier: {
        id: '1929c808-99b4-4abf-a891-45f2e187b410',
      },
    }
    const companyB = {
      one_list_group_tier: {
        id: '1',
      },
    }
    context('when a company is in Tier D International Adviser Trade Accounts', () => {
      it('should return true', () => {
        expect(isItaTierDAccount(companyA)).to.equal(true)
      })
    })
    context('when a company is not in Tier D International Adviser Trade Accounts but is in the One List', () => {
      it('should return false', () => {
        expect(isItaTierDAccount(companyB)).to.equal(false)
      })
    })
  })
})
