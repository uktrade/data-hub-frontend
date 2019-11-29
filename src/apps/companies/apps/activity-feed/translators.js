const convertQueryTypes = (req, res, next) => {
  // Convert String to Number
  const { from } = req.query
  const { size } = req.query

  if (from) {
    req.query.from = parseInt(from, 10)
  }

  if (size) {
    req.query.size = parseInt(size, 10)
  }

  // Convert String to Boolean
  const { showDnbHierarchy } = req.query
  if (showDnbHierarchy) {
    req.query.showDnbHierarchy = showDnbHierarchy === 'true'
  }

  next()
}

module.exports = {
  convertQueryTypes,
}
