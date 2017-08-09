const { buildContactSorting } = require('../builders')

function renderContactList (req, res) {
  res.render('contacts/views/list', {
    title: 'Contacts',
    sort: buildContactSorting(req.query),
  })
}

module.exports = {
  renderContactList,
}
