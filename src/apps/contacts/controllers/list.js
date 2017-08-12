const { CONTACTS_SORT_OPTIONS } = require('../constants')
const { buildSortObject } = require('../../builders')

function renderContactList (req, res) {
  res.render('contacts/views/list', {
    title: 'Contacts',
    sort: buildSortObject(CONTACTS_SORT_OPTIONS, req.query),
  })
}

module.exports = {
  renderContactList,
}
