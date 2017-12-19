const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { set, get, assign } = require('lodash')

defineSupportCode(({ When }) => {
  const Company = client.page.Company()

  When(/^the Account management details are updated$/, async function () {
    await Company
      .updateAccountManagement((accountManagement) => {
        const company = get(this.state, 'company')
        set(this.state, 'company', assign({}, company, accountManagement))
      })
  })

  When(/^the Exports details are updated$/, async function () {
    await Company
      .updateExports((exports) => {
        const company = get(this.state, 'company')
        set(this.state, 'company', assign({}, company, exports))
      })
  })
})
