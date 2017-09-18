const { omit, merge } = require('lodash')
const { interactionSortForm } = require('../macros')

function renderInteractionList (req, res, next) {
  try {
    const sortForm = merge({}, interactionSortForm, {
      hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
      children: [
        { value: req.query.sortby },
      ],
    })

    res.render('interactions/views/list', {
      title: 'Interactions',
      sortForm,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
}
