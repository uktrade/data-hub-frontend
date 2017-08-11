const { assign, omit, isFunction, map } = require('lodash')
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

  // Constructs macro from a specially formatted object:
  // { MacroName: { prop1: 'A', prop2: 'B' } }
  applyMacro (config, sharedProps) {
    function renderMacro (macroConfig) {
      return map(macroConfig, (props, name) => {
        const macro = this.env.globals.callAsMacro.call(this, name)

        if (!macro) { return }

        return macro(assign({}, sharedProps, props))
      })[0]
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
