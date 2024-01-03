export const person = function (req, res) {
  res.json({})
}

export const bulkPerson = function (req, res) {
  res.json({ count: 0, next: null, previous: null, results: [] })
}
