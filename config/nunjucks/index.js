const nunjucks = require('nunjucks')

const logger = require('../logger')
const templateGlobals = require('./globals')

const COMPONENTS_PATH = '_components/' // relative to views path
const COMPONENT_EXT = 'njk'

function ComponentExtension (env) {
  this.tags = ['component']

  this.parse = function parse (parser, nodes) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)

    parser.advanceAfterBlockEnd(tok.value)

    return new nodes.CallExtension(this, 'run', args)
  }

  this.run = function run (context, name, ...locals) {
    let result = ''

    try {
      const localsData = Object.assign(...locals)
      result = env.render(`${COMPONENTS_PATH}${name}.${COMPONENT_EXT}`, localsData)
    } catch (e) {
      if (e.message.includes('template not found')) {
        result = `Component '${name}' does not exist`
      } else {
        result = e.message
      }

      logger.error(result)
    }

    return new nunjucks.runtime.SafeString(result)
  }
}

module.exports = (app, config) => {
  const env = nunjucks.configure([
    `${config.root}/src/apps`,
    `${config.root}/src/views`,
  ], {
    autoescape: true,
    express: app,
    watch: config.isDev,
    noCache: config.isDev,
  })
  const tradeElementsFilters = require('./trade-elements-filters')
  const dataHubFilters = require('./filters')
  const filters = Object.assign({}, tradeElementsFilters, dataHubFilters)

  // Custom filters
  Object.keys(filters).forEach((filter) => {
    env.addFilter(filter, filters[filter])
  })

  // Custom extensions
  env.addExtension('ComponentExtension', new ComponentExtension(env))

  // Global variables
  Object.keys(templateGlobals).forEach((global) => {
    env.addGlobal(global, templateGlobals[global])
  })

  return env
}
