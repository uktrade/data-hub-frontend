const { get } = require('lodash')

const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { map, find, set } = require('lodash')

const { getAddress } = require('../../../helpers/address')

defineSupportCode(({ Given, Then, When }) => {
  const Contact = client.page.Contact()

  When(/^browsing to contact fixture (.+)$/, async function (contactName) {
    const contacts = map(this.fixtures.contact, (contact) => { return contact })
    const contact = find(contacts, { name: contactName })
    const url = this.urls.contacts.getDetails(contact.pk)

    set(this.state, 'contact', contact)

    await client
      .url(url)
  })

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
