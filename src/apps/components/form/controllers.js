const { macros } = require('./constants')

function renderFormElements (req, res) {
  res.locals.macros = res.locals.macros || macros

  return res
    .breadcrumb('Form elements')
    .render('components/views/form', {
      macros: res.locals.macros || macros,
      entitySearch: Object.assign({}, res.locals.entitySearch, {
        searchTerm: req.query.term,
      }),
    })
}

module.exports = {
  renderFormElements,
}
