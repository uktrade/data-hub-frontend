const archive = require('./archive.controller')
const audit = require('./audit.controller')
const create = require('./create.controller')
const details = require('./details.controller')
const edit = require('./edit.controller')
const start = require('./start.controller')
const team = require('./team.controller')
const interactions = require('./interactions')

module.exports = {
  archive,
  audit,
  create,
  details,
  edit,
  start,
  team,
  interactions,
}
