const { get, isEmpty } = require('lodash')
const { title } = require('case')
const Sniffr = require('sniffr')

const config = require('../../../config')
const logger = require('../../../config/logger')
const { postToZenDesk } = require('./services')

function populateFormData (req, res, next) {
  const sniffr = new Sniffr()
  sniffr.sniff(req.headers['user-agent'])

  res.locals.form = Object.assign({}, res.locals.form, {
    data: {
      title: req.body.title,
      feedbackType: req.body.feedbackType,
      description: req.body.description,
      email: req.body.email,
      browser: req.body.browser || `${title(sniffr.browser.name)} ${sniffr.browser.versionString}, ${title(sniffr.os.name)} ${sniffr.os.versionString}`,
    },
    options: {
      feedbackType: [
        {
          value: 'bug',
          label: 'Problem',
        },
        {
          value: 'feedback',
          label: 'Feedback',
        },
      ],
    },
  })

  next()
}

function validateForm (req, res, next) {
  const errors = {
    messages: {},
  }

  if (!req.body.title) {
    errors.messages.title = 'Your feedback needs a title'
  }
  if (!req.body.feedbackType) {
    errors.messages.feedbackType = 'You need to choose between raising a problem and leaving feedback'
  }
  if (!!req.body.email && !req.body.email.match(/.*@.*\..*/)) {
    errors.messages.email = 'A valid email address is required'
  }

  res.locals.form = Object.assign({}, res.locals.form, {
    errors,
  })

  next()
}

async function submitForm (req, res, next) {
  const errorMessages = get(res.locals, 'form.errors.messages')

  if (!isEmpty(errorMessages)) {
    return next()
  }

  const ticket = {
    requester: {
      name: 'Data Hub user',
      email: req.body.email || undefined,
    },
    subject: req.body.title,
    comment: {
      body: req.body.description || 'N/A',
    },
    custom_fields: [
      { id: config.zenBrowser, value: req.body.browser },
      { id: config.zenService, value: 'datahub_export' },
    ],
    tags: [req.body.type],
  }

  try {
    const response = await postToZenDesk(ticket)
    req.flash('success', `Created new report, reference number ${response.data.ticket.id}`)
    res.redirect('/support/thank-you')
  } catch (error) {
    logger.error(error)
    res.locals.form.errors = {
      summary: error.message,
    }
    next()
  }
}

module.exports = {
  populateFormData,
  submitForm,
  validateForm,
}
