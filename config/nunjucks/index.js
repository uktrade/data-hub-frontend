const nunjucks = require('nunjucks')
const njkMarkdown = require('nunjucks-markdown')
const md = require('markdown-it')({
  html: true,
  typographer: true,
  breaks: true,
  linkify: true,
})

const logger = require('../logger')
const templateGlobals = require('./globals')

const COMPONENTS_PATH = '_components/' // relative to templates path
const COMPONENT_EXT = 'njk'
const WHITESPACE_AT_START = /^\s+/
const WHITESPACE_BETWEEN_TAGS = />\s+</g
const WHITESPACE_AT_END = /\s+$/

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

function SafeSpacelessExtension () {
  this.tags = ['safespaceless']

  this.parse = function (parser, nodes) {
    const token = parser.nextToken()
    const args = parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(token.value)
    const body = parser.parseUntilBlocks('end' + this.tags[0])
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtension(this, 'run', args, [body])
  }

  this.run = function (context, body) {
    const result = body()
      .replace(WHITESPACE_AT_START, '')
      .replace(WHITESPACE_BETWEEN_TAGS, '><')
      .replace(WHITESPACE_AT_END, '')
    return new nunjucks.runtime.SafeString(result)
  }
}

module.exports = (app, config) => {
  const env = nunjucks.configure([
    `${config.root}/src/apps`,
    `${config.root}/src/templates`,
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
  env.addExtension('SafeSpacelessExtension', new SafeSpacelessExtension())

  // Global variables
  Object.keys(templateGlobals).forEach((global) => {
    env.addGlobal(global, templateGlobals[global])
  })

  // Add markdown support
  njkMarkdown.register(env, (body) => {
    return md.render(body)
  })

  return env
}
