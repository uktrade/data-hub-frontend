const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')
const { set, get, assign } = require('lodash')

const Company = client.page.companies.company()

When(/^the Account management details are updated$/, async function () {
  await Company
    .updateAccountManagement((accountManagement) => {
      const company = get(this.state, 'company')
      set(this.state, 'company', assign({}, company, accountManagement))
    })
})
