const router = require('./router')
const labels = require('./labels')
const repo = require('./contact.repo')
const controllers = {
  details: require('./contact.controller'),
  interactions: require('./contact-interaction.controller'),
  edit: require('./contact-edit.controller'),
  archive: require('./contact-archive.controller'),
}
const services = {
  data: require('./contact-data.service'),
  form: require('./contact-form.service'),
  formatting: require('./contact-formatting.service'),
}

module.exports = {
  router,
  labels,
  repo,
  controllers,
  services,
}
