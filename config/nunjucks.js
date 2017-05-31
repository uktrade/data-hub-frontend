const nunjucks = require('nunjucks')
const winston = require('winston')

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

      winston.error(result)
    }

    return new nunjucks.runtime.SafeString(result)
  }
}

module.exports = (app, config) => {
  const env = nunjucks.configure([
    `${config.root}/src/views`,
    `${config.root}/node_modules/@uktrade/trade_elements/dist/nunjucks`
  ], {
    autoescape: true,
    express: app,
    watch: config.isDev
  })

  // Custom filters
  const filters = require(`@uktrade/trade_elements/dist/nunjucks/filters`)

  filters.stringify = JSON.stringify
  filters.values = Object.values

  Object.keys(filters).forEach((filterName) => {
    env.addFilter(filterName, filters[filterName])
  })

  // Custom extensions
  env.addExtension('ComponentExtension', new ComponentExtension(env))

  // Global variables

  return env
}
