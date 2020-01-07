const { find } = require('lodash')

const { contact } = require('../../fixtures')

module.exports = {
  url: function contactFixtureUrl(contactName) {
    const fixture = find(contact, { name: contactName })
    const contactId = fixture ? fixture.id : contact.georginaClark.id

    return `${process.env.QA_HOST}/contacts/${contactId}/interactions`
  },
  elements: {},
}
