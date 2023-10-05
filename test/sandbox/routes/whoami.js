import whoamiJson from '../fixtures/whoami.json' assert { type: 'json' }

var defaultTeamId = whoamiJson.dit_team.id
var defaultAdviserId = whoamiJson.id
var defaultPermissions = whoamiJson.permissions

export const whoami = function (req, res) {
  res.json(whoamiJson)
}

export const setWhoami = function (req, res) {
  if (req.body.id) {
    whoamiJson.id = req.body.id
  }
  if (req.body.dit_team_id) {
    whoamiJson.dit_team.id = req.body.dit_team_id
  }
  if (req.body.active_features) {
    whoamiJson.active_features = req.body.active_features
  }
  if (req.body.active_feature_groups) {
    whoamiJson.active_feature_groups = req.body.active_feature_groups
  }
  if (req.body.permissions) {
    whoamiJson.permissions = req.body.permissions
  }
  res.json(whoamiJson)
}

export const resetWhoami = function (req, res) {
  whoamiJson.id = defaultAdviserId
  whoamiJson.dit_team.id = defaultTeamId
  whoamiJson.active_features = []
  whoamiJson.active_feature_groups = []
  whoamiJson.permissions = defaultPermissions
  res.json(whoamiJson)
}
