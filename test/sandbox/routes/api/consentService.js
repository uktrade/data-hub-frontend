exports.person = function(req, res) {
  res.json({})
}

exports.bulkPerson = function(req, res) {
  res.json({ count: 0, next: null, previous: null, results: [] })
}
