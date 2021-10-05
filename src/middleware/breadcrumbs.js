/**
 * Easy to use generic breadcrumbs middleware for Express.
 */

const { isArray, isObject, each, extend, find, includes } = require('lodash')
const { PRIMARY_LINK_PARAMS } = require('../common/constants.js')

/**
 * Breadcrumbs initialization.
 * Intializes Breadcrumbs for incoming requests, adds `breadcrumbs()` method to `res`.
 *
 * Examples:
 *      app.use(breadcrumbs.init())
 *
 * @return {Function}
 */

function init() {
  return function (req, res, next) {
    let breadcrumbs = []

    function setDefaultParamsOnRoute(href) {
      const paths = {
        '/companies': `/companies${PRIMARY_LINK_PARAMS.companies}`,
        '/contacts': `/contacts${PRIMARY_LINK_PARAMS.contacts}`,
        '/events': `/events${PRIMARY_LINK_PARAMS.events}`,
        '/interactions': `/interactions${PRIMARY_LINK_PARAMS.interactions}`,
        '/investments': `/investments${PRIMARY_LINK_PARAMS.investments}`,
        '/omis': `/omis${PRIMARY_LINK_PARAMS.omis}`,
      }
      return paths[href] || href
    }

    function addBreadcrumb(item) {
      if (!includes(breadcrumbs, item)) {
        item.href
          ? breadcrumbs.push({
              ...item,
              href: setDefaultParamsOnRoute(item.href),
            })
          : breadcrumbs.push(item)
      }
    }

    function addBreadcrumbs(text, href) {
      if (arguments.length === 0) {
        return breadcrumbs
      }

      if (arguments.length === 1) {
        if (isArray(text)) {
          each(text, addBreadcrumb)
        } else if (isObject(text)) {
          addBreadcrumb(text)
        } else {
          addBreadcrumb({ text })
        }
      } else if (arguments.length === 2) {
        addBreadcrumb({
          text,
          href,
        })
      }

      return this
    }

    function removeBreadcrumb() {
      breadcrumbs.pop()
    }

    function cleanBreadcrumbs() {
      breadcrumbs = []
    }

    cleanBreadcrumbs()
    res.breadcrumb = addBreadcrumbs
    res.removeBreadcrumb = removeBreadcrumb
    next()
  }
}

/**
 * Set Breadcrumbs home information.
 *
 * Examples:
 *      app.use(breadcrumbs.setHome())
 *      app.use('/admin', breadcrumbs.setHome({
 *        text: 'Dashboard',
 *        href: '/admin'
 *      }))
 *
 * @param {Object} options
 *  - text    home text, default `Home`
 *  - href     home href, default `/`
 * @return {Function}
 */
function setHome(options = {}) {
  const homeText = options.text || 'Home'
  const homeHref = options.href || '/'

  return function (req, res, next) {
    const homeBreadcrumb = find(res.breadcrumb(), (breadcrumb) => {
      return breadcrumb._home
    })

    if (!homeBreadcrumb) {
      res.breadcrumb({
        text: homeText,
        href: homeHref,
        _home: true,
      })
    } else {
      extend(homeBreadcrumb, {
        text: homeText,
        href: homeHref,
      })
    }

    next()
  }
}

module.exports = {
  init,
  setHome,
}
