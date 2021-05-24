const renderContactsView = async (req, res, next) => {
  try {
    const props = {
      title: 'Contacts',
      heading: 'Contacts',
    }

    return res.render('contacts/views/contacts', { props })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderContactsView,
}
