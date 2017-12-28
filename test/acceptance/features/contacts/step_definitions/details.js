const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { map, find, set } = require('lodash')

defineSupportCode(({ When }) => {
  When(/^browsing to contact fixture (.+)$/, async function (contactName) {
    const contacts = map(this.fixtures.contact, (contact) => { return contact })
    const contact = find(contacts, { name: contactName })
    const url = this.urls.contacts.getDetails(contact.pk)

    set(this.state, 'contact', contact)

    await client
      .url(url)
  })
})
