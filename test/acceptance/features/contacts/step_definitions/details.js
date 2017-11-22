const { get } = require('lodash')

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const { getAddress } = require('../../../helpers/address')

defineSupportCode(({ Given, Then, When }) => {
  const Contact = client.page.Contact()

  Then(/^the contact details are displayed$/, async function () {
    const contactAddress = getAddress(get(this.state, 'contact'))

    const {
      jobTitle,
      telephoneCountryCode,
      telephoneNumber,
      emailAddress,
      alternativePhoneNumber,
      alternativeEmail,
      notes,
      acceptsEmailMarketingFromDit,
    } = this.state.contact

    const expectedTelephoneNumber = `(${telephoneCountryCode}) ${telephoneNumber}`

    await Contact
      .section.contactDetails
      .assert.containsText('@jobTitle', jobTitle)
      .assert.containsText('@phoneNumber', expectedTelephoneNumber)
      .assert.containsText('@email', emailAddress)
      .assert.containsText('@emailMarketing', acceptsEmailMarketingFromDit)
      .assert.containsText('@address', contactAddress)
      .assert.containsText('@alternativeTelephone', alternativePhoneNumber)
      .assert.containsText('@alternativeEmail', alternativeEmail)
      .assert.containsText('@notes', notes)
  })

  Then(/^the contact heading company link is clicked$/, async function () {
    await Contact
      .click('@headingCompanyLink')
  })
})
