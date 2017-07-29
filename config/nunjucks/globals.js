const { assign, omit, isFunction } = require('lodash')
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

  buildQuery (query = {}, include = {}, excludeKeys = []) {
    return queryString.stringify(
      assign(
        include,
        omit(query, [...excludeKeys], 'page'),
      )
    )
  },
}
