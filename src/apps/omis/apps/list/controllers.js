function renderCollectionList (req, res) {
  res.render('omis/apps/list/views/list-collection')
}

function renderReconciliationList (req, res) {
  res.render('omis/apps/list/views/list-reconciliation')
}

module.exports = {
  renderCollectionList,
  renderReconciliationList,
}
