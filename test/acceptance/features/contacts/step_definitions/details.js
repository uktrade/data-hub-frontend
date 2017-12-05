const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { map, find, set } = require('lodash')

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

  Then(/^the contact heading company link is clicked$/, async function () {
    await Contact
      .waitForElementPresent('@headingCompanyLink')
      .click('@headingCompanyLink')
  })
})
