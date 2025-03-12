import whoami from '../fixtures/whoami.json' with { type: 'json' }

var defaultTeamId = whoami.dit_team.id
var defaultAdviserId = whoami.id
var defaultPermissions = whoami.permissions

export const getWhoami = function (req, res) {
  res.json(whoami)
}

export const setWhoami = function (req, res) {
  if (req.body.id) {
    whoami.id = req.body.id
  }
  if (req.body.dit_team_id) {
    whoami.dit_team.id = req.body.dit_team_id
  }
  if (req.body.active_features) {
    whoami.active_features = req.body.active_features
  }
  if (req.body.active_feature_groups) {
    whoami.active_feature_groups = req.body.active_feature_groups
  }
  if (req.body.permissions) {
    whoami.permissions = req.body.permissions
  }
  res.json(whoami)
}

export const resetWhoami = function (req, res) {
  whoami.id = defaultAdviserId
  whoami.dit_team.id = defaultTeamId
  whoami.active_features = []
  whoami.active_feature_groups = []
  whoami.permissions = defaultPermissions
  res.json(whoami)
}
