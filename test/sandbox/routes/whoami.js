var whoami = require('../fixtures/whoami.json')

var defaultTeamId = whoami.dit_team.id

exports.whoami = function (req, res) {
  res.json(whoami)
}

exports.setUserDitTeam = function (req, res) {
  whoami.dit_team.id = req.body.id
  res.json(whoami)
}

exports.resetUserDitTeam = function (req, res) {
  whoami.dit_team.id = defaultTeamId
  res.json(whoami)
}
