const nunjucks = require('nunjucks')
const { assign, omit, isFunction, isArray, map } = require('lodash')
const queryString = require('query-string')

module.exports = {
  serviceTitle: 'Data Hub',
  projectPhase: 'alpha',
  description: 'Data Hub is a customer relationship, project management and analytical tool for Department for International Trade.',
  feedbackLink: '/support',

  callAsMacro (name) {
    const macro = this.ctx[name]

    if (!isFunction(macro)) { return }

    return macro
  },

  // Constructs macro from a specially formatted object or array of objects:
  // { MacroName: { prop1: 'A', prop2: 'B' } }
  applyMacro (config) {
    function renderMacro (macroConfig) {
      return map(macroConfig, (props, name) => {
        const macro = this.env.globals.callAsMacro.call(this, name)
        return macro(props)
      })[0]
    }

    if (isArray(config)) {
      const macroOutpus = config.map(renderMacro.bind(this))
      return new nunjucks.runtime.SafeString(macroOutpus.join('\r'))
    }

    return renderMacro.call(this, config)
  },

  buildQuery (query = {}, include = {}, excludeKeys = []) {
    return queryString.stringify(
      assign(
        include,
        omit(query, [...excludeKeys], 'page'),
      )
    )
  },
}
