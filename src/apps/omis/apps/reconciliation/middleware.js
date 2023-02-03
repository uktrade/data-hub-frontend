function setReconciliationJourney(req, res, next) {
  res.locals.reconciliationJourney = true
  next()
}

module.exports = {
  setReconciliationJourney,
}
