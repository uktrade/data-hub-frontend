export function person(req, res) {
  res.json({})
}

export function bulkPerson(req, res) {
  res.json({ count: 0, next: null, previous: null, results: [] })
}
