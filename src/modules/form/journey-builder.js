const express = require('express')

const { isString } = require('lodash')

const getRender = (step) => {
  return (req, res) => {
    (step.breadcrumbs || []).forEach((breadcrumb) => {
      res.breadcrumb(breadcrumb.name, breadcrumb.url)
    })

    res.render(`_layouts/${step.type}`, {
      heading: step.heading,
      form: {
        ...step.macro(res.locals),
        errors: res.locals.errors,
      },
    })
  }
}

const getNextPath = (step, requestBody, baseUrl) => {
  const routePath = isString(step.nextPath) ? step.nextPath : step.nextPath(requestBody)
  return baseUrl + routePath
}

const build = (journey) => {
  const router = express.Router()

  journey.steps.forEach(step => {
    const middleware = step.middleware || []
    const render = getRender(step)
    router.route(step.path)
      .get(...middleware, render)
      .post(...middleware, (req, res) => {
        res.redirect(getNextPath(step, req.body, req.baseUrl))
      })
  })

  return router
}

module.exports = {
  build,
}
