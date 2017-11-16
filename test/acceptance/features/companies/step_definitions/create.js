const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { set } = require('lodash')

defineSupportCode(({ Given }) => {
  const Company = client.page.Company()

  Given('a company is created', async function () {
    await client
      .url(this.urls.companies.search)

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany({}, (company) => {
        set(this.state, 'company', company)
        set(this.state, 'company.registeredAddress', [
          this.state.company.address1,
          this.state.company.postcode,
          this.state.company.town,
        ].join(', '))
      })
      .wait() // wait for backend to sync
  })
})
