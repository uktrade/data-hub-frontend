const transformAccountManager = require('../company-to-account-manager')
const accountManager = require('../../../../../test/unit/data/companies/account-manager.json')

const actual = {
  name: 'Travis Greene',
  team: 'IST - Sector Advisory Services',
  email: 'travis@travis.com',
}

describe('#transformAccountManager', () => {
  it('should return name, team and email', () => {
    expect(transformAccountManager(accountManager)).to.deep.equal(actual)
  })
})
