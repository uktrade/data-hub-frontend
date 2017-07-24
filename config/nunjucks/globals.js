const { isFunction } = require('lodash')

module.exports = {
  serviceTitle: 'Data Hub',
  projectPhase: 'alpha',
  description: 'Data Hub is a customer relationship, project management and analytical tool for Department for International Trade.',
  feedbackLink: '/support',
  callAsMacro: function (name) {
    const macro = this.ctx[name]

    if (!isFunction(macro)) { return }

    return macro
  },
}
