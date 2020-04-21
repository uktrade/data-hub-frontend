# Routing

## [React Router] & [Express]

Until we achieve the very unlikely state of the application where there would
only be a single [Express] route `/` serving a static `index.html` (in which
case the contraption described in this document should be replaced with
[express-history-api-fallback]), [React Router] must somehow coexist with the
various [Express] routes.

In essence, if an [Express] route renders a template with a React component which
uses [React Router], then the [Express] route should act as a
_SPA fallback_ i.e. the [Express] route should accept trailing path segments
recognized by the [React Router] in the React component and serve the same
content for each of them.

Let's say for example that there is an [Express] route `/foo/:id` which renders
a React component with a routed tab navigation with _Bar_ and _Baz_ tabs
associated with `/bar` and `/baz` [React Router] paths respectively and that
there is also another [Express] route `/foo/:id/bing` which renders a completely
independent page. The desired behavior then is that when a user lands on:

* `/foo/123` the tab navigation should be rendered with no tab selected
* `/foo/123/bar` the _Bar_ tab should be selected
* `/foo/123/baz` the _Baz_ tab should be selected
* `/foo/123/bing` the independent page is rendered

For this to work, we need to have two measures in place:

### [Express] route SPA fallback

The [Express] route `/foo/:id` also needs to accept the `/bar` and `/baz`
suffixes, which can be achieved in different ways, depending on whether the
other [Express] route `/foo/:id/bing` was defined before or after the `/foo/:id`
route. There are cases in this codebase where we can't easily change the route
definition order, e.g.
[the routes are defined in the order the file system reads modules](../src/apps/routers.js).

If the bing path is defined before the SPA route, we can just make the SPA route
accept any trailing part by adding the asterisk `*` at its end:
```js
app.get('/foo/:id/bing', bingHandler)
app.get('/foo/:id/*', spaHandler)
```

If the definition order is reversed and we keep the asterisk, the SPA route
would capture the _bing_ route and would render the SPA page instead of the
_bing_ page:
```js
app.get('/foo/:id/*', spaHandler)
// The bingHandler will never be reached
app.get('/foo/:id/bing', bingHandler)
```

The SPA route thus needs to ensure that it doesn't capture the _bing_ path,
either by enumerating all the possible trailing paths:
```js
app.get(['/foo/:id/bar', '/foo/:id/baz'], spaHandler)
app.get('/foo/:id/bing', bingHandler)
```

Or by accepting anything except the _bing_ path:
```js
app.get(/\/foo\/(?<id>.*)\/(?!bing)/, spaHandler)
app.get('/foo/:id/bing', bingHandler)
```

### [React Router] basename

[React Router] needs to know which part of the path it should manage.
In our example, the `/foo/123` part is managed by [Express] and the rest
with the exception of `/bing` is managed by [React Router]. The way to let
[React Router] know is to set its `basename` prop to `"/foo/123"`.
The problem is though that the value we need to pass to `basename` depends on
the [Express] route that renders a particular component.
The value thus needs to be managed in [Express] and it should be done with the
[spaBasePath] middleware.

#### The [`spaBasePath`] middleware

The middleware should be placed in front of a request handler (controller) and
should be passed an [Express] route definition denoting the _base path_:

```js
app.get(
  ['/foo/:id/bar', '/foo/:id/baz'],
  spaBasePath('/foo/:id'),
  spaHandler,
)
```

When a matching path e.g. `/foo/123/bar` reaches the route, the middleware
extracts the leading part from the path that matches `/foo/:id` e.g. `/foo/123`
and assigns it to `res.locals.basePath`, which if set, will then be rendered as
`<base href="/foo/123"/>` in the base template's `<head/>`.
If the path won't match `/foo/:id`, the middleware will throw a `NotFound` error
resulting in a `404` page.

In modern browsers the `href` value of the `<base/>` element is accessible as
`document.baseURI`, which is what we are actually passing to [React Router]'s
`basename` prop.

Should you ever encounter a case where the [spaBasePath] middleware doesn't
meet your needs, you can always resort to manually assign a value to 
`res.locals.basePath`.

[express-history-api-fallback]: https://www.npmjs.com/package/express-history-api-fallback
[React Router]: https://reacttraining.com/react-router/web/guides/quick-start
[Express]: https://expressjs.com/
[`spaBasePath`]: ../src/middleware/spa-base-path.js
