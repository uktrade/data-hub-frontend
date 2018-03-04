const { find } = require('lodash')

const { contact } = require('../../fixtures')

module.exports = {
  url: function contactFixtureUrl (contactName) {
    const fixture = find(contact, { name: contactName })
    const contactId = fixture ? fixture.pk : contact.georginaClark.pk

    return `${process.env.QA_HOST}/contacts/${contactId}`
  },
  elements: {},
}
