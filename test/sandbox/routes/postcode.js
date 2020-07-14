var postcodeToRegion = require('../fixtures/postcodeToRegion.json')

exports.toRegion = function(req, res) {
  if (req.query.postcode === 'UNK N0WN') {
    return res.json({
      results: [],
    })
  }

  res.json(postcodeToRegion)
}

exports.lookup = function(req, res) {
  return res.json({
    Latitude: 51.4997693,
    Longitude: -0.1349735,
    Addresses: [
      'D S D Ltd, 102 Petty France, Westminster, , , London, Greater London',
      'DESIGN102, 102 Petty France, Westminster, , , London, Greater London',
      'Her Majesty’s Courts and Tribunals Service, 102 Petty France, Westminster, , , London, Greater London',
      'Judicial Appointments Commission, 102 Petty France, Westminster, , , London, Greater London',
      'Legal Aid Agency (London), 102 Petty France, Westminster, , , London, Greater London',
      'Ministry of Justice, 102 Petty France, , , , London, ',
      'National Probation Service, 102 Petty France, Westminster, , , London, Greater London',
    ],
  })
}
