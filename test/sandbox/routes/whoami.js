var whoami = require('../fixtures/whoami.json')

var defaultTeamId = whoami.dit_team.id
var defaultAdviserId = whoami.id

exports.whoami = function (req, res) {
  res.json(whoami)
}

exports.setWhoami = function (req, res) {
  if (req.body.dit_team_id) {
    whoami.dit_team.id = req.body.dit_team_id
  }
  if (req.body.id) {
    whoami.id = req.body.id
  }
  res.json(whoami)
}

exports.resetWhoami = function (req, res) {
  whoami.dit_team.id = defaultTeamId
  whoami.id = defaultAdviserId
  res.json(whoami)
}
