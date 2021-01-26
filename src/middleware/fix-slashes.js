const qs = require('querystring')
const { trimEnd, endsWith } = require('lodash')

/**
 * Removes trailing slashes.
 *
 * Taken from 'Slashify' (https://www.npmjs.com/package/slashify), but fixes a
 * security bug whereby users could be redirected to another domain. The fix
 * employs code from another package, 'Express Slash'
 * https://www.npmjs.com/package/express-slash to validate that the resulting
 * url exists in the app router.
 */
function fixSlashes() {
  return function (req, res, next) {
    const pathname = req.path

    const method = req.method.toLowerCase()

    const redirectPathname = endsWith(pathname, '/')
      ? trimEnd(pathname, '/')
      : false

    const match =
      redirectPathname &&
      testStackForMatch(req.app._router.stack, method, redirectPathname)
    if (match) {
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

/**
 * Checks that the given path and method exist in the app's route stack.
 *
 * This is taken from 'Express Slash' https://www.npmjs.com/package/express-slash
 */
function testStackForMatch(stack, method, path) {
  return stack.some(function (layer) {
    const route = layer.route,
      subStack = layer.handle.stack

    // It's only a match if the stack layer is a route.
    if (route) {
      return route.methods[method] && layer.match(path)
    }

    if (subStack) {
      // Trim any `.use()` prefix.
      if (layer.path) {
        path = trimPrefix(path, layer.path)
      }

      // Recurse into nested apps/routers.
      return testStackForMatch(subStack, method, path)
    }

    return false
  })
}

/**
 * Remove the given prefix from a url.
 *
 * This is taken from 'Express Slash' https://www.npmjs.com/package/express-slash
 */
function trimPrefix(path, prefix) {
  const charAfterPrefix = path.charAt(prefix.length)

  if (charAfterPrefix === '/' || charAfterPrefix === '.') {
    path = path.substring(prefix.length)

    if (path.charAt(0) !== '/') {
      path = '/' + path
    }
  }

  return path
}

module.exports = fixSlashes
