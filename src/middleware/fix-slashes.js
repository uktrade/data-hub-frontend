const qs = require('querystring')
const url = require('fast-url-parser')
const join = require('path').join
const fileExists = require('file-exists')
const { trimEnd } = require('lodash')

/**
 * Removes trailing slashes.
 *
 * Taken from 'Slashify' (https://www.npmjs.com/package/slashify), but fixes a
 * security bug whereby users could be redirected to another domain. The fix
 * employs code from another package, 'Express Slash'
 * https://www.npmjs.com/package/express-slash to validate that the resulting
 * url exists in the app router.
 */
function fixSlashes(options) {
  options = options || {}

  const root = options.root || './'
  const indexFile = options.index || 'index.html'
  const leaveOnDirectory = options.directory === false ? false : true

  if (options.exists) fileExists = options.exists

  return function (req, res, next) {
    const pathname = url.parse(req.url).pathname
    let redirectPathname = false

    const method = req.method.toLowerCase()

    // Don't remove trailing slash on directory index file
    if (leaveOnDirectory && isDirectoryIndex() && !hasTrailingSlash()) {
      redirectPathname = join(pathname, '/')
    } else if (leaveOnDirectory && isDirectoryIndex()) {
      redirectPathname = false
    } else if (pathname !== '/' && hasTrailingSlash()) {
      redirectPathname = trimEnd(pathname, '/')
    }

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

    function isDirectoryIndex() {
      return fileExists(join(root, req.url.split('?')[0], indexFile))
    }

    function hasTrailingSlash() {
      return pathname.substr(-1) === '/'
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
