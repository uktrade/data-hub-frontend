const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { set } = require('lodash')

defineSupportCode(({ Given }) => {
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
})
