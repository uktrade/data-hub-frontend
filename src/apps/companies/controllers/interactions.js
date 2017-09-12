/**
 *
 *  HTTP Get call to get a list of interactions for a company
 *  Gets a list of interactions associated with a company
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
function renderInteractions (req, res, next) {
  try {
    const { name, id } = res.locals.company

    res
      .breadcrumb(name, `/viewcompanyresult/${id}`)
      .breadcrumb('Interactions')
      .render('companies/views/interactions', {
        tab: 'interactions',
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
