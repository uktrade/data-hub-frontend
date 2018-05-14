const { get, snakeCase } = require('lodash')

const { POLICY_FEEDBACK_PERMISSIONS } = require('../constants')

/**
 * handlePolicyPermissions
 *
 * Handles checking additional permissions associated with policy feedback
 * interaction types.
 */
function handlePolicyPermissions (action) {
  return function (req, res, next) {
    const permissions = get(req, 'session.user.permissions')
    const kind = get(res, 'locals.interaction.kind') || get(req, 'params.kind')

    if (snakeCase(kind) === 'policy_feedback' && !permissions.includes(POLICY_FEEDBACK_PERMISSIONS[action])) {
      return next({ statusCode: 403 })
    }

    next()
  }
}

module.exports = {
  handlePolicyPermissions,
}
