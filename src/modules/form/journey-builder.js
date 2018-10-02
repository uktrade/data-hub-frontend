const express = require('express')
const { isString, isEmpty, set, get } = require('lodash')

const { getErrors } = require('./errors')

const getRender = (step) => {
  return (req, res) => {
    (step.breadcrumbs || []).forEach((breadcrumb) => {
      res.breadcrumb(breadcrumb.name, breadcrumb.url)
    })

    res.render(`_layouts/${step.type}`, {
      heading: step.heading,
      form: {
        ...step.macro({
          ...res.locals,
          errors: get(res.locals, 'form.errors.messages'),
        }),
        ...res.locals.form,
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
      .post(...middleware, (req, res, next) => {
        const errors = getErrors(step.macro(res.locals).children, req.body)
        if (!isEmpty(errors)) {
          set(res.locals, 'form.errors.messages', errors)
          return next()
        }

        res.redirect(getNextPath(step, req.body, req.baseUrl))
      }, render)
  })

  return router
}

module.exports = {
  build,
}
