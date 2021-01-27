const qs = require('querystring')
const { trimEnd, endsWith } = require('lodash')

/**
 * Removes trailing slashes.
 *
 * Taken from 'Slashify' (https://www.npmjs.com/package/slashify), but fixes a
 * security bug whereby users could be redirected to another domain. The fix
 * validates that the resulting url does not go to another domain.
 */
function fixSlashes() {
  return function (req, res, next) {
    const pathname = req.path

    // const method = req.method.toLowerCase()

    const redirectPathname = endsWith(pathname, '/')
      ? trimEnd(pathname, '/')
      : false

    const validRedirect = redirectPathname && isInternal(redirectPathname)

    if (validRedirect) {
      return redirect(redirectPathname)
    } else {
      // no redirect needed
      next()
    }

    function redirect(redirectUrl) {
      const query = qs.stringify(req.query)

      redirectUrl += query ? '?' + query : ''
      res.writeHead(301, { Location: redirectUrl })
      res.end()
    }
  }
}

function isInternal(pathname) {
  return pathname.match(/^\/(?!\/)/) ? true : false
}

module.exports = fixSlashes
