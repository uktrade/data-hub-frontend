const { SORT_OPTIONS } = require('./constants')
const { buildSortObject } = require('../../../builders')

function renderList (req, res) {
  res.render('omis/apps/list/views/list', {
    sort: buildSortObject(SORT_OPTIONS, req.query),
  })
}

module.exports = {
  renderList,
}
