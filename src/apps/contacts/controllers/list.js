const { omit, merge } = require('lodash')
const { contactFiltersFields: filtersFields, contactSortForm } = require('../macros')

function renderContactList (req, res) {
  const sortForm = merge({}, contactSortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  res.render('contacts/views/list', {
    title: 'Contacts',
    sortForm,
    filtersFields,
  })
}

module.exports = {
  renderContactList,
}
