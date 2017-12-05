const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { set, get, assign } = require('lodash')

defineSupportCode(({ Given, When }) => {
  const Company = client.page.Company()

  Given(/^a company is created$/, async function () {
    await client
      .url(this.urls.companies.search)

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany({}, (company) => {
        set(this.state, 'company', company)
      })
      .wait() // wait for backend to sync
  })

  When(/^the Account management details are updated$/, async function () {
    await Company
      .updateAccountManagement((accountManagement) => {
        const company = get(this.state, 'company')
        set(this.state, 'company', assign({}, company, accountManagement))
      })
  })
})
