/**
 * Easy to use generic breadcrumbs middleware for Express.
 */

const {
  isArray,
  isObject,
  each,
  extend,
  find,
  includes,
} = require('lodash')

/**
 * Breadcrumbs initialization.
 * Intializes Breadcrumbs for incoming requests, adds `breadcrumbs()` method to `res`.
 *
 * Examples:
 *      app.use(breadcrumbs.init())
 *
 * @return {Function}
 */
function init () {
  return function (req, res, next) {
    let breadcrumbs = []

    function addBreadcrumb (item) {
      if (!includes(breadcrumbs, item)) {
        breadcrumbs.push(item)
      }
    }

    function addBreadcrumbs (name, url) {
      if (arguments.length === 0) {
        return breadcrumbs
      }

      if (arguments.length === 1) {
        if (isArray(name)) {
          each(name, addBreadcrumb)
        } else if (isObject(name)) {
          addBreadcrumb(name)
        } else {
          addBreadcrumb({ name })
        }
      } else if (arguments.length === 2) {
        addBreadcrumb({
          name: name,
          url: url,
        })
      }

      return this
    }

    function cleanBreadcrumbs () {
      breadcrumbs = []
    }

    cleanBreadcrumbs()
    res.breadcrumb = addBreadcrumbs
    next()
  }
}

/**
 * Set Breadcrumbs home information.
 *
 * Examples:
 *      app.use(breadcrumbs.setHome())
 *      app.use('/admin', breadcrumbs.setHome({
 *        name: 'Dashboard',
 *        url: '/admin'
 *      }))
 *
 * @param {Object} options
 *  - name    home name, default `Home`
 *  - url     home url, default `/`
 * @return {Function}
 */
function setHome (options = {}) {
  const homeName = options.name || 'Home'
  const homeUrl = options.url || '/'

  return function (req, res, next) {
    const homeBreadcrumb = find(res.breadcrumb(), (breadcrumb) => {
      return breadcrumb._home
    })

    if (!homeBreadcrumb) {
      res.breadcrumb({
        name: homeName,
        url: homeUrl,
        _home: true,
      })
    } else {
      extend(homeBreadcrumb, {
        name: homeName,
        url: homeUrl,
      })
    }

    next()
  }
}

module.exports = {
  init,
  setHome,
}
