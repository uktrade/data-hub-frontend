var postcodeToRegion = require('../fixtures/postcodeToRegion.json')

exports.lookup = function(req, res) {
  if (req.query.postcode === 'UNK N0WN') {
    return res.json({
      results: [],
    })
  }

  res.json(postcodeToRegion)
}
