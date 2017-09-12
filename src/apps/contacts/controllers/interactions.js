/**
 *
 *  HTTP Get call to get a list of interactions for a contact
 */
function renderInteractions (req, res, next) {
  try {
    const { name, id } = res.locals.contact

    res
      .breadcrumb(name, `/contact/${id}`)
      .breadcrumb('Interactions')
      .render('contacts/views/interactions')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
