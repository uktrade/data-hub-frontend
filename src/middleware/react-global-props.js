const config = require('../config')

const transformModulePermissions = (modules) =>
  modules.map((module) => {
    const isDatahubModule = module.split('-')[0] === 'datahub'
    return isDatahubModule ? module.replace('-', ':') : module
  })

module.exports = () => {
  return function reactGlobalProps(req, res, next) {
    res.locals.globalProps = {
      sentryDsn: config.sentryDsn,
      sentryEnvironment: config.sentryEnvironment,
      csrfToken: req.csrfToken(),
      modulePermissions: transformModulePermissions([
        ...res.locals.ALLOWED_APPS,
        ...res.locals.PERMITTED_APPLICATIONS.map(({ key }) => key),
      ]),
      currentAdviserId: req.session?.user?.id,
    }
    next()
  }
}
